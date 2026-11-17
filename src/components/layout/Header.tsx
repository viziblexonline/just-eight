import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { useWishlist } from '../../context/WishlistContext'
import { useCatalog } from '../../context/CatalogContext'
import { Logo } from '../brand/Logo'
import { SearchBox } from './SearchBox'

const mega = [
  {
    id: 'men',
    label: 'Men',
    to: '/shop?audience=men',
    links: [
      { to: '/shop?audience=men', label: 'All Men' },
      { to: '/shop?audience=men&category=t-shirts', label: 'T-Shirts' },
      { to: '/shop?audience=men&category=hoodies', label: 'Hoodies' },
      { to: '/shop?audience=men&category=jackets', label: 'Jackets' },
      { to: '/shop?audience=men&category=sportswear', label: 'Sportswear' },
    ],
  },
  {
    id: 'women',
    label: 'Women',
    to: '/shop?audience=women',
    links: [
      { to: '/shop?audience=women', label: 'All Women' },
      { to: '/shop?audience=women&category=t-shirts', label: 'T-Shirts' },
      { to: '/shop?audience=women&category=hoodies', label: 'Hoodies' },
      { to: '/shop?audience=women&category=jackets', label: 'Jackets' },
      { to: '/shop?audience=women&category=accessories', label: 'Accessories' },
    ],
  },
  {
    id: 'kids',
    label: 'Kids',
    to: '/shop?audience=kids',
    links: [
      { to: '/shop?audience=kids', label: 'All Kids' },
      { to: '/shop?audience=kids&category=t-shirts', label: 'T-Shirts' },
      { to: '/shop?audience=kids&category=hoodies', label: 'Hoodies' },
      { to: '/shop?audience=kids&category=tracksuits', label: 'Tracksuits' },
    ],
  },
]

const simpleLinks = [
  { to: '/shop?sort=newest', label: 'New Arrivals' },
  { to: '/shop', label: 'Collections' },
  { to: '/shop?sort=popularity', label: 'Sale' },
]

export function Header() {
  const { itemCount } = useCart()
  const { count: wishCount } = useWishlist()
  const { user, isAdmin } = useAuth()
  const { categories } = useCatalog()
  const location = useLocation()
  const showAdmin = Boolean(user && (isAdmin || user.isAdmin))
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    setMegaOpen(null)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-navy-deep">
        <div className="container-je flex h-8 items-center justify-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/60">
          <span>Free shipping over £150 · New season edit live</span>
          <span className="hidden text-accent sm:inline">◆</span>
        </div>
      </div>

      <div
        className={[
          'border-b transition-all duration-300',
          scrolled
            ? 'border-accent/25 bg-navy-deep/98 backdrop-blur-md'
            : 'border-white/5 bg-navy',
        ].join(' ')}
      >
        <div className="container-je relative grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 md:h-[4.5rem]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center text-snow lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>

            <nav className="hidden items-center gap-1 lg:flex">
              {mega.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(item.id)}
                  onMouseLeave={() => setMegaOpen(null)}
                >
                  <Link
                    to={item.to}
                    className="inline-flex h-16 items-center px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                  {megaOpen === item.id ? (
                    <div className="absolute left-0 top-full z-50 w-[520px] border border-line bg-snow p-8 shadow-sm animate-fade-in">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                            Shop {item.label}
                          </p>
                          <ul className="mt-4 space-y-3">
                            {item.links.map((link) => (
                              <li key={link.to}>
                                <Link
                                  to={link.to}
                                  className="text-sm text-ink transition-colors hover:text-ink-soft"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-accent">
                            Categories
                          </p>
                          <ul className="mt-4 space-y-3">
                            {categories.slice(0, 5).map((c) => (
                              <li key={c.id}>
                                <Link
                                  to={`${item.to}&category=${c.id}`}
                                  className="text-sm text-ink transition-colors hover:text-ink-soft"
                                >
                                  {c.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
              {simpleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="inline-flex h-16 items-center px-3 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              {showAdmin ? (
                <Link
                  to="/admin"
                  className="inline-flex h-16 items-center px-3 text-[11px] uppercase tracking-[0.16em] text-white/40 hover:text-accent"
                >
                  Admin
                </Link>
              ) : null}
            </nav>
          </div>

          <Logo
            className="justify-self-center"
            imgClassName="h-11 w-auto md:h-14"
            priority
          />

          <div className="flex items-center justify-end gap-0.5 text-snow">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-70 lg:hidden"
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <div className="hidden lg:block">
              <SearchBox />
            </div>
            <Link
              to={user ? '/account' : '/login'}
              className="grid h-10 w-10 place-items-center transition-opacity hover:opacity-70"
              aria-label={user ? 'Account' : 'Sign in'}
            >
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link
              to="/wishlist"
              className="relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-70"
              aria-label={`Wishlist, ${wishCount} items`}
            >
              <Heart size={18} strokeWidth={1.5} />
              {wishCount > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-accent px-1 text-[9px] font-semibold text-ink">
                  {wishCount > 99 ? '99+' : wishCount}
                </span>
              ) : null}
            </Link>
            <Link
              to="/cart"
              className="relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-70"
              aria-label={`Shopping bag, ${itemCount} items`}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {itemCount > 0 ? (
                <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center bg-accent px-1 text-[9px] font-semibold text-ink">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {searchOpen ? (
          <div className="border-t border-white/10 px-4 py-3 lg:hidden animate-fade-in">
            <SearchBox />
          </div>
        ) : null}
      </div>

      <div
        className={[
          'fixed inset-x-0 top-[calc(2rem+4rem)] bottom-0 z-40 overflow-y-auto navy-panel transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:top-[calc(2rem+4.5rem)] lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <nav className="container-je flex flex-col py-6">
          <div className="mb-4 flex justify-center border-b border-white/10 pb-6">
            <Logo imgClassName="h-20 w-auto" onClick={() => setOpen(false)} />
          </div>
          {mega.map((item) => (
            <div key={item.id} className="border-b border-white/10 py-4">
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium tracking-wide text-snow"
              >
                {item.label}
              </Link>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                {item.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="text-sm text-white/55"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          {simpleLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 text-2xl font-medium tracking-wide text-snow"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to={user ? '/account' : '/login'}
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-5 text-lg text-snow"
          >
            {user ? 'Account' : 'Sign in'}
          </Link>
          <Link
            to="/wishlist"
            onClick={() => setOpen(false)}
            className="border-b border-white/10 py-5 text-lg text-snow"
          >
            Wishlist ({wishCount})
          </Link>
          {showAdmin ? (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="border-b border-white/10 py-5 text-lg text-accent"
            >
              Admin
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  )
}
