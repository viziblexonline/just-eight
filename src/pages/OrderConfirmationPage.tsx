import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { readStorage } from '../lib/storage'
import { formatPrice, formatDate } from '../lib/format'
import type { OrderSummary } from '../types'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

const ORDER_KEY = 'just-eight-last-order'

export function OrderConfirmationPage() {
  const { orderId } = useParams()
  const order = readStorage<OrderSummary | null>(ORDER_KEY, null)

  if (!order || order.id !== orderId) {
    return (
      <EmptyState
        title="Order not found"
        description="We could not find this demo order in your browser session."
        actionLabel="Return home"
        actionTo="/"
      />
    )
  }

  return (
    <div className="container-je py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <CheckCircle2 className="mx-auto text-ink" size={48} strokeWidth={1.5} />
        <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Order confirmed
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-mute md:text-base">
          This is a demo confirmation only. No payment was taken and no
          fulfillment email was sent. Order reference{' '}
          <span className="font-medium text-ink">{order.id}</span> saved locally
          on {formatDate(order.createdAt)}.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-2xl border border-line p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold">Summary</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {order.items.map((item) => (
            <li
              key={`${item.productId}-${item.size}-${item.color}`}
              className="flex justify-between gap-4"
            >
              <span>
                {item.name || 'Product'} · {item.color} / {item.size} ×{' '}
                {item.quantity}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-mute">Ship to</dt>
            <dd className="text-right">
              {order.form.fullName}
              <br />
              {order.form.address}, {order.form.city} {order.form.postalCode}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mute">Email</dt>
            <dd>{order.form.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-mute">Payment</dt>
            <dd className="capitalize">{order.form.paymentMethod} (demo)</dd>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-10 flex justify-center gap-4">
        <Link to="/shop">
          <Button>Continue Shopping</Button>
        </Link>
        <Link to="/">
          <Button variant="outline">Home</Button>
        </Link>
      </div>
    </div>
  )
}
