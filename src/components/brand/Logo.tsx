import { Link } from 'react-router-dom'

export const LOGO_SRC = '/just-eight-logo.png'

type LogoProps = {
  to?: string | false
  className?: string
  imgClassName?: string
  priority?: boolean
  onClick?: () => void
  /** Light header: keep mark readable on white */
  tone?: 'light' | 'dark'
}

export function Logo({
  to = '/',
  className = '',
  imgClassName = 'h-10 w-auto md:h-12',
  priority = false,
  onClick,
  tone = 'dark',
}: LogoProps) {
  const image = (
    <img
      src={LOGO_SRC}
      alt="Just Eight"
      className={[
        'object-contain',
        tone === 'light' ? 'brightness-0' : '',
        imgClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      width={200}
      height={200}
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
    />
  )

  if (to === false) {
    return (
      <span className={['inline-flex items-center', className].filter(Boolean).join(' ')}>
        {image}
      </span>
    )
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      className={[
        'inline-flex items-center transition-opacity hover:opacity-80',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Just Eight home"
    >
      {image}
    </Link>
  )
}
