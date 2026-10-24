import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

export function AccountPage() {
  const { user, loading, signOut, isConfigured, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="container-je py-20 text-center text-sm text-mute">
        Loading account…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/account' }} />
  }

  return (
    <div className="container-je py-12 md:py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-mute">Account</p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Hello, {user.fullName.split(' ')[0]}
      </h1>
      <p className="mt-4 text-sm text-mute">
        Manage your JUST EIGHT profile and shopping preferences.
      </p>

      <div className="mt-10 max-w-lg border border-line p-6 md:p-8">
        <dl className="space-y-5 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-mute">
              Name
            </dt>
            <dd className="mt-2 font-medium">{user.fullName}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-mute">
              Email
            </dt>
            <dd className="mt-2 font-medium">{user.email}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-mute">
              Sign-in method
            </dt>
            <dd className="mt-2 font-medium capitalize">{user.provider}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-mute">
              Auth mode
            </dt>
            <dd className="mt-2 font-medium">
              {isConfigured ? 'Supabase' : 'Local demo (this browser)'}
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/shop">
            <Button>Continue shopping</Button>
          </Link>
          {isAdmin || user.isAdmin ? (
            <>
              <Link to="/admin">
                <Button variant="outline">Admin dashboard</Button>
              </Link>
              <Link to="/admin/products/new">
                <Button>Add product</Button>
              </Link>
            </>
          ) : null}
          <Button variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
