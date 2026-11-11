import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function HomeIntro() {
  return (
    <section id="home" className="navy-panel relative overflow-hidden py-20 md:py-28">
      <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="container-je relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="gold-rule mx-auto" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.28em] text-accent">
            The collection
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-[0.04em] text-snow md:text-6xl">
            Welcome to Just Eight
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
            Premium clothing for men, women, and kids — built on clean lines,
            quality materials, and a quieter kind of confidence. Start with the
            collection that fits your day.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/shop">
              <Button>Shop collection</Button>
            </Link>
            <Link to="/shop?audience=men">
              <Button
                variant="outline"
                className="border-accent/40 text-snow hover:border-accent hover:bg-accent hover:text-ink"
              >
                Men
              </Button>
            </Link>
            <Link to="/shop?audience=women">
              <Button
                variant="outline"
                className="border-accent/40 text-snow hover:border-accent hover:bg-accent hover:text-ink"
              >
                Women
              </Button>
            </Link>
            <Link to="/shop?audience=kids">
              <Button
                variant="outline"
                className="border-accent/40 text-snow hover:border-accent hover:bg-accent hover:text-ink"
              >
                Kids
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
