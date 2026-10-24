import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function PromoBanner() {
  return (
    <section className="bg-mist">
      <div className="container-je grid items-center gap-10 py-16 md:grid-cols-2 md:py-0">
        <Reveal className="md:py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Limited drop</p>
          <h2 className="mt-4 max-w-md font-display text-4xl font-bold tracking-tight md:text-5xl">
            Outerwear season starts here.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mute md:text-base">
            Explore jackets and layers built for cool mornings and late evenings.
            Placeholder offer — update copy and dates when confirmed.
          </p>
          <Link to="/shop?category=jackets" className="mt-8 inline-block">
            <Button>Shop Outerwear</Button>
          </Link>
        </Reveal>
        <Reveal variant="right" delay={120} className="relative min-h-[320px] overflow-hidden md:min-h-[480px]">
          <img
            src="https://images.unsplash.com/photo-1548126032-077ad0b3f520?auto=format&fit=crop&w=1400&q=80"
            alt="JUST EIGHT outerwear"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
          />
        </Reveal>
      </div>
    </section>
  )
}
