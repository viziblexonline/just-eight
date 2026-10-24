import { useEffect, useRef, useState } from 'react'

export function useInView<T extends Element>(options?: {
  once?: boolean
  rootMargin?: string
  threshold?: number
}) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  const once = options?.once ?? true

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      {
        rootMargin: options?.rootMargin ?? '0px 0px -8% 0px',
        threshold: options?.threshold ?? 0.12,
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once, options?.rootMargin, options?.threshold])

  return { ref, inView }
}
