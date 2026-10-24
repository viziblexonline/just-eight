import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function HomeIntro() {
  return (
    <section id="home" className="border-b border-line bg-paper py-16 md:py-24">
      <div className="container-je grid items-center gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
        <Reveal variant="scale" className="mx-auto grid h-36 w-36 place-items-center overflow-hidden bg-ink md:h-44 md:w-44">
          <Logo
            to={false}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover"
            priority
          />
        </Reveal>
        <Reveal delay={100} className="text-center lg:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Home</p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-5xl">
            Welcome to Just Eight
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-mute md:text-base lg:mx-0">
            Premium clothing for men, women, and kids — built on clean lines,
            quality materials, and a quieter kind of confidence. Start with the
            collection that fits your day.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link to="/shop">
              <Button>Shop collection</Button>
            </Link>
            <Link to="/shop?audience=men">
              <Button variant="outline">Men</Button>
            </Link>
            <Link to="/shop?audience=women">
              <Button variant="outline">Women</Button>
            </Link>
            <Link to="/shop?audience=kids">
              <Button variant="outline">Kids</Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
