import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

export function PromoBanner() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1800&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="container-je relative py-24 text-center text-snow md:py-32">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em]">
            Limited drop
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[0.06em] uppercase md:text-5xl">
            Outerwear season
          </h2>
          <Link
            to="/shop?category=jackets"
            className="mt-8 inline-flex items-center justify-center border border-snow px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors hover:bg-snow hover:text-ink"
          >
            Shop outerwear
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
