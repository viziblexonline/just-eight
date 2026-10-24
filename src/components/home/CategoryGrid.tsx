import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useCatalog } from '../../context/CatalogContext'
import { useInView } from '../../hooks/useInView'
import { Reveal } from '../ui/Reveal'

export function CategoryGrid() {
  const { categories } = useCatalog()
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <section className="py-20 md:py-28">
      <div className="container-je">
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mute">Browse</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="interactive hidden text-xs uppercase tracking-[0.18em] text-mute hover:text-ink md:inline"
          >
            View all
          </Link>
        </Reveal>

        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 6).map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={[
                'group relative aspect-[4/3] overflow-hidden bg-mist reveal reveal-up hover-lift',
                inView ? 'is-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--reveal-delay': `${index * 80}ms` } as CSSProperties}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-ink/35 transition-colors duration-500 group-hover:bg-ink/50" />
              <div className="absolute inset-x-0 bottom-0 translate-y-1 p-6 transition-transform duration-500 group-hover:translate-y-0">
                <h3 className="font-display text-2xl font-semibold text-snow">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-white/75 transition-opacity duration-500 group-hover:text-white/90">
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
