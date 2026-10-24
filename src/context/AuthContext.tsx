import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import {
  getLocalSession,
  localSignIn,
  localSignOut,
  localSignUp,
} from '../services/localAuth'
import { fetchAdminProfile } from '../services/admin'
import type { AuthResult, AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  isConfigured: boolean
  isAdmin: boolean
  signUpWithEmail: (input: {
    fullName: string
    email: string
    password: string
  }) => Promise<AuthResult>
  signInWithEmail: (input: {
    email: string
    password: string
  }) => Promise<AuthResult>
  signInWithGoogle: () => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshAdminStatus: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function mapSupabaseUser(user: {
  id: string
  email?: string | null
  user_metadata?: Record<string, unknown>
  app_metadata?: Record<string, unknown>
}): AuthUser {
  const meta = user.user_metadata ?? {}
  const fullName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    user.email?.split('@')[0] ||
    'JUST EIGHT Member'

  const provider =
    user.app_metadata?.provider === 'google' ||
    (Array.isArray(user.app_metadata?.providers) &&
      user.app_metadata.providers.includes('google'))
      ? 'google'
      : 'email'

  return {
    id: user.id,
    email: user.email ?? '',
    fullName,
    avatarUrl:
      typeof meta.avatar_url === 'string'
        ? meta.avatar_url
        : typeof meta.picture === 'string'
          ? meta.picture
          : undefined,
    provider,
    isAdmin: false,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const applyAdminFlag = useCallback(async (base: AuthUser | null) => {
    if (!base || !supabase) {
      setUser(base)
      return
    }
    try {
      const isAdmin = await fetchAdminProfile(base.id)
      setUser({ ...base, isAdmin })
    } catch {
      setUser({ ...base, isAdmin: false })
    }
  }, [])

  const refreshAdminStatus = useCallback(async () => {
    if (!user) return
    await applyAdminFlag(user)
  }, [user, applyAdminFlag])

  useEffect(() => {
    let mounted = true
    let unsubscribe: (() => void) | undefined

    async function init() {
      if (supabase) {
        const { data } = await supabase.auth.getSession()
        if (!mounted) return
        const mapped = data.session?.user
          ? mapSupabaseUser(data.session.user)
          : null
        await applyAdminFlag(mapped)

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          const next = session?.user ? mapSupabaseUser(session.user) : null
          void applyAdminFlag(next)
        })
        unsubscribe = () => subscription.unsubscribe()
        setLoading(false)
        return
      }

      const local = getLocalSession()
      // Ensure older local sessions also get admin for product management
      setUser(local ? { ...local, isAdmin: true } : null)
      setLoading(false)
    }

    void init()

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [applyAdminFlag])

  const signUpWithEmail = useCallback(
    async (input: { fullName: string; email: string; password: string }) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email.trim(),
          password: input.password,
          options: {
            data: { full_name: input.fullName.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) return { ok: false, message: error.message }
        if (data.user && !data.session) {
          return {
            ok: true,
            message:
              'Account created. Check your email to confirm, then sign in.',
          }
        }
        return { ok: true, message: 'Account created. You are signed in.' }
      }

      const result = localSignUp(input)
      if (result.user) setUser(result.user)
      return { ok: result.ok, message: result.message }
    },
    [],
  )

  const signInWithEmail = useCallback(
    async (input: { email: string; password: string }) => {
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email: input.email.trim(),
          password: input.password,
        })
        if (error) return { ok: false, message: error.message }
        return { ok: true, message: 'Signed in successfully.' }
      }

      const result = localSignIn(input)
      if (result.user) setUser(result.user)
      return { ok: result.ok, message: result.message }
    },
    [],
  )

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) {
      return {
        ok: false,
        message:
          'Google sign-in needs Supabase. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file, enable Google in Supabase Auth, then restart the server.',
      }
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) return { ok: false, message: error.message }
    return { ok: true, message: 'Redirecting to Google…' }
  }, [])

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut()
    } else {
      localSignOut()
    }
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isConfigured: isSupabaseConfigured,
      isAdmin: Boolean(user?.isAdmin),
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      refreshAdminStatus,
    }),
    [
      user,
      loading,
      signUpWithEmail,
      signInWithEmail,
      signInWithGoogle,
      signOut,
      refreshAdminStatus,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
