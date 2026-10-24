import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../brand/Logo'
import { SearchBox } from './SearchBox'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

function isNavActive(to: string, pathname: string, search: string) {
  if (to === '/') return pathname === '/'
  if (to === '/shop') return pathname === '/shop' && search === ''
  const [path, query = ''] = to.split('?')
  if (pathname !== path) return false
  if (!query) return true
  const expected = new URLSearchParams(query)
  const current = new URLSearchParams(search)
  for (const [key, value] of expected.entries()) {
    if (current.get(key) !== value) return false
  }
  return true
}

export function Header() {
  const { itemCount } = useCart()
  const { user, isAdmin } = useAuth()
  const location = useLocation()
  const showAdmin = Boolean(user && (isAdmin || user.isAdmin))
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={[
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-line bg-snow/95 backdrop-blur-md'
          : 'border-transparent bg-snow/80 backdrop-blur-sm',
      ].join(' ')}
    >
      <div className="container-je relative flex h-24 items-center justify-between md:h-28">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center lg:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((link) => {
            const active = isNavActive(link.to, location.pathname, location.search)
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={[
                  'text-xs uppercase tracking-[0.18em] transition-colors',
                  active ? 'text-ink' : 'text-mute hover:text-ink',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
          {showAdmin ? (
            <Link
              to="/admin/products/new"
              className="text-xs uppercase tracking-[0.18em] text-mute transition-colors hover:text-ink"
            >
              Admin
            </Link>
          ) : null}
        </nav>

        <Logo
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          imgClassName="h-20 w-auto drop-shadow-sm md:h-28"
          priority
        />

        <div className="flex items-center gap-1 md:gap-2">
          <SearchBox />
          <Link
            to={user ? '/account' : '/login'}
            className="grid h-10 w-10 place-items-center text-ink transition-opacity hover:opacity-70"
            aria-label={user ? 'Account' : 'Sign in'}
          >
            <User size={20} />
          </Link>
          <Link
            to="/cart"
            className="relative grid h-10 w-10 place-items-center text-ink transition-opacity hover:opacity-70"
            aria-label={`Shopping cart, ${itemCount} items`}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 ? (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-ink px-1 text-[10px] text-snow">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      <div
        className={[
          'fixed inset-x-0 top-24 bottom-0 z-40 bg-snow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:top-28 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <nav className="container-je flex flex-col gap-1 py-8">
          {navLinks.map((link) => {
            const active = isNavActive(link.to, location.pathname, location.search)
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={[
                  'border-b border-line py-4 font-display text-2xl font-semibold tracking-tight',
                  active ? 'text-ink' : 'text-mute',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to={user ? '/account' : '/login'}
            onClick={() => setOpen(false)}
            className="border-b border-line py-4 font-display text-2xl font-semibold tracking-tight"
          >
            {user ? 'Account' : 'Sign in'}
          </Link>
          {showAdmin ? (
            <Link
              to="/admin/products/new"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 font-display text-2xl font-semibold tracking-tight"
            >
              Admin
            </Link>
          ) : null}
          {!user ? (
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="border-b border-line py-4 text-sm uppercase tracking-[0.16em] text-mute"
            >
              Create account
            </Link>
          ) : null}
          <Link
            to="/faq"
            onClick={() => setOpen(false)}
            className="border-b border-line py-4 text-sm uppercase tracking-[0.16em] text-mute"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  )
}
