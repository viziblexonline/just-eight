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
    <section className="py-16 md:py-24">
      <div className="container-je">
        <Reveal className="mb-10 text-center md:mb-14">
          <h2 className="text-2xl font-medium tracking-[0.08em] uppercase md:text-3xl">
            Shop by category
          </h2>
        </Reveal>

        <div ref={ref} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {items.map((category, index) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.id}`}
              className={[
                'group relative aspect-[3/4] overflow-hidden bg-mist reveal reveal-up',
                inView ? 'is-visible' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--reveal-delay': `${index * 60}ms` } as CSSProperties}
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/35" />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-snow md:text-base">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
