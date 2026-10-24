import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { getEffectivePrice } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { useInView } from '../../hooks/useInView'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const price = getEffectivePrice(product)
  const onSale = typeof product.salePrice === 'number'
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <article
      ref={ref}
      className={[
        'group reveal reveal-up hover-lift',
        inView ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--reveal-delay': `${Math.min(index, 8) * 70}ms` } as CSSProperties}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-mist">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/5" />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.newArrival ? (
              <span className="bg-snow px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink">
                New
              </span>
            ) : null}
            {onSale ? (
              <span className="bg-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-snow">
                Sale
              </span>
            ) : null}
            {product.stock <= 0 ? (
              <span className="bg-mute px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-snow">
                Sold out
              </span>
            ) : null}
          </div>
        </div>
        <div className="mt-4 space-y-1.5 transition-transform duration-500 group-hover:translate-y-[-2px]">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">
            {product.category.replace('-', ' ')}
          </p>
          <h3 className="font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-ink-soft">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{formatPrice(price)}</span>
            {onSale ? (
              <span className="text-mute line-through">{formatPrice(product.price)}</span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  )
}
