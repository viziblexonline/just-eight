import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { getEffectivePrice } from '../../data/products'
import { formatPrice } from '../../lib/format'
import { useCatalog } from '../../context/CatalogContext'
import type { Product } from '../../types'

const MAX_RESULTS = 5

function matchesQuery(product: Product, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return (
    product.name.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q) ||
    product.category.toLowerCase().includes(q) ||
    product.audience.toLowerCase().includes(q) ||
    product.colors.some((color) => color.name.toLowerCase().includes(q))
  )
}

export function SearchBox() {
  const navigate = useNavigate()
  const { products, getCategoryName, loading } = useCatalog()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(-1)

  const results = useMemo(() => {
    const trimmed = query.trim()
    if (!trimmed) return []
    return products.filter((product) => matchesQuery(product, trimmed)).slice(0, MAX_RESULTS)
  }, [products, query])

  const showList = open && query.trim().length > 0

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    setActiveIndex(-1)
  }, [query])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function close() {
    setOpen(false)
    setQuery('')
    setActiveIndex(-1)
  }

  function goToShop(value = query) {
    const trimmed = value.trim()
    close()
    navigate(trimmed ? `/shop?q=${encodeURIComponent(trimmed)}` : '/shop')
  }

  function goToProduct(slug: string) {
    close()
    navigate(`/product/${slug}`)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (activeIndex >= 0 && results[activeIndex]) {
      goToProduct(results[activeIndex].slug)
      return
    }
    goToShop()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, -1))
    } else if (event.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault()
      goToProduct(results[activeIndex].slug)
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center text-ink transition-opacity hover:opacity-70"
        aria-label="Search products"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <Search size={20} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-[60] mt-2 w-[min(92vw,20rem)] border border-line bg-snow p-2.5 shadow-lg animate-fade-in">
          <form onSubmit={onSubmit} className="flex items-center gap-2 border border-line px-2.5 py-1.5">
            <Search size={14} className="shrink-0 text-mute" aria-hidden />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search products…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-mute"
              aria-autocomplete="list"
              aria-controls={listId}
              aria-activedescendant={
                activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
              }
              role="combobox"
              aria-expanded={showList}
            />
            <button
              type="button"
              className="grid h-6 w-6 place-items-center text-ink"
              aria-label="Close search"
              onClick={close}
            >
              <X size={14} />
            </button>
          </form>

          {showList ? (
            <div
              id={listId}
              role="listbox"
              aria-label="Search results"
              className="mt-2 max-h-64 overflow-y-auto border border-line"
            >
              {loading ? (
                <p className="px-3 py-3 text-xs text-mute">Loading…</p>
              ) : results.length === 0 ? (
                <div className="px-3 py-3">
                  <p className="text-xs text-ink">No products found</p>
                  <button
                    type="button"
                    className="mt-2 text-[10px] uppercase tracking-[0.14em] text-mute hover:text-ink"
                    onClick={() => goToShop()}
                  >
                    Browse all
                  </button>
                </div>
              ) : (
                <ul>
                  {results.map((product, index) => {
                    const active = index === activeIndex
                    const price = getEffectivePrice(product)
                    return (
                      <li key={product.id} role="option" aria-selected={active}>
                        <button
                          type="button"
                          id={`${listId}-option-${index}`}
                          className={[
                            'flex w-full items-center gap-2.5 px-2.5 py-2 text-left transition-colors',
                            active ? 'bg-mist' : 'hover:bg-paper',
                          ].join(' ')}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => goToProduct(product.slug)}
                        >
                          <img
                            src={product.images[0]}
                            alt=""
                            className="h-10 w-8 shrink-0 bg-mist object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-ink">
                              {product.name}
                            </span>
                            <span className="mt-0.5 block truncate text-[10px] uppercase tracking-[0.12em] text-mute">
                              {getCategoryName(product.category)}
                            </span>
                          </span>
                          <span className="shrink-0 text-xs font-medium">
                            {formatPrice(price)}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}

              {results.length > 0 ? (
                <div className="border-t border-line px-2.5 py-2">
                  <button
                    type="button"
                    className="text-[10px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-ink"
                    onClick={() => goToShop()}
                  >
                    View all results
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
