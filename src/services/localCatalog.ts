import { readStorage, writeStorage } from '../lib/storage'
import type {
  Audience,
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
} from '../types'

export interface LocalProductInput {
  name: string
  slug: string
  description: string
  details: string[]
  care: string[]
  price: number
  salePrice?: number | null
  categoryId: ProductCategory | string
  audience?: Audience
  stock: number
  featured: boolean
  newArrival: boolean
  bestSeller: boolean
  popularity: number
  isActive: boolean
  sizes: ProductSize[]
  colors: ProductColor[]
  imageUrls: string[]
}

const PRODUCTS_KEY = 'just-eight-local-products'
const CATEGORIES_KEY = 'just-eight-local-categories'

export interface LocalCategory {
  id: string
  name: string
  description: string
  image: string
}

function getLocalProducts(): Product[] {
  return readStorage<Product[]>(PRODUCTS_KEY, [])
}

function saveLocalProducts(products: Product[]) {
  writeStorage(PRODUCTS_KEY, products)
}

export function listLocalProducts(): Product[] {
  return getLocalProducts()
}

export function getLocalProductById(id: string): Product | undefined {
  return getLocalProducts().find((p) => p.id === id)
}

export function getLocalProductBySlug(slug: string): Product | undefined {
  return getLocalProducts().find((p) => p.slug === slug)
}

function fromInput(input: LocalProductInput, id: string, createdAt: string): Product {
  return {
    id,
    slug: input.slug,
    name: input.name,
    description: input.description,
    details: input.details,
    care: input.care,
    price: input.price,
    salePrice: input.salePrice ?? undefined,
    category: input.categoryId as ProductCategory,
    audience: input.audience ?? 'men',
    images:
      input.imageUrls.length > 0
        ? input.imageUrls
        : [
            'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80',
          ],
    sizes: input.sizes,
    colors: input.colors,
    stock: input.stock,
    featured: input.featured,
    newArrival: input.newArrival,
    bestSeller: input.bestSeller,
    popularity: input.popularity,
    createdAt,
    isDemo: false,
  }
}

export function createLocalProduct(input: LocalProductInput): string {
  const products = getLocalProducts()
  if (products.some((p) => p.slug === input.slug)) {
    throw new Error('A product with this slug already exists.')
  }
  const id = `local_prod_${Date.now()}`
  const product = fromInput(input, id, new Date().toISOString().slice(0, 10))
  saveLocalProducts([product, ...products])
  return id
}

export function updateLocalProduct(productId: string, input: LocalProductInput) {
  const products = getLocalProducts()
  const index = products.findIndex((p) => p.id === productId)
  if (index < 0) throw new Error('Product not found.')
  if (products.some((p) => p.slug === input.slug && p.id !== productId)) {
    throw new Error('A product with this slug already exists.')
  }
  const existing = products[index]
  products[index] = fromInput(input, productId, existing.createdAt)
  saveLocalProducts(products)
}

export function deleteLocalProduct(productId: string) {
  saveLocalProducts(getLocalProducts().filter((p) => p.id !== productId))
}

export function listLocalCategories(): LocalCategory[] {
  return readStorage<LocalCategory[]>(CATEGORIES_KEY, [])
}

export function createLocalCategory(input: {
  id: string
  name: string
  description: string
  imageUrl: string
}) {
  const categories = listLocalCategories()
  if (categories.some((c) => c.id === input.id)) {
    throw new Error('Category id already exists.')
  }
  writeStorage(CATEGORIES_KEY, [
    ...categories,
    {
      id: input.id,
      name: input.name,
      description: input.description,
      image: input.imageUrl,
    },
  ])
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}
