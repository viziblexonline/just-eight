import { prepareImageForUpload } from '../lib/imageUpload'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import type {
  Audience,
  Product,
  ProductCategory,
  ProductColor,
  ProductGalleryImage,
  ProductSize,
} from '../types'
import type { DbOrder, DbProduct } from '../types/database'
import { mapProduct } from './mappers'
import {
  createLocalCategory,
  createLocalProduct,
  deleteLocalProduct,
  fileToDataUrl,
  hideLocalCategory,
  hideLocalProduct,
  listHiddenCategoryIds,
  listHiddenProductIds,
  listLocalProducts,
  updateLocalCategory,
  updateLocalProduct,
  upsertLocalProduct,
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
  /** Prefer gallery; imageUrls kept as flat fallback */
  gallery: ProductGalleryImage[]
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
    const hidden = new Set(listHiddenProductIds())
    const local = listLocalProducts().filter((p) => !hidden.has(p.id))
    const localIds = new Set(local.map((p) => p.id))
    const localSlugs = new Set(local.map((p) => p.slug))
    const demos = demoProducts.filter(
      (p) =>
        !hidden.has(p.id) && !localIds.has(p.id) && !localSlugs.has(p.slug),
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
  gallery: ProductGalleryImage[],
  imageUrls: string[] = [],
  imagePaths: (string | null)[] = [],
) {
  const client = requireClient()
  await client.from('product_images').delete().eq('product_id', productId)

  const rows =
    gallery.length > 0
      ? gallery.map((img, index) => ({
          product_id: productId,
          url: img.url,
          storage_path: img.storagePath ?? null,
          sort_order: index,
          alt: '',
          color_name: img.colorName,
        }))
      : imageUrls.map((url, index) => ({
          product_id: productId,
          url,
          storage_path: imagePaths[index] ?? null,
          sort_order: index,
          alt: '',
          color_name: null as string | null,
        }))

  if (!rows.length) return

  const { error } = await client.from('product_images').insert(rows)
  if (error) throw new Error(error.message)
}

export async function createProduct(input: AdminProductInput): Promise<string> {
  if (!isSupabaseConfigured || !supabase) {
    return createLocalProduct({
      ...input,
      gallery: input.gallery,
      imageUrls:
        input.gallery.length > 0
          ? input.gallery.map((g) => g.url)
          : input.imageUrls,
    })
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
  await syncImages(data.id, input.gallery, input.imageUrls, input.imagePaths)
  return data.id as string
}

export async function updateProduct(
  productId: string,
  input: AdminProductInput,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const localInput = {
      ...input,
      gallery: input.gallery,
      imageUrls:
        input.gallery.length > 0
          ? input.gallery.map((g) => g.url)
          : input.imageUrls,
    }
    const local = listLocalProducts()
    if (local.some((p) => p.id === productId)) {
      updateLocalProduct(productId, localInput)
    } else if (demoProducts.some((p) => p.id === productId)) {
      const existing = demoProducts.find((p) => p.id === productId)!
      upsertLocalProduct(productId, localInput, existing.createdAt)
    } else {
      createLocalProduct(localInput)
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
      is_demo: false,
    })
    .eq('id', productId)

  if (error) throw new Error(error.message)

  await syncVariants(productId, input.sizes, input.colors, input.stock)
  await syncImages(productId, input.gallery, input.imageUrls, input.imagePaths)
}

export async function deleteProduct(productId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    const local = listLocalProducts()
    if (local.some((p) => p.id === productId)) {
      deleteLocalProduct(productId)
      return
    }
    if (demoProducts.some((p) => p.id === productId)) {
      hideLocalProduct(productId)
      return
    }
    throw new Error('Product not found.')
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
  const prepared = await prepareImageForUpload(file)

  if (!isSupabaseConfigured || !supabase) {
    const url = await fileToDataUrl(prepared)
    return { url, path: `local/${prepared.name}` }
  }

  const client = requireClient()
  const ext = prepared.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${Date.now()}-${crypto.randomUUID()}.${ext}`

  const { error } = await client.storage
    .from('product-images')
    .upload(path, prepared, {
      cacheControl: '3600',
      upsert: false,
      contentType: prepared.type || 'image/jpeg',
    })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('maximum') || msg.includes('exceeded') || msg.includes('size')) {
      throw new Error(
        'Image is too large for storage. It was compressed automatically — try a smaller photo, or raise the bucket limit in Supabase.',
      )
    }
    throw new Error(error.message)
  }

  const { data } = client.storage.from('product-images').getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function uploadCategoryImage(file: File): Promise<{
  url: string
  path: string
}> {
  const prepared = await prepareImageForUpload(file)

  if (!isSupabaseConfigured || !supabase) {
    const url = await fileToDataUrl(prepared)
    return { url, path: `local/categories/${prepared.name}` }
  }

  const client = requireClient()
  const ext = prepared.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `categories/${Date.now()}-${crypto.randomUUID()}.${ext}`

  const { error } = await client.storage
    .from('product-images')
    .upload(path, prepared, {
      cacheControl: '3600',
      upsert: false,
      contentType: prepared.type || 'image/jpeg',
    })

  if (error) {
    const msg = error.message.toLowerCase()
    if (msg.includes('maximum') || msg.includes('exceeded') || msg.includes('size')) {
      throw new Error(
        'Image is too large for storage. Try another photo, or run the storage size SQL update.',
      )
    }
    throw new Error(error.message)
  }

  const { data } = client.storage.from('product-images').getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export type AdminCategoryInput = {
  id: string
  name: string
  description: string
  imageUrl: string
  sortOrder?: number
}

export async function createCategory(input: AdminCategoryInput) {
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
    sort_order: input.sortOrder ?? 99,
  })
  if (error) throw new Error(error.message)
}

export async function updateCategory(input: AdminCategoryInput) {
  if (!isSupabaseConfigured || !supabase) {
    updateLocalCategory(input)
    return
  }

  const client = requireClient()
  const { error } = await client
    .from('categories')
    .update({
      name: input.name,
      description: input.description,
      image_url: input.imageUrl,
      ...(typeof input.sortOrder === 'number'
        ? { sort_order: input.sortOrder }
        : {}),
    })
    .eq('id', input.id)

  if (error) throw new Error(error.message)
}

export async function deleteCategory(categoryId: string) {
  if (!isSupabaseConfigured || !supabase) {
    hideLocalCategory(categoryId)
    return
  }

  const client = requireClient()
  const { count, error: countError } = await client
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId)

  if (countError) throw new Error(countError.message)
  if ((count ?? 0) > 0) {
    throw new Error(
      'This category still has products. Move or delete those products first.',
    )
  }

  const { error } = await client.from('categories').delete().eq('id', categoryId)
  if (error) throw new Error(error.message)
}

export function isCategoryHiddenLocally(categoryId: string) {
  return listHiddenCategoryIds().includes(categoryId)
}
