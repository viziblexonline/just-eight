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
        </Reveal>
        <Reveal delay={120}>
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Our story</p>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-5xl">
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
