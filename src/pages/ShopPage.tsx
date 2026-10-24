import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import type { Audience, ProductCategory, SortOption } from '../types'
import { useCatalog } from '../context/CatalogContext'
import { ProductGrid } from '../components/product/ProductGrid'
import { formatPrice } from '../lib/format'
import { Button } from '../components/ui/Button'

import { EmptyState } from '../components/ui/EmptyState'

const AUDIENCES: { id: Audience; label: string }[] = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kids', label: 'Kids' },
]

function readPriceParam(value: string | null) {
  if (value === null || value.trim() === '') return undefined
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : undefined
}

const PAGE_SIZE = 8

export function ShopPage() {
  const {
    categories,
    filter,
    priceBounds: bounds,
    allSizes,
    allColors,
    loading,
  } = useCatalog()
  const validCategories = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories],
  )

  const [params, setParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [filterKey, setFilterKey] = useState('')

  const search = params.get('q') ?? ''
  const categoryParam = params.get('category')
  const audienceParam = params.get('audience')
  const sort = (params.get('sort') as SortOption) || 'newest'
  const minPrice = readPriceParam(params.get('min'))
  const maxPrice = readPriceParam(params.get('max'))
  const selectedSizes = params.getAll('size')
  const selectedColors = params.getAll('color')
  const selectedAudience = AUDIENCES.some((item) => item.id === audienceParam)
    ? (audienceParam as Audience)
    : undefined

  const selectedCategories = useMemo(() => {
    if (!categoryParam || categoryParam === 'new') return []
    return validCategories.has(categoryParam as ProductCategory)
      ? [categoryParam as ProductCategory]
      : []
  }, [categoryParam, validCategories])

  const filtered = useMemo(() => {
    let list = filter({
      search,
      categories: selectedCategories,
      audiences: selectedAudience ? [selectedAudience] : undefined,
      minPrice,
      maxPrice,
      sizes: selectedSizes,
      colors: selectedColors,
      sort,
    })
    if (categoryParam === 'new') {
      list = list.filter((p) => p.newArrival)
    }
    return list
  }, [
    filter,
    search,
    selectedCategories,
    selectedAudience,
    minPrice,
    maxPrice,
    selectedSizes,
    selectedColors,
    sort,
    categoryParam,
  ])

  const currentFilterKey = [
    search,
    categoryParam,
    audienceParam,
    sort,
    minPrice,
    maxPrice,
    selectedSizes.join(','),
    selectedColors.join(','),
  ].join('|')

  const activePage = currentFilterKey === filterKey ? page : 1
  const visible = activePage * PAGE_SIZE

  function updateParam(key: string, value: string | null) {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  function toggleMulti(key: string, value: string) {
    const next = new URLSearchParams(params)
    const current = next.getAll(key)
    next.delete(key)
    const exists = current.includes(value)
    const updated = exists
      ? current.filter((v) => v !== value)
      : [...current, value]
    updated.forEach((v) => next.append(key, v))
    setParams(next, { replace: true })
  }

  function setPriceRange(nextMin: number, nextMax: number) {
    const next = new URLSearchParams(params)
    const low = Math.min(nextMin, nextMax)
    const high = Math.max(nextMin, nextMax)
    if (low <= bounds.min) next.delete('min')
    else next.set('min', String(low))
    if (high >= bounds.max) next.delete('max')
    else next.set('max', String(high))
    setParams(next, { replace: true })
  }

  function clearFilters() {
    setParams({}, { replace: true })
  }

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  const audienceName = AUDIENCES.find((item) => item.id === selectedAudience)?.label
  const categoryName = categories.find((item) => item.id === categoryParam)?.name
  const heading =
    audienceName ??
    (categoryParam === 'new' ? 'New Arrivals' : categoryName) ??
    'All Products'
  const priceMin = minPrice ?? bounds.min
  const priceMax = maxPrice ?? bounds.max

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Search</p>
        <input
          type="search"
          value={search}
          onChange={(e) => updateParam('q', e.target.value || null)}
          placeholder="Search products"
          className="mt-3 w-full border border-line bg-snow px-3 py-2.5 text-sm outline-none focus:border-ink"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Who</p>
        <div className="mt-3 space-y-2">
          <FilterCheck
            label="Everyone"
            checked={!selectedAudience}
            onChange={() => updateParam('audience', null)}
          />
          {AUDIENCES.map((audience) => (
            <FilterCheck
              key={audience.id}
              label={audience.label}
              checked={selectedAudience === audience.id}
              onChange={() => updateParam('audience', audience.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Category</p>
        <div className="mt-3 space-y-2">
          <FilterCheck
            label="All"
            checked={!categoryParam}
            onChange={() => updateParam('category', null)}
          />
          <FilterCheck
            label="New Arrivals"
            checked={categoryParam === 'new'}
            onChange={() => updateParam('category', 'new')}
          />
          {categories.map((c) => (
            <FilterCheck
              key={c.id}
              label={c.name}
              checked={categoryParam === c.id}
              onChange={() => updateParam('category', c.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Price</p>
        <p className="mt-3 text-sm">
          {formatPrice(priceMin)} – {formatPrice(priceMax)}
        </p>
        <PriceRange
          min={bounds.min}
          max={bounds.max}
          valueMin={priceMin}
          valueMax={priceMax}
          onChange={setPriceRange}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: 'Under $50', min: bounds.min, max: 50 },
            { label: '$50–$100', min: 50, max: 100 },
            { label: '$100–$150', min: 100, max: 150 },
            { label: '$150+', min: 150, max: bounds.max },
          ].map((preset) => {
            const active =
              priceMin === Math.max(bounds.min, preset.min) &&
              priceMax === Math.min(bounds.max, preset.max) &&
              (minPrice !== undefined || maxPrice !== undefined)
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setPriceRange(
                    Math.max(bounds.min, preset.min),
                    Math.min(bounds.max, preset.max),
                  )
                }
                className={[
                  'border px-3 py-1.5 text-xs',
                  active ? 'border-ink bg-ink text-snow' : 'border-line hover:border-ink',
                ].join(' ')}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {allSizes.map((size) => {
            const active = selectedSizes.includes(size)
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleMulti('size', size)}
                className={[
                  'min-w-10 border px-3 py-2 text-xs uppercase tracking-wider transition-colors',
                  active
                    ? 'border-ink bg-ink text-snow'
                    : 'border-line hover:border-ink',
                ].join(' ')}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-mute">Color</p>
        <div className="mt-3 space-y-2">
          {allColors.map((color) => (
            <FilterCheck
              key={color}
              label={color}
              checked={selectedColors.includes(color)}
              onChange={() => toggleMulti('color', color)}
            />
          ))}
        </div>
      </div>

      <Button variant="ghost" fullWidth onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  )

  return (
    <div className="container-je py-10 md:py-14">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-mute">Shop</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            {heading}
          </h1>
          <p className="mt-3 text-sm text-mute">
            {filtered.length} product{filtered.length === 1 ? '' : 's'}
            {search ? ` for “${search}”` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 border border-line px-4 py-2.5 text-xs uppercase tracking-[0.16em] lg:hidden"
            onClick={() => setFiltersOpen(true)}
          >
            <Filter size={16} /> Filters
          </button>
          <label className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-mute">
            Sort
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-line bg-snow px-3 py-2.5 text-xs uppercase tracking-[0.12em] text-ink outline-none"
            >
              <option value="newest">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          {loading ? (
            <p className="py-20 text-center text-sm text-mute">
              Loading products…
            </p>
          ) : shown.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search terms."
              actionLabel="Clear filters"
              actionTo="/shop"
            />
          ) : (
            <>
              <ProductGrid products={shown} />
              {canLoadMore ? (
                <div className="mt-14 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentFilterKey !== filterKey) {
                        setFilterKey(currentFilterKey)
                        setPage(2)
                      } else {
                        setPage((p) => p + 1)
                      }
                    }}
                  >
                    Load More
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,340px)] overflow-y-auto bg-snow p-6 shadow-xl animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-xl font-semibold">Filters</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setFiltersOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function PriceRange({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
}: {
  min: number
  max: number
  valueMin: number
  valueMax: number
  onChange: (min: number, max: number) => void
}) {
  const span = Math.max(max - min, 1)
  const left = ((valueMin - min) / span) * 100
  const right = ((valueMax - min) / span) * 100
  const disabled = max <= min

  return (
    <div className="price-range relative mt-4 h-8">
      <div className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-line" />
      <div
        className="absolute top-1/2 h-px -translate-y-1/2 bg-ink"
        style={{ left: `${left}%`, width: `${Math.max(right - left, 0)}%` }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valueMin}
        disabled={disabled}
        aria-label="Minimum price"
        style={{ zIndex: valueMin > max - span * 0.12 ? 5 : 2 }}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange(Math.min(next, valueMax), valueMax)
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={valueMax}
        disabled={disabled}
        aria-label="Maximum price"
        style={{ zIndex: 3 }}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange(valueMin, Math.max(next, valueMin))
        }}
      />
    </div>
  )
}

function FilterCheck({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-ink"
      />
      <span>{label}</span>
    </label>
  )
}
