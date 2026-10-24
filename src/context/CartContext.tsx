import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getEffectivePrice } from '../data/products'
import { readStorage, writeStorage } from '../lib/storage'
import type { CartItem, Product, ProductSize } from '../types'

const CART_KEY = 'just-eight-cart-v2'

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (input: {
    product: Product
    size: ProductSize
    color: string
    quantity?: number
  }) => { ok: boolean; message: string }
  removeItem: (productId: string, size: ProductSize, color: string) => void
  updateQuantity: (
    productId: string,
    size: ProductSize,
    color: string,
    quantity: number,
  ) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

function sameLine(a: CartItem, productId: string, size: ProductSize, color: string) {
  return a.productId === productId && a.size === size && a.color === color
}

function normalizeItems(raw: CartItem[]): CartItem[] {
  return raw.filter(
    (i) =>
      i &&
      typeof i.productId === 'string' &&
      typeof i.unitPrice === 'number' &&
      typeof i.name === 'string',
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() =>
    normalizeItems(readStorage<CartItem[]>(CART_KEY, [])),
  )

  useEffect(() => {
    writeStorage(CART_KEY, items)
  }, [items])

  const addItem = useCallback(
    ({
      product,
      size,
      color,
      quantity = 1,
    }: {
      product: Product
      size: ProductSize
      color: string
      quantity?: number
    }) => {
      if (product.stock <= 0) {
        return { ok: false, message: 'This item is out of stock.' }
      }

      const unitPrice = getEffectivePrice(product)
      let message = 'Added to cart.'

      setItems((prev) => {
        const existing = prev.find((i) => sameLine(i, product.id, size, color))
        const nextQty = (existing?.quantity ?? 0) + quantity
        const line: CartItem = {
          productId: product.id,
          size,
          color,
          quantity: Math.min(nextQty, product.stock),
          unitPrice,
          name: product.name,
          image: product.images[0] ?? '',
          slug: product.slug,
          maxStock: product.stock,
        }

        if (nextQty > product.stock) {
          message = `Only ${product.stock} available in stock.`
        }

        if (existing) {
          return prev.map((i) =>
            sameLine(i, product.id, size, color) ? line : i,
          )
        }
        return [...prev, { ...line, quantity: Math.min(quantity, product.stock) }]
      })

      return { ok: true, message }
    },
    [],
  )

  const removeItem = useCallback(
    (productId: string, size: ProductSize, color: string) => {
      setItems((prev) => prev.filter((i) => !sameLine(i, productId, size, color)))
    },
    [],
  )

  const updateQuantity = useCallback(
    (productId: string, size: ProductSize, color: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, size, color)
        return
      }
      setItems((prev) =>
        prev.map((i) => {
          if (!sameLine(i, productId, size, color)) return i
          return { ...i, quantity: Math.min(quantity, i.maxStock || 99) }
        }),
      )
    },
    [removeItem],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
