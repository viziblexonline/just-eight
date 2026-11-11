import { Link } from 'react-router-dom'
import type { Audience } from '../../types'
import { useCatalog } from '../../context/CatalogContext'
import { ProductGrid } from '../product/ProductGrid'
import { Reveal } from '../ui/Reveal'

const groups: {
  id: Audience
  title: string
  eyebrow: string
  description: string
  image: string
}[] = [
  {
    id: 'men',
    title: 'Men',
    eyebrow: 'Menswear',
    description: 'Tees, hoodies, and outerwear cut with a quiet, tailored ease.',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'women',
    title: 'Women',
    eyebrow: 'Womenswear',
    description: 'Clean silhouettes for training, travel, and everyday layers.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'kids',
    title: 'Kids',
    eyebrow: 'Kidswear',
    description: 'Smaller cuts of the same wardrobe — soft, simple, and ready to move.',
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1600&q=80',
  },
]

export function AudienceSections() {
  const { products } = useCatalog()

  return (
    <>
      {groups.map((group, index) => {
        const items = products
          .filter((product) => product.audience === group.id)
          .slice(0, 4)
        const reverse = index % 2 === 1

        return (
          <section
            key={group.id}
            className={['py-16 md:py-24', index % 2 === 0 ? 'bg-paper/70' : ''].join(' ')}
            id={group.id}
          >
            <div className="container-je">
              <Reveal>
                <div
                  className={[
                    'grid overflow-hidden border border-line lg:grid-cols-2',
                    reverse ? 'lg:[&>*:first-child]:order-2' : '',
                  ].join(' ')}
                >
                  <Link
                    to={`/shop?audience=${group.id}`}
                    className="group relative aspect-[4/5] overflow-hidden bg-mist lg:aspect-auto lg:min-h-[440px]"
                  >
                    <img
                      src={group.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-navy/25 transition-colors duration-500 group-hover:bg-navy/40" />
                    <div className="absolute inset-3 border border-accent/0 transition-colors duration-500 group-hover:border-accent/45" />
                  </Link>
                  <div className="flex flex-col justify-center bg-snow px-8 py-12 md:px-14 md:py-16">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-accent">
                      {group.eyebrow}
                    </p>
                    <h2 className="mt-4 font-display text-4xl font-semibold tracking-[0.04em] md:text-6xl">
                      {group.title}
                    </h2>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-mute md:text-base">
                      {group.description}
                    </p>
                    <Link
                      to={`/shop?audience=${group.id}`}
                      className="link-underline mt-8 w-fit text-[11px] uppercase tracking-[0.18em] text-ink"
                    >
                      Shop {group.title}
                    </Link>
                  </div>
                </div>
              </Reveal>

              {items.length > 0 ? (
                <div className="mt-10 md:mt-12">
                  <ProductGrid products={items} />
                </div>
              ) : (
                <p className="mt-8 text-sm text-mute">
                  Pieces for {group.title.toLowerCase()} are on the way.
                </p>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}
