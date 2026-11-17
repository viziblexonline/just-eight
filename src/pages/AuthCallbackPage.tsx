import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { notifyAdminAuthEvent } from '../lib/notifyAuth'
import { Button } from '../components/ui/Button'

async function notifyGoogleSession() {
  if (!supabase) return
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user?.email) return
  const meta = user.user_metadata ?? {}
  const fullName =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    undefined
  const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0
  const isNew = createdAt > 0 && Date.now() - createdAt < 5 * 60 * 1000
  void notifyAdminAuthEvent({
    event: isNew ? 'signup' : 'login',
    email: user.email,
    fullName,
    provider: 'google',
  })
}

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function finish() {
      if (!supabase) {
        setError('Supabase is not configured for OAuth callbacks.')
        return
      }

      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      const oauthError =
        url.searchParams.get('error_description') ||
        url.searchParams.get('error')

      if (oauthError) {
        if (active) setError(oauthError)
        return
      }

      if (code) {
        // Session may already exist if another tab/handler finished first
        const { data: existing } = await supabase.auth.getSession()
        if (existing.session) {
          await notifyGoogleSession()
          if (active) navigate('/account', { replace: true })
          return
        }

        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code)
        if (!active) return
        if (exchangeError) {
          const { data: after } = await supabase.auth.getSession()
          if (after.session) {
            await notifyGoogleSession()
            navigate('/account', { replace: true })
            return
          }
          setError(exchangeError.message)
          return
        }
        await notifyGoogleSession()
        navigate('/account', { replace: true })
        return
      }

      const { data, error: sessionError } = await supabase.auth.getSession()
      if (!active) return

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      if (data.session) {
        await notifyGoogleSession()
        navigate('/account', { replace: true })
        return
      }

      // Wait briefly for hash/session hydration from the OAuth redirect
      await new Promise((resolve) => window.setTimeout(resolve, 400))
      const { data: again, error: againError } = await supabase.auth.getSession()
      if (!active) return

      if (againError) {
        setError(againError.message)
        return
      }

      if (again.session) {
        await notifyGoogleSession()
        navigate('/account', { replace: true })
        return
      }

      setError('No session was created. Try signing in with Google again.')
    }

    void finish()
    return () => {
      active = false
    }
  }, [navigate])

  if (error) {
    return (
      <div className="container-je py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Sign-in failed</h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-mute">{error}</p>
        <Link to="/login" className="mt-8 inline-block">
          <Button>Back to sign in</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container-je py-20 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-mute">
        Completing Google sign-in…
      </p>
    </div>
  )
}
