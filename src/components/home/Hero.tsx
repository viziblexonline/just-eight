import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/CatalogContext'
import { Button } from '../ui/Button'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'
const SLIDE_MS = 4500

export function Hero() {
  const { products, loading } = useCatalog()
  const [active, setActive] = useState(0)

  const slides = useMemo(() => {
    const ordered = [
      ...products.filter((product) => product.featured && product.images[0]),
      ...products.filter((product) => !product.featured && product.images[0]),
    ]

    const unique = ordered.filter(
      (product, index, list) =>
        list.findIndex((entry) => entry.id === product.id) === index,
    )

    return unique.slice(0, 8).map((product) => ({
      id: product.id,
      name: product.name,
      image: product.images[0],
    }))
  }, [products])

  useEffect(() => {
    setActive(0)
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % slides.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [slides.length])

  const current = slides[active]
  const displaySlides =
    slides.length > 0
      ? slides
      : [{ id: 'fallback', name: 'JUST EIGHT', image: FALLBACK_IMAGE }]

  return (
    <section className="relative min-h-[92vh] overflow-hidden bg-navy-deep text-snow">
      <div className="absolute inset-0">
        {displaySlides.map((slide, index) => {
          const isActive = index === active || (slides.length === 0 && index === 0)
          return (
            <div
              key={slide.id}
              className={[
                'absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]',
                isActive ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              aria-hidden={!isActive}
            >
              {/* Sharp edge fill — no blur veil */}
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full scale-105 object-cover object-center opacity-40"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Clear main product */}
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-contain object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          )
        })}
      </div>

      {/* Bottom fade only — keeps text readable without covering the slide */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-navy-deep/85 via-navy-deep/35 to-transparent" />

      <div className="container-je relative flex min-h-[92vh] flex-col justify-end pb-16 pt-28 md:pb-24">
        <div className="max-w-xl">
          <p className="animate-fade-up text-[11px] uppercase tracking-[0.32em] text-accent">
            JUST EIGHT · Luxury ready-to-wear
          </p>
          <h1 className="animate-fade-up mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-[0.04em] md:text-7xl lg:text-8xl">
            Elevate your
            <span className="gold-text"> everyday.</span>
          </h1>
          <p
            className="animate-fade-up mt-6 text-base leading-relaxed text-white/85 md:max-w-lg md:text-lg"
            style={{ animationDelay: '100ms' }}
          >
            Tees, hoodies, outerwear, and sportswear — cut with clarity, quality,
            and quiet confidence.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap gap-3"
            style={{ animationDelay: '180ms' }}
          >
            <Link
              to="/shop"
              className="interactive inline-flex items-center justify-center bg-accent px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink hover:bg-gold-bright"
            >
              Shop Now
            </Link>
            <Link to="/shop?sort=newest">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/50 text-snow hover:border-accent hover:bg-accent hover:text-ink"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
        </div>

        {!loading && slides.length > 1 ? (
          <div className="mt-10 flex flex-wrap items-center gap-5 md:mt-12">
            {current ? (
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">
                Now showing · {current.name}
              </p>
            ) : null}
            <div className="flex gap-2" role="tablist" aria-label="Product slideshow">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${slide.name}`}
                  className={[
                    'h-1.5 transition-all duration-500',
                    index === active ? 'w-12 bg-accent' : 'w-4 bg-white/40 hover:bg-accent/70',
                  ].join(' ')}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
