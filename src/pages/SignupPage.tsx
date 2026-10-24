import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AuthDivider, AuthShell } from '../components/auth/AuthShell'
import { GoogleButton } from '../components/auth/GoogleButton'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export function SignupPage() {
  const { user, loading, signUpWithEmail, signInWithGoogle, isConfigured } =
    useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [formSuccess, setFormSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  if (!loading && user) {
    return <Navigate to="/account" replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!fullName.trim()) next.fullName = 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }
    if (password !== confirmPassword) {
      next.confirmPassword = 'Passwords do not match.'
    }
    setErrors(next)
    setFormError(null)
    setFormSuccess(null)
    if (Object.keys(next).length > 0) return

    setSubmitting(true)
    const result = await signUpWithEmail({ fullName, email, password })
    setSubmitting(false)

    if (!result.ok) {
      setFormError(result.message)
      return
    }

    if (result.message.toLowerCase().includes('check your email')) {
      setFormSuccess(result.message)
      return
    }

    navigate('/account', { replace: true })
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
      title="Create account"
      subtitle="Join JUST EIGHT with Google or create an account manually."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-ink underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <GoogleButton
        onClick={handleGoogle}
        loading={googleLoading}
        label="Continue with Google"
      />

      {!isConfigured ? (
        <p className="mt-3 text-xs leading-relaxed text-mute">
          Google signup activates after Supabase + Google OAuth are configured.
          Manual signup works now and keeps you signed in on this device.
        </p>
      ) : null}

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Full name"
          name="fullName"
          autoComplete="name"
          value={fullName}
          error={errors.fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          error={errors.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {formError ? (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        ) : null}
        {formSuccess ? (
          <p className="text-sm text-ink" role="status">
            {formSuccess}
          </p>
        ) : null}
        <Button type="submit" fullWidth size="lg" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}
