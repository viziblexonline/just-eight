export type ProductCategory =
  | 'gloves'
  | 'tracksuits'
  | 't-shirts'
  | 'hoodies'
  | 'jackets'
  | 'sportswear'
  | 'accessories'

export type Audience = 'men' | 'women' | 'kids'

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'One Size'

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  details: string[]
  care: string[]
  price: number
  salePrice?: number
  category: ProductCategory
  audience: Audience
  images: string[]
  sizes: ProductSize[]
  colors: ProductColor[]
  stock: number
  featured?: boolean
  newArrival?: boolean
  bestSeller?: boolean
  popularity: number
  createdAt: string
  /** Demo catalog items — replace when live inventory is connected */
  isDemo: boolean
}

export interface Category {
  id: ProductCategory
  name: string
  description: string
  image: string
}

export interface CartItem {
  productId: string
  quantity: number
  size: ProductSize
  color: string
  /** Snapshot fields so cart works with live Supabase IDs */
  unitPrice: number
  name: string
  image: string
  slug: string
  maxStock: number
}

export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popularity'

export interface CheckoutFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: 'card' | 'cod' | 'bank'
}

export interface OrderSummary {
  id: string
  items: CartItem[]
  form: CheckoutFormData
  subtotal: number
  shipping: number
  total: number
  createdAt: string
}
