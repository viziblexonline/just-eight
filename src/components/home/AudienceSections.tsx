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
      {groups.map((group) => {
        const items = products
          .filter((product) => product.audience === group.id)
          .slice(0, 4)

        return (
          <section key={group.id} className="py-16 md:py-24" id={group.id}>
            <div className="container-je">
              <Reveal>
                <Link
                  to={`/shop?audience=${group.id}`}
                  className="group relative block aspect-[16/8] overflow-hidden bg-mist sm:aspect-[21/8]"
                >
                  <img
                    src={group.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-ink/40 transition-colors duration-500 group-hover:bg-ink/50" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 transition-transform duration-500 group-hover:translate-y-[-2px] md:p-10">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/75">
                      {group.eyebrow}
                    </p>
                    <h2 className="mt-2 font-display text-4xl font-bold tracking-tight text-snow md:text-6xl">
                      {group.title}
                    </h2>
                    <p className="mt-3 max-w-md text-sm text-white/80 md:text-base">
                      {group.description}
                    </p>
                    <span className="mt-5 text-xs uppercase tracking-[0.18em] text-snow">
                      Shop {group.title}
                    </span>
                  </div>
                </Link>
              </Reveal>

              {items.length > 0 ? (
                <div className="mt-8 md:mt-10">
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
