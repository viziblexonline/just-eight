import { Link } from 'react-router-dom'
import { useCatalog } from '../context/CatalogContext'
import { useWishlist } from '../context/WishlistContext'
import { ProductGrid } from '../components/product/ProductGrid'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

export function WishlistPage() {
  const { ids, clear } = useWishlist()
  const { products, loading } = useCatalog()

  const wished = products.filter((p) => ids.includes(p.id))

  if (!loading && ids.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save pieces you love and find them here anytime."
        actionLabel="Continue shopping"
        actionTo="/shop"
      />
    )
  }

  return (
    <div className="container-je py-10 md:py-14">
      <div className="mb-10 flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-mute">
            Saved
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">
            Wishlist
          </h1>
          <p className="mt-2 text-sm text-mute">
            {wished.length} item{wished.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="flex gap-3">
          {ids.length > 0 ? (
            <Button variant="ghost" onClick={clear}>
              Clear all
            </Button>
          ) : null}
          <Link to="/shop">
            <Button variant="outline">Shop more</Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-[11px] uppercase tracking-[0.2em] text-mute">
          Loading…
        </p>
      ) : wished.length === 0 ? (
        <EmptyState
          title="Saved items unavailable"
          description="Some wishlist items may have been removed from the catalog."
          actionLabel="Browse shop"
          actionTo="/shop"
        />
      ) : (
        <ProductGrid products={wished} />
      )}
    </div>
  )
}
