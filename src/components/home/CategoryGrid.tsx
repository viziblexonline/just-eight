import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/CatalogContext'
import { useInView } from '../../hooks/useInView'
import { Reveal } from '../ui/Reveal'

export function CategoryGrid() {
  const { categories } = useCatalog()
  const { ref, inView } = useInView<HTMLDivElement>()
  const items = categories.slice(0, 6)

  return (
    <section className="py-20 md:py-28">
      <div className="container-je">
        <Reveal className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="gold-rule" />
            <p className="mt-5 text-[11px] uppercase tracking-[0.28em] text-mute">Browse</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.03em] md:text-5xl">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="link-underline w-fit text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink"
          >
            View all
          </Link>
        </Reveal>

        <div ref={ref} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={[
                'group relative aspect-[5/4] overflow-hidden bg-mist reveal reveal-up',
                inView ? 'is-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy/40 to-transparent" />
              <div className="absolute inset-0 border border-transparent transition-colors duration-500 group-hover:border-accent/50" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Category</p>
                <h3 className="mt-2 font-display text-2xl font-semibold tracking-wide text-snow md:text-3xl">
                  {category.name}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-white/65 opacity-80 transition-opacity group-hover:opacity-100">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
