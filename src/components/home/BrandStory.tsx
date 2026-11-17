import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

export function BrandStory() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-je grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="relative aspect-[4/5] overflow-hidden bg-mist">
          <img
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1200&q=80"
            alt="JUST EIGHT"
            className="h-full w-full object-cover"
          />
        </Reveal>
        <Reveal delay={80}>
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-mute">
            Our story
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
            Built for how you move.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-mute md:text-base">
            JUST EIGHT is contemporary clothing for men, women, and kids —
            elevated essentials without the noise. Clean lines, solid materials,
            and pieces you’ll wear on repeat.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex border border-navy px-8 py-3.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors hover:border-accent hover:bg-accent"
          >
            About us
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
