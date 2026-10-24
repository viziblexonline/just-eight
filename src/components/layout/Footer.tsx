import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

const shopLinks = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'All Products' },
  { to: '/shop?audience=men', label: 'Men' },
  { to: '/shop?audience=women', label: 'Women' },
  { to: '/shop?audience=kids', label: 'Kids' },
  { to: '/shop?category=hoodies', label: 'Hoodies' },
]

const helpLinks = [
  { to: '/login', label: 'Sign In' },
  { to: '/signup', label: 'Create Account' },
  { to: '/admin/products/new', label: 'Admin · Add Product' },
  { to: '/shipping', label: 'Shipping & Delivery' },
  { to: '/returns', label: 'Returns & Refunds' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

const legalLinks = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink text-snow">
      <div className="container-je grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-4 lg:col-span-1">
          <Logo imgClassName="h-14 w-auto" />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            Premium clothing for everyday elevation. A modern wardrobe built on
            clean lines, quality materials, and considered design.
          </p>
          <div className="flex gap-3 pt-2">
            <SocialLink href="https://instagram.com" label="Instagram">
              IG
            </SocialLink>
            <SocialLink href="https://facebook.com" label="Facebook">
              FB
            </SocialLink>
            <SocialLink href="https://x.com" label="X / Twitter">
              X
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn title="Help" links={helpLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-je flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 JUST EIGHT. All rights reserved.</p>
          <p>Demo catalog — prices and policies are placeholders.</p>
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
      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid h-10 w-10 place-items-center border border-white/20 text-[10px] font-semibold tracking-[0.12em] transition-colors hover:border-white hover:bg-white hover:text-ink"
    >
      {children}
    </a>
  )
}
