import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="container-je py-12 md:py-20">
      <div className="mx-auto max-w-md overflow-hidden border border-line bg-snow shadow-sm">
        <div className="h-1 bg-gradient-to-r from-navy via-accent to-navy" />
        <div className="p-8 md:p-10">
          <Logo imgClassName="h-12 w-auto" />
          <h1 className="mt-8 font-display text-4xl font-semibold tracking-[0.03em]">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-mute">{subtitle}</p>
          <div className="mt-10">{children}</div>
          <div className="mt-8 text-center text-sm text-mute">{footer}</div>
        </div>
      </div>
      <p className="mt-6 text-center text-xs text-mute">
        <Link to="/" className="link-underline">
          Back to store
        </Link>
      </p>
    </div>
  )
}

export function AuthDivider() {
  return (
    <div className="my-8 flex items-center gap-4">
      <div className="h-px flex-1 bg-line" />
      <span className="text-[11px] uppercase tracking-[0.18em] text-mute">
        or
      </span>
      <div className="h-px flex-1 bg-line" />
    </div>
  )
}
