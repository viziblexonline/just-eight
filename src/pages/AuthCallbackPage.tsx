import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from '../components/ui/Button'

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

      const { error: sessionError } = await supabase.auth.getSession()
      if (!active) return

      if (sessionError) {
        setError(sessionError.message)
        return
      }

      navigate('/account', { replace: true })
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
        Completing sign-in…
      </p>
    </div>
  )
}
