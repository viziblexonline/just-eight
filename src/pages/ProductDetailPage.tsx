import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getEffectivePrice } from '../data/products'
import { formatPrice } from '../lib/format'
import { useCart } from '../hooks/useCart'
import { useCatalog } from '../context/CatalogContext'
import type { Product, ProductSize } from '../types'
import { Button } from '../components/ui/Button'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { ProductGrid } from '../components/product/ProductGrid'
import { ProductImageZoom } from '../components/product/ProductImageZoom'
import { EmptyState } from '../components/ui/EmptyState'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { products, loading, getBySlug, getCategoryName } = useCatalog()
  const { addItem } = useCart()

  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<ProductSize | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setActiveImage(0)
    setSize(null)
    setColor(null)
    setQty(1)

    async function load() {
      if (!slug) {
        setProduct(null)
        return
      }
      const cached = products.find((p) => p.slug === slug)
      if (cached) {
        setProduct(cached)
        return
      }
      const remote = await getBySlug(slug)
      if (active) setProduct(remote ?? null)
    }

    void load()
    return () => {
      active = false
    }
  }, [slug, products, getBySlug])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 4)
  }, [product, products])

  if (loading && product === undefined) {
    return (
      <div className="container-je py-20 text-center text-sm text-mute">
        Loading product…
      </div>
    )
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This product may have been removed or the link is incorrect."
        actionLabel="Back to Shop"
        actionTo="/shop"
      />
    )
  }

  const price = getEffectivePrice(product)
  const onSale = typeof product.salePrice === 'number'
  const inStock = product.stock > 0

  function handleAdd() {
    if (!product) return
    setMessage(null)
    setError(null)
    if (!size) {
      setError('Please select a size.')
      return
    }
    if (!color) {
      setError('Please select a color.')
      return
    }
    const result = addItem({
      product,
      size,
      color,
      quantity: qty,
    })
    if (result.ok) setMessage(result.message)
    else setError(result.message)
  }

  return (
    <div className="container-je py-10 md:py-14">
      <nav className="mb-8 text-xs uppercase tracking-[0.14em] text-mute">
        <Link to="/shop" className="hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          to={`/shop?category=${product.category}`}
          className="hover:text-ink"
        >
          {getCategoryName(product.category)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductImageZoom
          images={product.images}
          activeIndex={activeImage}
          onSelect={setActiveImage}
          alt={product.name}
        />

        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-mute">
            {getCategoryName(product.category)}
            {product.isDemo ? ' · Demo product' : ''}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {product.name}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl font-medium">{formatPrice(price)}</span>
            {onSale ? (
              <span className="text-mute line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
          <p className="mt-6 text-base leading-relaxed text-mute">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.16em] text-mute">Color</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  title={c.name}
                  aria-label={c.name}
                  onClick={() => setColor(c.name)}
                  className={[
                    'h-9 w-9 rounded-full border-2 transition-transform',
                    color === c.name
                      ? 'scale-110 border-ink'
                      : 'border-line hover:border-mute',
                  ].join(' ')}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
            {color ? <p className="mt-2 text-sm text-mute">{color}</p> : null}
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-[0.16em] text-mute">Size</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={[
                    'min-w-12 border px-3 py-2.5 text-xs uppercase tracking-wider transition-colors',
                    size === s
                      ? 'border-ink bg-ink text-snow'
                      : 'border-line hover:border-ink',
                  ].join(' ')}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <QuantitySelector
              value={qty}
              min={1}
              max={Math.max(1, product.stock)}
              onChange={setQty}
            />
            <Button
              size="lg"
              className="min-w-[200px]"
              disabled={!inStock}
              onClick={handleAdd}
            >
              {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>

          <p
            className={[
              'mt-4 text-sm',
              inStock ? 'text-mute' : 'text-red-600',
            ].join(' ')}
          >
            {inStock ? `${product.stock} in stock` : 'Currently unavailable'}
          </p>

          {error ? (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="mt-3 text-sm text-ink" role="status">
              {message}{' '}
              <Link to="/cart" className="underline underline-offset-4">
                View cart
              </Link>
            </p>
          ) : null}

          <div className="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-lg font-semibold">Details</h2>
              <ul className="mt-4 space-y-2 text-sm text-mute">
                {product.details.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold">Care</h2>
              <ul className="mt-4 space-y-2 text-sm text-mute">
                {product.care.map((c) => (
                  <li key={c}>• {c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-line pt-16 md:mt-28">
          <h2 className="mb-10 font-display text-3xl font-bold tracking-tight">
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      ) : null}
    </div>
  )
}
