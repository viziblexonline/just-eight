import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCatalog } from '../../context/CatalogContext'

const FALLBACK = [
  {
    id: 'f1',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'New season',
    title: 'EVERYDAY ELEVATED',
    cta: { to: '/shop', label: 'Shop now' },
  },
  {
    id: 'f2',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Men',
    title: 'THE MENSWEAR EDIT',
    cta: { to: '/shop?audience=men', label: 'Shop men' },
  },
  {
    id: 'f3',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1800&q=80',
    eyebrow: 'Women',
    title: 'THE WOMENSWEAR EDIT',
    cta: { to: '/shop?audience=women', label: 'Shop women' },
  },
]

const SLIDE_MS = 5500
const SWIPE = 48

export function Hero() {
  const { products } = useCatalog()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const startX = useRef<number | null>(null)
  const drag = useRef(0)

  const slides = useMemo(() => {
    const imgs = products
      .filter((p) => p.images[0])
      .sort((a, b) => Number(b.featured) - Number(a.featured))
      .slice(0, 4)
      .map((p, i) => ({
        id: p.id,
        image: p.images[0],
        eyebrow: i === 0 ? 'JUST EIGHT' : p.audience.toUpperCase(),
        title:
          i === 0
            ? 'EVERYDAY ELEVATED'
            : i === 1
              ? 'NEW ARRIVALS'
              : i === 2
                ? 'BEST SELLERS'
                : 'THE COLLECTION',
        cta: {
          to:
            i === 1
              ? '/shop?sort=newest'
              : i === 2
                ? '/shop?sort=popularity'
                : '/shop',
          label: 'Shop now',
        },
      }))
    return imgs.length >= 2 ? imgs : FALLBACK
  }, [products])

  useEffect(() => {
    setActive(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    const t = window.setInterval(
      () => setActive((i) => (i + 1) % slides.length),
      SLIDE_MS,
    )
    return () => window.clearInterval(t)
  }, [slides.length, paused, active])

  function go(d: number) {
    setActive((i) => (i + d + slides.length) % slides.length)
  }

  const current = slides[active] ?? slides[0]

  return (
    <section
      className="relative h-[min(88vh,820px)] min-h-[480px] overflow-hidden bg-mist select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX
        drag.current = 0
        setPaused(true)
      }}
      onTouchMove={(e) => {
        if (startX.current === null) return
        drag.current = e.touches[0].clientX - startX.current
      }}
      onTouchEnd={() => {
        if (drag.current > SWIPE) go(-1)
        else if (drag.current < -SWIPE) go(1)
        startX.current = null
        setPaused(false)
      }}
      aria-roledescription="carousel"
      aria-label="Campaign banner"
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={[
            'absolute inset-0 transition-opacity duration-700',
            index === active ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          aria-hidden={index !== active}
        >
          <img
            src={slide.image}
            alt=""
            className={[
              'h-full w-full object-cover object-center',
              index === active ? 'animate-ken' : '',
            ].join(' ')}
            draggable={false}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />

      <div className="container-je relative flex h-full flex-col justify-end pb-14 pt-24 md:justify-center md:pb-20">
        <div className="max-w-xl text-snow">
          <p
            key={`e-${current.id}`}
            className="animate-fade-up text-[11px] font-medium uppercase tracking-[0.28em]"
          >
            {current.eyebrow}
          </p>
          <h1
            key={`t-${current.id}`}
            className="animate-fade-up mt-3 text-4xl font-medium tracking-[0.04em] md:text-6xl lg:text-7xl"
            style={{ animationDelay: '60ms' }}
          >
            {current.title}
          </h1>
          <Link
            key={`c-${current.id}`}
            to={current.cta.to}
            className="animate-fade-up mt-8 inline-flex items-center justify-center bg-accent px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] text-ink transition-colors hover:bg-gold-bright"
            style={{ animationDelay: '120ms' }}
          >
            {current.cta.label}
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous"
              className="grid h-10 w-10 place-items-center border border-white/40 text-snow hover:bg-snow hover:text-ink"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next"
              className="grid h-10 w-10 place-items-center border border-white/40 text-snow hover:bg-snow hover:text-ink"
              onClick={() => go(1)}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Slide ${i + 1}`}
                className={[
                  'h-0.5 transition-all duration-500',
                  i === active ? 'w-10 bg-accent' : 'w-4 bg-white/40',
                ].join(' ')}
                onClick={() => setActive(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
