import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function BrandStory() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-je grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal variant="left" className="relative aspect-[4/5] overflow-hidden bg-mist">
          <img
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80"
            alt="JUST EIGHT brand atmosphere"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
          />
          <div className="absolute inset-4 border border-accent/35 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-deep/80 to-transparent p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
              Crafted with intention
            </p>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="gold-rule" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-accent">Our story</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[0.03em] md:text-5xl">
            Built for the way you move through the day.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mute">
            JUST EIGHT is a new clothing brand focused on elevated essentials —
            from gloves and tracksuits to hoodies, tees, and outerwear. We design
            for people who want premium materials without loud branding or
            disposable trends.
          </p>
          <p className="mt-4 text-base leading-relaxed text-mute">
            This story is a placeholder until the founder narrative, materials,
            and manufacturing details are confirmed.
          </p>
          <Link to="/about" className="mt-8 inline-block">
            <Button variant="outline">About JUST EIGHT</Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
