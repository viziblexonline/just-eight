import { NavLink, Outlet, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { isSupabaseConfigured } from '../../lib/supabase'

const links = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/products', label: 'Products', end: false },
  { to: '/admin/products/new', label: 'Add product', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
  { to: '/admin/categories', label: 'Categories', end: false },
]

export function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth()

  if (loading) {
    return (
      <div className="container-je py-20 text-center text-sm text-mute">
        Checking admin access…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/admin' }} />
  }

  const localAdminMode = !isSupabaseConfigured && Boolean(user.isAdmin)
  const canAccess = isAdmin || localAdminMode

  if (!canAccess) {
    return (
      <div className="container-je max-w-xl py-20">
        <h1 className="font-display text-3xl font-bold">Access denied</h1>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          Signed in as {user.email}, but this account is not an admin.
          {isSupabaseConfigured ? (
            <>
              {' '}
              In the Supabase SQL editor run:
            </>
          ) : (
            <> Sign out and create/sign in to a local account to manage products.</>
          )}
        </p>
        {isSupabaseConfigured ? (
          <pre className="mt-4 overflow-x-auto bg-mist p-4 text-xs">
{`update public.profiles
set is_admin = true
where id = (
  select id from auth.users where email = '${user.email}'
);`}
          </pre>
        ) : null}
        <div className="mt-8 flex gap-4">
          <Link to="/" className="text-sm underline">
            Storefront
          </Link>
          <button
            type="button"
            className="text-sm underline"
            onClick={() => void signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-line bg-snow">
        <div className="container-je flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="font-display text-lg font-extrabold tracking-[0.18em]">
              JUST EIGHT
            </p>
            <p className="text-xs uppercase tracking-[0.16em] text-mute">
              Admin{localAdminMode ? ' · Local mode' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.14em]">
            <Link to="/" className="text-mute hover:text-ink">
              View store
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="text-mute hover:text-ink"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="container-je flex gap-6 overflow-x-auto pb-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                [
                  'whitespace-nowrap text-xs uppercase tracking-[0.16em] transition-colors',
                  isActive ? 'text-ink' : 'text-mute hover:text-ink',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="container-je py-10">
        {localAdminMode ? (
          <p className="mb-6 border border-line bg-mist px-4 py-3 text-xs text-mute">
            Local admin mode: new products are saved in this browser until
            Supabase is connected.
          </p>
        ) : null}
        <Outlet />
      </div>
    </div>
  )
}
