import { useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { getEffectivePrice } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { useInView } from '../../hooks/useInView'
import { useCatalog } from '../../context/CatalogContext'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../hooks/useCart'
import type { Product } from '../../types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const price = getEffectivePrice(product)
  const onSale = typeof product.salePrice === 'number'
  const discount =
    onSale && product.price > 0
      ? Math.round(((product.price - price) / product.price) * 100)
      : 0
  const { ref, inView } = useInView<HTMLElement>()
  const { getCategoryName } = useCatalog()
  const { has, toggle } = useWishlist()
  const { addItem } = useCart()
  const [quickMsg, setQuickMsg] = useState<string | null>(null)
  const wished = has(product.id)
  const hoverImage = product.images[1] ?? product.images[0]

  function quickAdd(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (product.stock <= 0) {
      setQuickMsg('Sold out')
      return
    }
    const size = product.sizes[0]
    const color = product.colors[0]?.name
    if (!size || !color) {
      setQuickMsg('Select options')
      return
    }
    const result = addItem({ product, size, color, quantity: 1 })
    setQuickMsg(result.ok ? 'Added' : result.message)
    window.setTimeout(() => setQuickMsg(null), 1600)
  }

  return (
    <article
      ref={ref}
      className={['group reveal reveal-up', inView ? 'is-visible' : '']
        .filter(Boolean)
        .join(' ')}
      style={{ '--reveal-delay': `${Math.min(index, 8) * 50}ms` } as CSSProperties}
    >
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden bg-mist">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={[
                'absolute inset-0 h-full w-full object-cover transition-all duration-700',
                hoverImage !== product.images[0]
                  ? 'group-hover:opacity-0'
                  : 'group-hover:scale-105',
              ].join(' ')}
            />
            {hoverImage !== product.images[0] ? (
              <img
                src={hoverImage}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              />
            ) : null}

            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {product.newArrival ? (
                <span className="bg-ink px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-snow">
                  New
                </span>
              ) : null}
              {discount > 0 ? (
                <span className="bg-snow px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-ink">
                  -{discount}%
                </span>
              ) : null}
              {product.stock <= 0 ? (
                <span className="bg-mute px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-snow">
                  Sold out
                </span>
              ) : null}
            </div>
          </div>
        </Link>

        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-2 top-2 grid h-9 w-9 place-items-center bg-snow/90 text-ink transition-colors hover:bg-snow"
          onClick={(e) => {
            e.preventDefault()
            toggle(product.id)
          }}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={wished ? 'fill-ink' : ''}
          />
        </button>

        <button
          type="button"
          onClick={quickAdd}
          disabled={product.stock <= 0}
          className="absolute inset-x-0 bottom-0 translate-y-full bg-navy py-3 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-accent transition-transform duration-500 group-hover:translate-y-0 disabled:opacity-50"
        >
          {quickMsg ?? 'Quick add'}
        </button>
      </div>

      <Link to={`/product/${product.slug}`} className="mt-3 block space-y-1.5">
        <p className="text-[10px] uppercase tracking-[0.14em] text-mute">
          {getCategoryName(product.category)}
        </p>
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">{formatPrice(price)}</span>
          {onSale ? (
            <span className="text-mute line-through">{formatPrice(product.price)}</span>
          ) : null}
        </div>
        {product.colors.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.colors.slice(0, 5).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3 w-3 rounded-full border border-line"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 5 ? (
              <span className="text-[10px] text-mute">+{product.colors.length - 5}</span>
            ) : null}
          </div>
        ) : null}
      </Link>
    </article>
  )
}
