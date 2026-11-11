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
    <header className="sticky top-0 z-50">
      <div className="h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />
      <div className="navy-panel">
        <div className="container-je flex h-8 items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/65">
          <span>Complimentary shipping over $150</span>
          <Link to="/shop?sort=newest" className="hidden text-accent hover:text-gold-bright sm:inline">
            New season edit
          </Link>
        </div>
      </div>

      <div
        className={[
          'border-b transition-all duration-300',
          scrolled || open
            ? 'border-accent/20 bg-navy-deep/97 backdrop-blur-md'
            : 'border-white/5 bg-navy/95 backdrop-blur-sm',
        ].join(' ')}
      >
        <div className="container-je relative grid h-24 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-28 md:gap-6">
          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-snow lg:hidden"
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
                      'relative text-[11px] uppercase tracking-[0.22em] transition-colors',
                      active ? 'text-accent' : 'text-white/70 hover:text-snow',
                    ].join(' ')}
                  >
                    {link.label}
                    {active ? (
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-accent" />
                    ) : null}
                  </Link>
                )
              })}
              {showAdmin ? (
                <Link
                  to="/admin/products/new"
                  className="text-[11px] uppercase tracking-[0.22em] text-white/50 transition-colors hover:text-accent"
                >
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>

          <Logo
            className="relative z-10 justify-self-center drop-shadow-[0_0_18px_rgba(201,168,76,0.35)]"
            imgClassName="h-[4.75rem] w-auto md:h-24"
            priority
          />

          <div className="flex items-center justify-end gap-0.5 text-snow md:gap-1">
            <SearchBox />
            <Link
              to={user ? '/account' : '/login'}
              className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-70"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User size={19} strokeWidth={1.6} />
            </Link>
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-70"
              aria-label={`Shopping cart, ${itemCount} items`}
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {itemCount > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-accent px-1 text-[10px] font-semibold text-ink">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </div>

      <div
        className={[
          'fixed inset-x-0 top-[calc(0.125rem+2rem+6rem)] bottom-0 z-40 navy-panel transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:top-[calc(0.125rem+2rem+7rem)] lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <nav className="container-je flex flex-col gap-1 py-10">
          <div className="mb-6 flex justify-center border-b border-white/10 pb-6">
            <Logo
              imgClassName="h-28 w-auto"
              onClick={() => setOpen(false)}
            />
          </div>
          {navLinks.map((link) => {
            const active = isNavActive(link.to, location.pathname, location.search)
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={[
                  'border-b border-white/10 py-5 font-display text-3xl tracking-wide',
                  active ? 'text-accent' : 'text-snow',
                ].join(' ')}
              >
                {link.label}
              </Link>
            )
          })}
          <Link
            to={user ? '/account' : '/login'}
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-5 font-display text-3xl tracking-wide text-snow"
          >
            {user ? 'Account' : 'Sign in'}
          </Link>
          {showAdmin ? (
            <Link
              to="/admin/products/new"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 font-display text-3xl tracking-wide text-snow"
            >
              Admin
            </Link>
          ) : null}
          {!user ? (
            <Link
              to="/signup"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 text-[11px] uppercase tracking-[0.18em] text-white/55"
            >
              Create account
            </Link>
          ) : null}
          <Link
            to="/faq"
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-5 text-[11px] uppercase tracking-[0.18em] text-white/55"
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  )
}
