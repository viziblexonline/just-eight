import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'

const collections = [
  {
    title: 'Men',
    to: '/shop?audience=men',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Women',
    to: '/shop?audience=women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Kids',
    to: '/shop?audience=kids',
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1200&q=80',
  },
]

export function FeaturedCollections() {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="container-je">
        <Reveal className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-medium tracking-[0.08em] uppercase md:text-3xl">
            Featured collections
          </h2>
        </Reveal>
        <div className="grid gap-3 md:grid-cols-3 md:gap-4">
          {collections.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <Link
                to={c.to}
                className="group relative block aspect-[3/4] overflow-hidden bg-mist"
              >
                <img
                  src={c.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8">
                  <h3 className="text-xl font-medium uppercase tracking-[0.2em] text-snow">
                    {c.title}
                  </h3>
                  <span className="mt-3 text-[11px] uppercase tracking-[0.18em] text-accent">
                    Shop now →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
