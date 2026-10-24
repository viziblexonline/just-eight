import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  catalogSource,
  fetchCategories,
  fetchProductById,
  fetchProductBySlug,
  fetchProducts,
  filterProductList,
  getEffectivePrice,
} from '../services/catalog'
import type { ProductFilters } from '../lib/products'
import type { Category, Product } from '../types'

interface CatalogContextValue {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  source: 'supabase' | 'demo'
  refresh: () => Promise<void>
  getBySlug: (slug: string) => Promise<Product | undefined>
  getById: (id: string) => Product | undefined
  filter: (filters?: ProductFilters) => Product[]
  getCategoryName: (id: string) => string
  priceBounds: { min: number; max: number }
  allSizes: string[]
  allColors: string[]
}

const CatalogContext = createContext<CatalogContextValue | null>(null)

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])
      setProducts(nextProducts)
      setCategories(nextCategories)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const value = useMemo<CatalogContextValue>(() => {
    const prices = products.map(getEffectivePrice)
    const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']

    return {
      products,
      categories,
      loading,
      error,
      source: catalogSource,
      refresh,
      getBySlug: fetchProductBySlug,
      getById: (id: string) => products.find((p) => p.id === id),
      filter: (filters) => filterProductList(products, filters),
      getCategoryName: (id) =>
        categories.find((c) => c.id === id)?.name ?? id,
      priceBounds: {
        min: prices.length ? Math.floor(Math.min(...prices)) : 0,
        max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
      },
      allSizes: [
        ...new Set(products.flatMap((p) => p.sizes)),
      ].sort((a, b) => order.indexOf(a) - order.indexOf(b)),
      allColors: [
        ...new Set(products.flatMap((p) => p.colors.map((c) => c.name))),
      ].sort(),
    }
  }, [products, categories, loading, error, refresh])

  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  )
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider')
  return ctx
}

/** Prefetch helper for cart line items when product may not be in local cache */
export async function resolveProductById(id: string) {
  return fetchProductById(id)
}
