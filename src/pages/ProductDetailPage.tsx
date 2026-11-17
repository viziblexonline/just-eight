import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Truck } from 'lucide-react'
import { getEffectivePrice } from '../data/products'
import { formatPrice } from '../lib/format'
import { imagesForColor } from '../lib/products'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../context/WishlistContext'
import { useCatalog } from '../context/CatalogContext'
import type { Product, ProductSize } from '../types'
import { Button } from '../components/ui/Button'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { ProductRail } from '../components/home/ProductRail'
import { ProductImageZoom } from '../components/product/ProductImageZoom'
import { EmptyState } from '../components/ui/EmptyState'

export function ProductDetailPage() {
  const { slug } = useParams()
  const { products, loading, getBySlug, getCategoryName } = useCatalog()
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()

  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [activeImage, setActiveImage] = useState(0)
  const [size, setSize] = useState<ProductSize | null>(null)
  const [color, setColor] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openPanel, setOpenPanel] = useState<'details' | 'care' | 'delivery' | null>(
    'details',
  )

  useEffect(() => {
    let active = true
    setActiveImage(0)
    setSize(null)
    setColor(null)
    setQty(1)
    setMessage(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })

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
      .slice(0, 8)
  }, [product, products])

  const displayImages = useMemo(() => {
    if (!product) return []
    return imagesForColor(product, color)
  }, [product, color])

  useEffect(() => {
    setActiveImage(0)
  }, [color, product?.id])

  useEffect(() => {
    if (!product || color || product.colors.length === 0) return
    setColor(product.colors[0].name)
  }, [product, color])

  if (loading && product === undefined) {
    return (
      <div className="container-je py-24 text-center text-[11px] uppercase tracking-[0.2em] text-mute">
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
  const gallery = displayImages.length ? displayImages : product.images
  const wished = has(product.id)
  const discount =
    onSale && product.price > 0
      ? Math.round(((product.price - price) / product.price) * 100)
      : 0

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
    const result = addItem({ product, size, color, quantity: qty })
    if (result.ok) setMessage(result.message)
    else setError(result.message)
  }

  return (
    <div className="animate-fade-up pb-16 md:pb-24">
      <div className="container-je pt-6 md:pt-10">
        <nav className="mb-8 flex flex-wrap items-center gap-x-2 text-[10px] uppercase tracking-[0.16em] text-mute">
          <Link to="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="hover:text-ink">
            {getCategoryName(product.category)}
          </Link>
          <span>/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductImageZoom
            images={gallery}
            activeIndex={activeImage}
            onSelect={setActiveImage}
            alt={color ? `${product.name} — ${color}` : product.name}
          />

          <div className="sticky-buy">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-mute">
              {getCategoryName(product.category)}
              {product.isDemo ? ' · Demo' : ''}
            </p>
            <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-xl font-medium">{formatPrice(price)}</span>
              {onSale ? (
                <span className="text-mute line-through">{formatPrice(product.price)}</span>
              ) : null}
              {discount > 0 ? (
                <span className="bg-mist px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em]">
                  -{discount}%
                </span>
              ) : null}
            </div>

            <p className="mt-5 max-w-lg text-sm leading-relaxed text-mute">
              {product.description}
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-[0.16em]">Color</p>
                {color ? <p className="text-sm text-mute">{color}</p> : null}
              </div>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    onClick={() => setColor(c.name)}
                    className={[
                      'h-9 w-9 rounded-full border transition-transform',
                      color === c.name
                        ? 'scale-110 border-ink ring-1 ring-ink'
                        : 'border-line hover:border-mute',
                    ].join(' ')}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em]">Size</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setSize(s)
                      setError(null)
                    }}
                    className={[
                      'border px-2 py-3 text-xs uppercase tracking-wider transition-colors',
                      size === s
                        ? 'border-navy bg-navy text-accent'
                        : 'border-line hover:border-navy',
                    ].join(' ')}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuantitySelector
                value={qty}
                min={1}
                max={Math.max(1, product.stock)}
                onChange={setQty}
              />
              <Button
                size="lg"
                className="min-w-[200px] flex-1"
                disabled={!inStock}
                onClick={handleAdd}
              >
                {inStock ? 'Add to bag' : 'Out of stock'}
              </Button>
              <button
                type="button"
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={wished}
                className="grid h-12 w-12 place-items-center border border-ink text-ink transition-colors hover:bg-mist"
                onClick={() => toggle(product.id)}
              >
                <Heart size={18} strokeWidth={1.5} className={wished ? 'fill-ink' : ''} />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm text-mute">
              <Truck size={15} strokeWidth={1.5} />
              <span>
                {inStock
                  ? `${product.stock} in stock · ships in 2–4 days`
                  : 'Currently unavailable'}
              </span>
            </div>

            {error ? (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
            {message ? (
              <p className="mt-3 text-sm" role="status">
                {message}{' '}
                <Link to="/cart" className="underline underline-offset-4">
                  View bag
                </Link>
              </p>
            ) : null}

            <div className="mt-10 border-t border-line">
              <Accordion
                title="Details"
                open={openPanel === 'details'}
                onToggle={() =>
                  setOpenPanel((v) => (v === 'details' ? null : 'details'))
                }
              >
                <ul className="space-y-2 text-sm text-mute">
                  {product.details.map((d) => (
                    <li key={d}>• {d}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion
                title="Care"
                open={openPanel === 'care'}
                onToggle={() => setOpenPanel((v) => (v === 'care' ? null : 'care'))}
              >
                <ul className="space-y-2 text-sm text-mute">
                  {product.care.map((c) => (
                    <li key={c}>• {c}</li>
                  ))}
                </ul>
              </Accordion>
              <Accordion
                title="Delivery"
                open={openPanel === 'delivery'}
                onToggle={() =>
                  setOpenPanel((v) => (v === 'delivery' ? null : 'delivery'))
                }
              >
                <p className="text-sm leading-relaxed text-mute">
                  Standard delivery in 2–4 working days. Free shipping on orders
                  over £150. Returns accepted within 14 days for unused items.
                </p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <div className="mt-10 border-t border-line md:mt-16">
          <ProductRail
            title="You may also like"
            products={related}
            viewAllTo={`/shop?category=${product.category}`}
          />
        </div>
      ) : null}
    </div>
  )
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.16em]">
          {title}
        </span>
        <span className={['text-lg text-mute transition-transform', open ? 'rotate-45' : ''].join(' ')}>
          +
        </span>
      </button>
      <div
        className={[
          'grid transition-all duration-500',
          open ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0',
        ].join(' ')}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
