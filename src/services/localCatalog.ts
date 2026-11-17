import { readStorage, writeStorage } from '../lib/storage'
import type {
  Audience,
  Product,
  ProductCategory,
  ProductColor,
  ProductGalleryImage,
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
  gallery?: ProductGalleryImage[]
}

const PRODUCTS_KEY = 'just-eight-local-products'
const CATEGORIES_KEY = 'just-eight-local-categories'
const HIDDEN_PRODUCTS_KEY = 'just-eight-hidden-products'
const HIDDEN_CATEGORIES_KEY = 'just-eight-hidden-categories'

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
  const fallback =
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80'
  const gallery =
    input.gallery && input.gallery.length > 0
      ? input.gallery
      : (input.imageUrls.length > 0 ? input.imageUrls : [fallback]).map(
          (url) => ({ url, colorName: null as string | null }),
        )
  const images = gallery.map((img) => img.url)

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
    images,
    gallery,
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

/** Upsert a local override for a default/demo product while keeping its id. */
export function upsertLocalProduct(
  productId: string,
  input: LocalProductInput,
  createdAt = new Date().toISOString().slice(0, 10),
) {
  const products = getLocalProducts().filter(
    (p) => p.id !== productId && p.slug !== input.slug,
  )
  saveLocalProducts([fromInput(input, productId, createdAt), ...products])
}

export function deleteLocalProduct(productId: string) {
  saveLocalProducts(getLocalProducts().filter((p) => p.id !== productId))
}

export function listHiddenProductIds(): string[] {
  return readStorage<string[]>(HIDDEN_PRODUCTS_KEY, [])
}

export function hideLocalProduct(productId: string) {
  const hidden = listHiddenProductIds()
  if (!hidden.includes(productId)) {
    writeStorage(HIDDEN_PRODUCTS_KEY, [...hidden, productId])
  }
  deleteLocalProduct(productId)
}

export function listHiddenCategoryIds(): string[] {
  return readStorage<string[]>(HIDDEN_CATEGORIES_KEY, [])
}

export function hideLocalCategory(id: string) {
  const hidden = listHiddenCategoryIds()
  if (!hidden.includes(id)) {
    writeStorage(HIDDEN_CATEGORIES_KEY, [...hidden, id])
  }
  deleteLocalCategory(id)
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

export function updateLocalCategory(input: {
  id: string
  name: string
  description: string
  imageUrl: string
}) {
  const categories = listLocalCategories()
  const index = categories.findIndex((c) => c.id === input.id)
  const next = {
    id: input.id,
    name: input.name,
    description: input.description,
    image: input.imageUrl,
  }
  if (index >= 0) {
    categories[index] = next
    writeStorage(CATEGORIES_KEY, categories)
    return
  }
  // Seed/default category override (not yet in local storage)
  writeStorage(CATEGORIES_KEY, [...categories, next])
}

export function deleteLocalCategory(id: string) {
  writeStorage(
    CATEGORIES_KEY,
    listLocalCategories().filter((c) => c.id !== id),
  )
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Failed to read image file.'))
    reader.readAsDataURL(file)
  })
}
