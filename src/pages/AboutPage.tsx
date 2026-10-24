import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function AboutPage() {
  return (
    <div>
      <section className="relative min-h-[50vh] overflow-hidden bg-ink text-snow">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=80"
          alt="JUST EIGHT atelier atmosphere"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-ink/50" />
        <div className="container-je relative flex min-h-[50vh] items-end pb-14 pt-28">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/70">
              About
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-bold tracking-tight md:text-6xl">
              JUST EIGHT
            </h1>
          </div>
        </div>
      </section>

      <section className="container-je grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:gap-20">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Clothing for everyday elevation.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mute">
            JUST EIGHT is a new apparel brand creating gloves, tracksuits,
            t-shirts, hoodies, jackets, sportswear, and accessories with a
            premium, modern sensibility. We focus on clean silhouettes, durable
            materials, and a wardrobe that works from morning commute to weekend
            reset.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mute">
            Founder story, manufacturing partners, and sustainability details
            are placeholders until confirmed by the brand.
          </p>
        </div>
        <div className="space-y-8">
          <div className="border-t border-line pt-6">
            <h3 className="font-display text-xl font-semibold">What we make</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Essentials and statement pieces across multiple categories —
              designed to scale as new collections launch.
            </p>
          </div>
          <div className="border-t border-line pt-6">
            <h3 className="font-display text-xl font-semibold">How we design</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Monochrome clarity, thoughtful proportion, and details that feel
              considered rather than loud.
            </p>
          </div>
          <div className="border-t border-line pt-6">
            <h3 className="font-display text-xl font-semibold">Where we are</h3>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              Shipping regions, HQ location, and retail presence will be
              published once finalized.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16 text-center">
        <div className="container-je">
          <h2 className="font-display text-3xl font-bold">Explore the collection</h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-mute">
            Shop demo products now while the live catalog is prepared.
          </p>
          <Link to="/shop" className="mt-8 inline-block">
            <Button>Shop Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
