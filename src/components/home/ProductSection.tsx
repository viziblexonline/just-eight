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
        <Reveal className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-mute">{eyebrow}</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
          </div>
          <Link
            to={viewAllTo}
            className="interactive text-xs uppercase tracking-[0.18em] text-mute hover:text-ink"
          >
            View all
          </Link>
        </Reveal>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
