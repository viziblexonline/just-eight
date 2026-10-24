import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  actionTo?: string
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {icon ? <div className="mb-6 text-mute">{icon}</div> : null}
      <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{description}</p>
      {actionLabel && actionTo ? (
        <Link to={actionTo} className="mt-8">
          <Button>{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  )
}
