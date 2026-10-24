export interface DbCategory {
  id: string
  name: string
  description: string
  image_url: string
  sort_order: number
}

export interface DbProduct {
  id: string
  slug: string
  name: string
  description: string
  details: string[] | unknown
  care: string[] | unknown
  price: number | string
  sale_price: number | string | null
  category_id: string
  stock: number
  featured: boolean
  new_arrival: boolean
  best_seller: boolean
  popularity: number
  is_active: boolean
  is_demo: boolean
  created_at: string
  product_images?: DbProductImage[]
  product_variants?: DbProductVariant[]
}

export interface DbProductImage {
  id: string
  product_id: string
  url: string
  storage_path: string | null
  alt: string
  sort_order: number
}

export interface DbProductVariant {
  id: string
  product_id: string
  size: string
  color_name: string
  color_hex: string
  sku: string | null
  stock: number
}

export interface DbOrder {
  id: string
  order_number: string
  user_id: string | null
  status: string
  customer_name: string
  email: string
  phone: string
  address: string
  city: string
  postal_code: string
  payment_method: string
  subtotal: number | string
  shipping_cost: number | string
  total: number | string
  created_at: string
}
