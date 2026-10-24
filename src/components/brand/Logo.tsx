import { Link } from 'react-router-dom'

export const LOGO_SRC = '/just-eight-logo.png'

type LogoProps = {
  /** Pass `false` to render the mark without a link. Defaults to home. */
  to?: string | false
  className?: string
  imgClassName?: string
  priority?: boolean
}

export function Logo({
  to = '/',
  className = '',
  imgClassName = 'h-10 w-auto md:h-12',
  priority = false,
}: LogoProps) {
  const image = (
    <img
      src={LOGO_SRC}
      alt="Just Eight"
      className={['object-contain', imgClassName].filter(Boolean).join(' ')}
      width={160}
      height={160}
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
      className={['inline-flex items-center transition-opacity hover:opacity-80', className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Just Eight home"
    >
      {image}
    </Link>
  )
}
