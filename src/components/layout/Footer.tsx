import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

const shopLinks = [
  { to: '/shop?audience=men', label: 'Men' },
  { to: '/shop?audience=women', label: 'Women' },
  { to: '/shop?audience=kids', label: 'Kids' },
  { to: '/shop?sort=newest', label: 'New arrivals' },
  { to: '/shop', label: 'All products' },
]

const helpLinks = [
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/wishlist', label: 'Wishlist' },
]

const companyLinks = [
  { to: '/about', label: 'About' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/terms', label: 'Terms' },
  { to: '/login', label: 'Sign in' },
]

export function Footer() {
  return (
    <footer className="navy-panel border-t border-accent/20">
      <div className="container-je grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div className="space-y-4">
          <Logo imgClassName="h-14 w-auto" />
          <div className="gold-rule" />
          <p className="max-w-xs text-sm leading-relaxed text-white/60">
            Contemporary fashion for everyday elevation. Men, women, kids —
            clean cuts from £8.
          </p>
        </div>
        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />
        <FooterColumn title="Company" links={companyLinks} />
      </div>
      <div className="border-t border-white/10">
        <div className="container-je flex flex-col gap-2 py-5 text-[11px] uppercase tracking-[0.14em] text-white/35 md:flex-row md:justify-between">
          <p>© 2026 JUST EIGHT</p>
          <p className="normal-case tracking-normal">Everyday elevated.</p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { to: string; label: string }[]
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-white/65 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
