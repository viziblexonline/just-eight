import { Hero } from '../components/home/Hero'
import { HomeIntro } from '../components/home/HomeIntro'
import { AudienceSections } from '../components/home/AudienceSections'
import { CategoryGrid } from '../components/home/CategoryGrid'
import { ProductSection } from '../components/home/ProductSection'
import { BrandStory } from '../components/home/BrandStory'
import { Newsletter } from '../components/home/Newsletter'
import { SalesChart } from '../components/home/SalesChart'
import { useCatalog } from '../context/CatalogContext'

export function HomePage() {
  const { products, loading } = useCatalog()

  const featured = products.filter((p) => p.featured).slice(0, 4)
  const newArrivals = products
    .filter((p) => p.newArrival)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 4)
  const bestSellers = products
    .filter((p) => p.bestSeller)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4)

  return (
    <>
      <Hero />
      <HomeIntro />
      {loading ? (
        <div className="container-je py-20 text-center text-sm text-mute">
          Loading collection…
        </div>
      ) : (
        <ProductSection
          eyebrow="Featured"
          title="Featured Products"
          products={featured}
          viewAllTo="/shop?sort=popularity"
        />
      )}
      <CategoryGrid />
      {!loading ? <AudienceSections /> : null}
      {!loading ? (
        <ProductSection
          eyebrow="Just in"
          title="New Arrivals"
          products={newArrivals}
          viewAllTo="/shop?sort=newest"
        />
      ) : null}
      {!loading ? (
        <ProductSection
          eyebrow="Most wanted"
          title="Best Sellers"
          products={bestSellers}
          viewAllTo="/shop?sort=popularity"
        />
      ) : null}
      <BrandStory />
      <SalesChart />
      <Newsletter />
    </>
  )
}
