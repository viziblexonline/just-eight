import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAdminOrders, fetchAdminProducts } from '../../services/admin'
import { formatPrice } from '../../lib/format'
import { Button } from '../../components/ui/Button'

export function AdminDashboardPage() {
  const [productCount, setProductCount] = useState(0)
  const [orderCount, setOrderCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const [products, orders] = await Promise.all([
          fetchAdminProducts(),
          fetchAdminOrders(),
        ])
        setProductCount(products.length)
        setOrderCount(orders.length)
        setRevenue(
          orders.reduce((sum, o) => sum + Number(o.total || 0), 0),
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stats')
      }
    }
    void load()
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Overview
      </h1>
      <p className="mt-3 text-sm text-mute">
        Manage your catalog. Use Add product to create new items for the shop.
      </p>

      {error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Stat label="Products" value={String(productCount)} />
          <Stat label="Orders" value={String(orderCount)} />
          <Stat label="Order total" value={formatPrice(revenue)} />
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
        <Link to="/admin/products">
          <Button variant="outline">Manage products</Button>
        </Link>
        <Link to="/admin/orders">
          <Button variant="ghost">View orders</Button>
        </Link>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line bg-snow p-6">
      <p className="text-xs uppercase tracking-[0.16em] text-mute">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
    </div>
  )
}
