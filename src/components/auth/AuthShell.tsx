import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthShellProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="container-je py-12 md:py-20">
      <div className="mx-auto max-w-md">
        <Link
          to="/"
          className="font-display text-sm font-extrabold tracking-[0.22em]"
        >
          JUST EIGHT
        </Link>
        <h1 className="mt-8 font-display text-4xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-mute">{subtitle}</p>
        <div className="mt-10">{children}</div>
        <div className="mt-8 text-center text-sm text-mute">{footer}</div>
      </div>
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
