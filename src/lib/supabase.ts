import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  url?.startsWith('http') && anonKey && anonKey.length > 20,
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        flowType: 'pkce',
        // Callback page exchanges the code once — avoid double exchange wiping the PKCE verifier
        detectSessionInUrl: false,
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

/** Keep OAuth start + return on the same production host (www → apex). */
export function getOAuthRedirectTo(): string {
  if (typeof window === 'undefined') return '/auth/callback'
  const host = window.location.hostname
  if (host === 'justeight.co.uk' || host === 'www.justeight.co.uk') {
    return 'https://justeight.co.uk/auth/callback'
  }
  return `${window.location.origin}/auth/callback`
}
