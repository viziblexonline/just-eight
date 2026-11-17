import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { readStorage, writeStorage } from '../lib/storage'

const WISHLIST_KEY = 'just-eight-wishlist-v1'

interface WishlistContextValue {
  ids: string[]
  count: number
  has: (productId: string) => boolean
  toggle: (productId: string) => void
  remove: (productId: string) => void
  clear: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    readStorage<string[]>(WISHLIST_KEY, []).filter((id) => typeof id === 'string'),
  )

  useEffect(() => {
    writeStorage(WISHLIST_KEY, ids)
  }, [ids])

  const has = useCallback((productId: string) => ids.includes(productId), [ids])

  const toggle = useCallback((productId: string) => {
    setIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    )
  }, [])

  const remove = useCallback((productId: string) => {
    setIds((prev) => prev.filter((id) => id !== productId))
  }, [])

  const clear = useCallback(() => setIds([]), [])

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has,
      toggle,
      remove,
      clear,
    }),
    [ids, has, toggle, remove, clear],
  )

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
