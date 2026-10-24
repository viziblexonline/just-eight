import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteProduct, fetchAdminProducts } from '../../services/admin'
import { useCatalog } from '../../context/CatalogContext'
import { formatPrice } from '../../lib/format'
import { getEffectivePrice } from '../../data/products'
import type { Product } from '../../types'
import { Button } from '../../components/ui/Button'

export function AdminProductsPage() {
  const { refresh } = useCatalog()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      setProducts(await fetchAdminProducts())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete “${product.name}”? This cannot be undone.`)) {
      return
    }
    setBusyId(product.id)
    try {
      await deleteProduct(product.id)
      await load()
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Products
          </h1>
          <p className="mt-2 text-sm text-mute">
            Add, edit, and delete catalog items with image uploads.
          </p>
        </div>
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {loading ? (
        <p className="mt-10 text-sm text-mute">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-sm text-mute">No products yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto border border-line bg-snow">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.14em] text-mute">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt=""
                        className="h-12 w-10 object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-mute">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {product.category.replace('-', ' ')}
                  </td>
                  <td className="px-4 py-3">
                    {formatPrice(getEffectivePrice(product))}
                  </td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">
                    {product.isDemo ? 'Demo' : 'Live'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/products/${product.id}`}
                        className="text-xs uppercase tracking-[0.12em] underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() => void handleDelete(product)}
                        className="text-xs uppercase tracking-[0.12em] text-red-600 underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
