import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { ProductGrid } from '../product/ProductGrid'
import { Reveal } from '../ui/Reveal'

interface ProductSectionProps {
  eyebrow: string
  title: string
  products: Product[]
  viewAllTo?: string
}

export function ProductSection({
  eyebrow,
  title,
  products,
  viewAllTo = '/shop',
}: ProductSectionProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-je">
        <Reveal className="mb-12 flex items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-[0.03em] md:text-5xl">
              {title}
            </h2>
          </div>
          <Link
            to={viewAllTo}
            className="link-underline text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink"
          >
            View all
          </Link>
        </Reveal>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
