import { Hero } from '../components/home/Hero'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { FeaturedCollections } from '../components/home/FeaturedCollections'
import { ProductRail } from '../components/home/ProductRail'
import { PromoBanner } from '../components/home/PromoBanner'
import { BrandStory } from '../components/home/BrandStory'
import { Newsletter } from '../components/home/Newsletter'
import { useCatalog } from '../context/CatalogContext'

export function HomePage() {
  const { products, loading } = useCatalog()

  const byNewest = [...products].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  const featured = products.filter((p) => p.featured).slice(0, 8)
  const featuredShown = featured.length > 0 ? featured : byNewest.slice(0, 8)

  const newArrivals = products
    .filter((p) => p.newArrival)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 10)
  const newShown = newArrivals.length > 0 ? newArrivals : byNewest.slice(0, 10)

  const bestSellers = products
    .filter((p) => p.bestSeller)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)
  const bestShown =
    bestSellers.length > 0 ? bestSellers : byNewest.slice(0, 10)

  const trending = [...products]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10)

  return (
    <>
      <Hero />
      <CategoryGrid />
      {loading ? (
        <div className="container-je py-16 text-center text-[11px] uppercase tracking-[0.2em] text-mute">
          Loading collection…
        </div>
      ) : (
        <ProductRail
          title="New arrivals"
          products={newShown}
          viewAllTo="/shop?sort=newest"
        />
      )}
      <FeaturedCollections />
      {!loading ? (
        <ProductRail
          title="Best sellers"
          products={bestShown}
          viewAllTo="/shop?sort=popularity"
        />
      ) : null}
      <PromoBanner />
      {!loading ? (
        <ProductRail
          title="Trending"
          products={trending.length ? trending : featuredShown}
          viewAllTo="/shop?sort=popularity"
        />
      ) : null}
      <BrandStory />
      <Newsletter />
    </>
  )
}
