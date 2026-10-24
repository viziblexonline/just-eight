import { products } from '../data/products'
import type { Audience, Product, ProductCategory, SortOption } from '../types'
import { getEffectivePrice } from '../data/products'

export function matchesAudienceQuery(audience: Audience, query: string): boolean {
  if (audience === 'men') return query === 'men' || query === 'mens' || query === 'menswear'
  if (audience === 'women') {
    return query === 'women' || query === 'womens' || query === 'womenswear'
  }
  return query === 'kids' || query === 'kid' || query === 'children' || query === 'kidswear'
}

export interface ProductFilters {
  search?: string
  categories?: ProductCategory[]
  audiences?: Audience[]
  minPrice?: number
  maxPrice?: number
  sizes?: string[]
  colors?: string[]
  sort?: SortOption
}

export function filterProducts(filters: ProductFilters = {}): Product[] {
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

export function getAllColors(): string[] {
  return [...new Set(products.flatMap((p) => p.colors.map((c) => c.name)))].sort()
}

export function getAllSizes(): string[] {
  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  const sizes = [...new Set(products.flatMap((p) => p.sizes))]
  return sizes.sort((a, b) => order.indexOf(a) - order.indexOf(b))
}

export function getPriceBounds(): { min: number; max: number } {
  const prices = products.map(getEffectivePrice)
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  }
}
