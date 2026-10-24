import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-snow hover:bg-ink-soft disabled:bg-mute',
  secondary:
    'bg-mist text-ink hover:bg-line disabled:opacity-50',
  ghost: 'bg-transparent text-ink hover:bg-mist disabled:opacity-50',
  outline:
    'bg-transparent text-ink border border-ink hover:bg-ink hover:text-snow disabled:opacity-50',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-xs tracking-[0.14em] uppercase',
  md: 'px-6 py-3 text-xs tracking-[0.16em] uppercase',
  lg: 'px-8 py-4 text-sm tracking-[0.18em] uppercase',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'interactive inline-flex items-center justify-center gap-2 font-medium disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
