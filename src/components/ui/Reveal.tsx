import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type RevealProps = {
  children: ReactNode
  className?: string
  as?: ElementType
  delay?: number
  variant?: 'up' | 'in' | 'left' | 'right' | 'scale'
}

export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  variant = 'up',
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <Tag
      ref={ref}
      className={[
        'reveal',
        `reveal-${variant}`,
        inView ? 'is-visible' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
