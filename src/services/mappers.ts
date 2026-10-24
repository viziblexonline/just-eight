import type {
  Audience,
  Category,
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
} from '../types'
import type { DbCategory, DbProduct } from '../types/database'

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  return []
}

function readAudience(row: DbProduct): Audience {
  const value = (row as DbProduct & { audience?: string }).audience
  if (value === 'women' || value === 'kids' || value === 'men') return value
  return 'men'
}

function asNumber(value: number | string | null | undefined): number | undefined {
  if (value === null || value === undefined || value === '') return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

export function mapCategory(row: DbCategory): Category {
  return {
    id: row.id as ProductCategory,
    name: row.name,
    description: row.description,
    image: row.image_url,
  }
}

export function mapProduct(row: DbProduct): Product {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((img) => img.url)

  const variants = row.product_variants ?? []
  const sizes = [
    ...new Set(variants.map((v) => v.size)),
  ] as ProductSize[]

  const colorMap = new Map<string, ProductColor>()
  for (const v of variants) {
    if (!colorMap.has(v.color_name)) {
      colorMap.set(v.color_name, { name: v.color_name, hex: v.color_hex })
    }
  }

  const variantStock = variants.reduce((sum, v) => sum + v.stock, 0)
  const stock = variants.length > 0 ? variantStock : row.stock
  const salePrice = asNumber(row.sale_price)

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    details: asStringArray(row.details),
    care: asStringArray(row.care),
    price: asNumber(row.price) ?? 0,
    salePrice,
    category: row.category_id as ProductCategory,
    audience: readAudience(row),
    images:
      images.length > 0
        ? images
        : [
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
          ],
    sizes: sizes.length > 0 ? sizes : (['M', 'L'] as ProductSize[]),
    colors:
      colorMap.size > 0
        ? [...colorMap.values()]
        : [{ name: 'Black', hex: '#0a0a0a' }],
    stock,
    featured: row.featured,
    newArrival: row.new_arrival,
    bestSeller: row.best_seller,
    popularity: row.popularity,
    createdAt: row.created_at.slice(0, 10),
    isDemo: row.is_demo,
  }
}
