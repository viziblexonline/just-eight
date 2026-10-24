/**
 * Catalog service — Supabase when configured, demo data as fallback.
 * Never uses the service-role key.
 */
import { products as demoProducts, getEffectivePrice } from '../data/products'
import { categories as demoCategories } from '../data/categories'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { matchesAudienceQuery, type ProductFilters } from '../lib/products'
import type { Category, Product } from '../types'
import type { DbCategory, DbProduct } from '../types/database'
import { mapCategory, mapProduct } from './mappers'
import {
  getLocalProductById,
  getLocalProductBySlug,
  listLocalCategories,
  listLocalProducts,
} from './localCatalog'

export { getEffectivePrice }
export type { ProductFilters }

const productSelect = `
  *,
  product_images (*),
  product_variants (*)
`

function withAudience(product: Product): Product {
  if (
    product.audience === 'men' ||
    product.audience === 'women' ||
    product.audience === 'kids'
  ) {
    return product
  }
  return { ...product, audience: 'men' }
}

function mergeLocalCatalog(base: Product[]): Product[] {
  const local = listLocalProducts().map(withAudience)
  if (!local.length) return base
  const localSlugs = new Set(local.map((p) => p.slug))
  const localIds = new Set(local.map((p) => p.id))
  return [
    ...local,
    ...base.filter((p) => !localSlugs.has(p.slug) && !localIds.has(p.id)),
  ]
}

function mergeLocalCategories(base: Category[]): Category[] {
  const local = listLocalCategories().map((c) => ({
    id: c.id as Category['id'],
    name: c.name,
    description: c.description,
    image: c.image,
  }))
  if (!local.length) return base
  const ids = new Set(local.map((c) => c.id))
  return [...base.filter((c) => !ids.has(c.id)), ...local]
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return mergeLocalCatalog(demoProducts)

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error || !data?.length) {
    if (error) console.warn('[catalog] products fallback:', error.message)
    return mergeLocalCatalog(demoProducts)
  }

  return mergeLocalCatalog((data as DbProduct[]).map(mapProduct))
}

export async function fetchProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const local = getLocalProductBySlug(slug)
  if (local) return withAudience(local)

  if (!supabase) return demoProducts.find((p) => p.slug === slug)

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.warn('[catalog] product fallback:', error.message)
    return demoProducts.find((p) => p.slug === slug)
  }
  if (!data) return demoProducts.find((p) => p.slug === slug)
  return mapProduct(data as DbProduct)
}

export async function fetchProductById(
  id: string,
): Promise<Product | undefined> {
  const local = getLocalProductById(id)
  if (local) return withAudience(local)

  if (!supabase) return demoProducts.find((p) => p.id === id)

  const { data, error } = await supabase
    .from('products')
    .select(productSelect)
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return demoProducts.find((p) => p.id === id)
  return mapProduct(data as DbProduct)
}

export async function fetchCategories(): Promise<Category[]> {
  if (!supabase) return mergeLocalCategories(demoCategories)

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error || !data?.length) {
    if (error) console.warn('[catalog] categories fallback:', error.message)
    return mergeLocalCategories(demoCategories)
  }

  return mergeLocalCategories((data as DbCategory[]).map(mapCategory))
}

export function filterProductList(
  products: Product[],
  filters: ProductFilters = {},
): Product[] {
  let result = [...products]

  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase()
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        matchesAudienceQuery(p.audience, q),
    )
  }

  if (filters.categories?.length) {
    result = result.filter((p) => filters.categories!.includes(p.category))
  }

  if (filters.audiences?.length) {
    result = result.filter((p) => filters.audiences!.includes(p.audience))
  }

  if (typeof filters.minPrice === 'number') {
    result = result.filter((p) => getEffectivePrice(p) >= filters.minPrice!)
  }

  if (typeof filters.maxPrice === 'number') {
    result = result.filter((p) => getEffectivePrice(p) <= filters.maxPrice!)
  }

  if (filters.sizes?.length) {
    result = result.filter((p) =>
      p.sizes.some((s) => filters.sizes!.includes(s)),
    )
  }

  if (filters.colors?.length) {
    result = result.filter((p) =>
      p.colors.some((c) => filters.colors!.includes(c.name)),
    )
  }

  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b))
      break
    case 'price-desc':
      result.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a))
      break
    case 'popularity':
      result.sort((a, b) => b.popularity - a.popularity)
      break
    case 'newest':
    default:
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      break
  }

  return result
}

export const catalogSource = isSupabaseConfigured ? 'supabase' : 'demo'
export const adminApiReady = isSupabaseConfigured
