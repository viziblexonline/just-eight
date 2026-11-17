import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/format'
import { QuantitySelector } from '../components/ui/QuantitySelector'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const shippingEstimate = subtotal >= 150 ? 0 : subtotal > 0 ? 12 : 0
  const total = subtotal + shippingEstimate

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your bag is empty"
        description="Discover the JUST EIGHT collection and add pieces you love."
        actionLabel="Continue shopping"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="container-je py-10 md:py-14">
      <h1 className="text-3xl font-medium tracking-tight md:text-5xl">Shopping bag</h1>
      <p className="mt-2 text-sm text-mute">{items.length} item{items.length === 1 ? '' : 's'}</p>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-line border-y border-line">
          {items.map((item) => {
            const lineTotal = item.unitPrice * item.quantity
            return (
              <li
                key={`${item.productId}-${item.size}-${item.color}`}
                className="grid gap-4 py-6 sm:grid-cols-[100px_1fr_auto]"
              >
                <Link
                  to={`/product/${item.slug}`}
                  className="aspect-[3/4] overflow-hidden bg-mist"
                >
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </Link>
                <div>
                  <Link
                    to={`/product/${item.slug}`}
                    className="text-base font-medium hover:opacity-60"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-2 text-sm text-mute">
                    {item.color} / {item.size}
                  </p>
                  <p className="mt-1 text-sm">{formatPrice(item.unitPrice)}</p>
                  <div className="mt-4">
                    <QuantitySelector
                      value={item.quantity}
                      min={1}
                      max={item.maxStock || 99}
                      onChange={(q) =>
                        updateQuantity(item.productId, item.size, item.color, q)
                      }
                    />
                  </div>
                </div>
                <div className="flex items-start justify-between gap-4 sm:flex-col sm:items-end">
                  <p className="font-medium">{formatPrice(lineTotal)}</p>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-mute hover:text-ink"
                    onClick={() => removeItem(item.productId, item.size, item.color)}
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </li>
            )
          })}
        </ul>

        <aside className="h-fit border border-line bg-paper/50 p-6">
          <h2 className="text-lg font-medium">Order summary</h2>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-mute">Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mute">Shipping</dt>
              <dd>{shippingEstimate === 0 ? 'Free' : formatPrice(shippingEstimate)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="mt-6 block">
            <Button fullWidth size="lg">
              Checkout
            </Button>
          </Link>
          <Link
            to="/shop"
            className="mt-4 block text-center text-[11px] uppercase tracking-[0.14em] text-mute hover:text-ink"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
