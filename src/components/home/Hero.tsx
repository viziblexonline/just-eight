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
    <section className="relative min-h-[88vh] overflow-hidden bg-ink text-snow">
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
              {/* Soft fill so there are no black side bars */}
              <img
                src={slide.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center opacity-70 blur-xl"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              {/* Full product shown without zoom crop */}
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

      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-transparent to-transparent" />

      <div className="container-je relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 md:pb-24">
        <h1 className="animate-fade-up max-w-4xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          ELEVATE YOUR EVERYDAY.
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/75 md:text-lg"
          style={{ animationDelay: '100ms' }}
        >
          A modern clothing collection of tees, hoodies, outerwear, and
          sportswear — designed with clarity, quality, and quiet confidence.
        </p>
        <div
          className="animate-fade-up mt-10 flex flex-wrap gap-4"
          style={{ animationDelay: '180ms' }}
        >
          <Link
            to="/shop"
            className="interactive inline-flex items-center justify-center bg-snow px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ink hover:bg-mist"
          >
            Shop Now
          </Link>
          <Link to="/shop?sort=newest">
            <Button
              size="lg"
              variant="outline"
              className="border-snow text-snow hover:bg-snow hover:text-ink"
            >
              Explore Collection
            </Button>
          </Link>
        </div>

        {!loading && slides.length > 1 ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {current ? (
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                {current.name}
              </p>
            ) : null}
            <div className="flex gap-1.5" role="tablist" aria-label="Product slideshow">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${slide.name}`}
                  className={[
                    'h-1.5 transition-all duration-500',
                    index === active ? 'w-8 bg-snow' : 'w-3 bg-white/35 hover:bg-white/60',
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
