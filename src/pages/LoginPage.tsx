import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthDivider, AuthShell } from '../components/auth/AuthShell'
import { GoogleButton } from '../components/auth/GoogleButton'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const { user, loading, signInWithEmail, signInWithGoogle, isConfigured } =
    useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  if (!loading && user) {
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (!password) next.password = 'Password is required.'
    setErrors(next)
    setFormError(null)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const result = await signInWithEmail({ email, password })
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }
    navigate(from, { replace: true })
  }

  async function handleGoogle() {
    setFormError(null)
    setGoogleLoading(true)
    const result = await signInWithGoogle()
    if (!result.ok) {
      setFormError(result.message)
      setGoogleLoading(false)
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back. Sign in to manage your JUST EIGHT account."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="text-ink underline underline-offset-4">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton onClick={handleGoogle} loading={googleLoading} />

      {!isConfigured ? (
        <p className="mt-3 text-xs leading-relaxed text-mute">
          Google login activates after you connect Supabase and enable the Google
          provider. Manual email sign-in works now in local demo mode.
        </p>
      ) : null}

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}
        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </AuthShell>
  )
}
