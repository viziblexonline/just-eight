import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type {
  Audience,
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
} from '../types'
import type { DbOrder, DbProduct } from '../types/database'
import { mapProduct } from './mappers'
import {
  createLocalCategory,
  createLocalProduct,
  deleteLocalProduct,
  fileToDataUrl,
  listLocalProducts,
  updateLocalProduct,
} from './localCatalog'
import { products as demoProducts } from '../data/products'

export interface AdminProductInput {
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
  imagePaths?: (string | null)[]
}

function requireClient() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}

export async function fetchAdminProfile(userId: string): Promise<boolean> {
  if (!supabase) return false
  const { data, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .maybeSingle()
  if (error) {
    console.warn('[admin] profile:', error.message)
    return false
  }
  return Boolean(data?.is_admin)
}

export async function fetchAdminProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) {
    const local = listLocalProducts()
    const localIds = new Set(local.map((p) => p.id))
    const localSlugs = new Set(local.map((p) => p.slug))
    const demos = demoProducts.filter(
      (p) => !localIds.has(p.id) && !localSlugs.has(p.slug),
    )
    return [...local, ...demos]
  }

  const client = requireClient()
  const { data, error } = await client
    .from('products')
    .select(`*, product_images (*), product_variants (*)`)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return ((data ?? []) as DbProduct[]).map(mapProduct)
}

export async function fetchAdminOrders(): Promise<DbOrder[]> {
  if (!isSupabaseConfigured || !supabase) return []
  const client = requireClient()
  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as DbOrder[]
}

export async function updateOrderStatus(orderId: string, status: string) {
  const client = requireClient()
  const { error } = await client
    .from('orders')
    .update({ status })
    .eq('id', orderId)
  if (error) throw new Error(error.message)
}

async function syncVariants(
  productId: string,
  sizes: ProductSize[],
  colors: ProductColor[],
  stock: number,
) {
  const client = requireClient()
  await client.from('product_variants').delete().eq('product_id', productId)

  if (!sizes.length || !colors.length) return

  const perVariant = Math.max(
    0,
    Math.floor(stock / (sizes.length * colors.length)) || stock,
  )
  const rows = sizes.flatMap((size) =>
    colors.map((color) => ({
      product_id: productId,
      size,
      color_name: color.name,
      color_hex: color.hex,
      stock: perVariant,
    })),
  )

  const { error } = await client.from('product_variants').insert(rows)
  if (error) throw new Error(error.message)
}

async function syncImages(
  productId: string,
  imageUrls: string[],
  imagePaths: (string | null)[] = [],
) {
  const client = requireClient()
  await client.from('product_images').delete().eq('product_id', productId)

  if (!imageUrls.length) return

  const rows = imageUrls.map((url, index) => ({
    product_id: productId,
    url,
    storage_path: imagePaths[index] ?? null,
    sort_order: index,
    alt: '',
  }))

  const { error } = await client.from('product_images').insert(rows)
  if (error) throw new Error(error.message)
}

export async function createProduct(input: AdminProductInput): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return createLocalProduct(input)
  }

  const client = requireClient()
  const { data, error } = await client
    .from('products')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description,
      details: input.details,
      care: input.care,
      price: input.price,
      sale_price: input.salePrice ?? null,
      category_id: input.categoryId,
      stock: input.stock,
      featured: input.featured,
      new_arrival: input.newArrival,
      best_seller: input.bestSeller,
      popularity: input.popularity,
      is_active: input.isActive,
      is_demo: false,
    })
    .select('id')
    .single()

  if (error || !data) throw new Error(error?.message ?? 'Failed to create product')

  await syncVariants(data.id, input.sizes, input.colors, input.stock)
  await syncImages(data.id, input.imageUrls, input.imagePaths)
  return data.id as string
}

export async function updateProduct(
  productId: string,
  input: AdminProductInput,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const local = listLocalProducts()
    if (local.some((p) => p.id === productId)) {
      updateLocalProduct(productId, input)
    } else {
      // Editing a demo seed item creates a local override (same slug)
      createLocalProduct(input)
    }
    return
  }

  const client = requireClient()
  const { error } = await client
    .from('products')
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description,
      details: input.details,
      care: input.care,
      price: input.price,
      sale_price: input.salePrice ?? null,
      category_id: input.categoryId,
      stock: input.stock,
      featured: input.featured,
      new_arrival: input.newArrival,
      best_seller: input.bestSeller,
      popularity: input.popularity,
      is_active: input.isActive,
    })
    .eq('id', productId)

  if (error) throw new Error(error.message)

  await syncVariants(productId, input.sizes, input.colors, input.stock)
  await syncImages(productId, input.imageUrls, input.imagePaths)
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const local = listLocalProducts()
    if (local.some((p) => p.id === productId)) {
      deleteLocalProduct(productId)
      return
    }
    throw new Error(
      'Demo seed products cannot be deleted in local mode. Delete only products you added, or connect Supabase.',
    )
  }

  const client = requireClient()

  const { data: images } = await client
    .from('product_images')
    .select('storage_path')
    .eq('product_id', productId)

  const paths = (images ?? [])
    .map((img) => img.storage_path)
    .filter((p): p is string => Boolean(p))

  if (paths.length) {
    await client.storage.from('product-images').remove(paths)
  }

  const { error } = await client.from('products').delete().eq('id', productId)
  if (error) throw new Error(error.message)
}

export async function uploadProductImage(file: File): Promise<{
  url: string
  path: string
}> {
  if (!isSupabaseConfigured || !supabase) {
    const url = await fileToDataUrl(file)
    return { url, path: `local/${file.name}` }
  }

  const client = requireClient()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`

  const { error } = await client.storage.from('product-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (error) throw new Error(error.message)

  const { data } = client.storage.from('product-images').getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function createCategory(input: {
  id: string
  name: string
  description: string
  imageUrl: string
}) {
  if (!isSupabaseConfigured || !supabase) {
    createLocalCategory(input)
    return
  }

  const client = requireClient()
  const { error } = await client.from('categories').insert({
    id: input.id,
    name: input.name,
    description: input.description,
    image_url: input.imageUrl,
    sort_order: 99,
  })
  if (error) throw new Error(error.message)
}
