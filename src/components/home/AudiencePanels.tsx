import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

const panels = [
  {
    id: 'men',
    title: 'MEN',
    copy: 'Tees, hoodies, outerwear — essentials with edge.',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
    to: '/shop?audience=men',
  },
  {
    id: 'women',
    title: 'WOMEN',
    copy: 'Soft layers and sharp silhouettes for every day.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
    to: '/shop?audience=women',
  },
  {
    id: 'kids',
    title: 'KIDS',
    copy: 'Mini cuts of the same wardrobe — ready to move.',
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1600&q=80',
    to: '/shop?audience=kids',
  },
]

const SLIDE_MS = 4800
const SWIPE = 44

export function AudiencePanels() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const startX = useRef<number | null>(null)
  const drag = useRef(0)

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % panels.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [paused, active])

  function go(delta: number) {
    setActive((i) => (i + delta + panels.length) % panels.length)
  }

  const current = panels[active]

  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 text-snow md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(201,168,76,0.16),transparent_45%)]" />

      <div className="container-je relative">
        <Reveal className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
              Shop the house
            </p>
            <h2 className="mt-2 font-display text-4xl md:text-6xl">Who are you shopping for?</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous audience"
              className="grid h-10 w-10 place-items-center border border-white/25 transition-colors hover:border-accent hover:text-accent"
              onClick={() => go(-1)}
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Next audience"
              className="grid h-10 w-10 place-items-center border border-white/25 transition-colors hover:border-accent hover:text-accent"
              onClick={() => go(1)}
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </Reveal>

        <div
          className="relative select-none"
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
        >
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-[21/9]">
            {panels.map((panel, index) => {
              const isActive = index === active
              return (
                <div
                  key={panel.id}
                  className={[
                    'absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105',
                  ].join(' ')}
                  aria-hidden={!isActive}
                >
                  <img
                    src={panel.image}
                    alt=""
                    className={[
                      'h-full w-full object-cover',
                      isActive ? 'animate-ken' : '',
                    ].join(' ')}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/85 via-navy-deep/40 to-transparent" />
                </div>
              )
            })}

            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
              <p
                key={`e-${current.id}`}
                className="animate-fade-up text-[11px] font-semibold uppercase tracking-[0.3em] text-accent"
              >
                Collection
              </p>
              <h3
                key={`t-${current.id}`}
                className="animate-fade-up mt-2 font-display text-6xl leading-none md:text-8xl"
                style={{ animationDelay: '60ms' }}
              >
                {current.title}
              </h3>
              <p
                key={`c-${current.id}`}
                className="animate-fade-up mt-3 max-w-md text-sm text-white/75 md:text-base"
                style={{ animationDelay: '120ms' }}
              >
                {current.copy}
              </p>
              <Link
                key={`a-${current.id}`}
                to={current.to}
                className="animate-fade-up mt-7 inline-flex w-fit items-center justify-center bg-accent px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:bg-gold-bright"
                style={{ animationDelay: '180ms' }}
              >
                Shop {current.title.toLowerCase()}
              </Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="flex gap-2">
              {panels.map((panel, index) => (
                <button
                  key={panel.id}
                  type="button"
                  aria-label={`Show ${panel.title}`}
                  aria-selected={index === active}
                  className={[
                    'h-1 transition-all duration-500',
                    index === active ? 'w-10 bg-accent' : 'w-3 bg-white/30 hover:bg-white/60',
                  ].join(' ')}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
              {String(active + 1).padStart(2, '0')} / 0{panels.length}
            </p>
          </div>

          {/* Peek strip of all three — still clickable */}
          <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3">
            {panels.map((panel, index) => (
              <Link
                key={panel.id}
                to={panel.to}
                onMouseEnter={() => setActive(index)}
                className={[
                  'group relative aspect-[16/9] overflow-hidden border transition-all duration-500',
                  index === active ? 'border-accent' : 'border-white/10 opacity-70 hover:opacity-100',
                ].join(' ')}
              >
                <img
                  src={panel.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-navy-deep/45" />
                <span className="absolute inset-x-0 bottom-0 p-2 font-display text-xl text-snow md:p-3 md:text-3xl">
                  {panel.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
