import { useEffect, useState } from 'react'
import { fetchAdminOrders, updateOrderStatus } from '../../services/admin'
import type { DbOrder } from '../../types/database'
import { formatPrice, formatDate } from '../../lib/format'

const STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      setOrders(await fetchAdminOrders())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleStatus(orderId: string, status: string) {
    try {
      await updateOrderStatus(orderId, status)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 text-sm text-mute">
        Update fulfillment status. Payment processing is still a separate step.
      </p>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="mt-10 text-sm text-mute">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="mt-10 text-sm text-mute">
          No orders in the database yet. Demo checkout still stores locally until
          order write is enabled at checkout.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="border border-line bg-snow p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg font-semibold">
                    {order.order_number}
                  </p>
                  <p className="mt-1 text-sm text-mute">
                    {order.customer_name} · {order.email}
                  </p>
                  <p className="mt-1 text-xs text-mute">
                    {formatDate(order.created_at)} ·{' '}
                    {formatPrice(Number(order.total))}
                  </p>
                </div>
                <label className="text-xs uppercase tracking-[0.12em] text-mute">
                  Status
                  <select
                    value={order.status}
                    onChange={(e) =>
                      void handleStatus(order.id, e.target.value)
                    }
                    className="mt-2 block border border-line bg-snow px-3 py-2 text-xs uppercase text-ink"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
