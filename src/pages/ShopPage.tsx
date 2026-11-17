import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, X } from 'lucide-react'
import type { Audience, ProductCategory, SortOption } from '../types'
import { useCatalog } from '../context/CatalogContext'
import { ProductGrid } from '../components/product/ProductGrid'
import { formatPrice } from '../lib/format'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'

const AUDIENCES: { id: Audience; label: string; blurb: string; image: string }[] = [
  {
    id: 'men',
    label: 'Men',
    blurb: 'Essentials with edge — tees, hoodies, and outerwear.',
    image:
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'women',
    label: 'Women',
    blurb: 'Soft power dressing — layers made for every day.',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'kids',
    label: 'Kids',
    blurb: 'Mini cuts of the same wardrobe — soft, simple, ready.',
    image:
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1600&q=80',
  },
]

function readPriceParam(value: string | null) {
  if (value === null || value.trim() === '') return undefined
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : undefined
}

const PAGE_SIZE = 12

export function ShopPage() {
  const {
    products,
    categories,
    filter,
    priceBounds: bounds,
    allSizes,
    allColors,
    loading,
    getCategoryName,
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

  const audienceMeta = AUDIENCES.find((a) => a.id === selectedAudience)

  const selectedCategories = useMemo(() => {
    if (!categoryParam || categoryParam === 'new') return []
    return validCategories.has(categoryParam as ProductCategory)
      ? [categoryParam as ProductCategory]
      : []
  }, [categoryParam, validCategories])

  const audienceProducts = useMemo(() => {
    if (!selectedAudience) return products
    return products.filter((p) => p.audience === selectedAudience)
  }, [products, selectedAudience])

  const audienceCategoryIds = useMemo(() => {
    const counts = new Map<string, number>()
    for (const product of audienceProducts) {
      counts.set(product.category, (counts.get(product.category) ?? 0) + 1)
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([id, count]) => ({
        id,
        name: getCategoryName(id),
        count,
      }))
  }, [audienceProducts, getCategoryName])

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

  function setAudience(nextAudience: Audience | null) {
    const next = new URLSearchParams(params)
    if (!nextAudience) next.delete('audience')
    else next.set('audience', nextAudience)
    next.delete('category')
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
    const next = new URLSearchParams()
    if (selectedAudience) next.set('audience', selectedAudience)
    setParams(next, { replace: true })
  }

  const shown = filtered.slice(0, visible)
  const canLoadMore = visible < filtered.length

  const heading =
    audienceMeta?.label ??
    (categoryParam === 'new'
      ? 'New Arrivals'
      : categories.find((item) => item.id === categoryParam)?.name) ??
    'All Products'
  const priceMin = minPrice ?? bounds.min
  const priceMax = maxPrice ?? bounds.max

  const categoryOptions = selectedAudience
    ? audienceCategoryIds
    : categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: products.filter((p) => p.category === c.id).length,
      }))

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Search
        </p>
        <input
          type="search"
          value={search}
          onChange={(e) => updateParam('q', e.target.value || null)}
          placeholder="Search products"
          className="mt-3 w-full border border-line bg-snow px-3 py-2.5 text-sm outline-none transition-colors focus:border-navy"
        />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Who
        </p>
        <div className="mt-3 space-y-2">
          <FilterCheck
            label="Everyone"
            checked={!selectedAudience}
            onChange={() => setAudience(null)}
          />
          {AUDIENCES.map((audience) => (
            <FilterCheck
              key={audience.id}
              label={audience.label}
              checked={selectedAudience === audience.id}
              onChange={() => setAudience(audience.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Category
          {selectedAudience ? ` · ${audienceMeta?.label}` : ''}
        </p>
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
          {categoryOptions.map((c) => (
            <FilterCheck
              key={c.id}
              label={`${c.name} (${c.count})`}
              checked={categoryParam === c.id}
              onChange={() => updateParam('category', c.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Price
        </p>
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
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Size
        </p>
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
                    ? 'border-navy bg-navy text-accent'
                    : 'border-line hover:border-navy',
                ].join(' ')}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
          Color
        </p>
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

  const emptyTitle = selectedAudience
    ? `No ${audienceMeta?.label.toLowerCase()} pieces yet`
    : 'No products found'
  const emptyDescription = selectedAudience
    ? `This ${audienceMeta?.label.toLowerCase()} edit is ready — add products from Admin and they’ll show here by category.`
    : 'Try adjusting your filters or search terms.'

  return (
    <div className="pb-16 md:pb-24">
      {audienceMeta ? (
        <section className="relative isolate overflow-hidden">
          <img
            src={audienceMeta.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="container-je relative py-16 text-snow md:py-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em]">
              Collection
            </p>
            <h1 className="mt-3 text-4xl font-medium tracking-[0.06em] uppercase md:text-6xl">
              {audienceMeta.label}
            </h1>
            <p className="mt-4 max-w-md text-sm text-white/80 md:text-base">
              {audienceMeta.blurb}
            </p>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-white/60">
              {audienceProducts.length} product
              {audienceProducts.length === 1 ? '' : 's'}
            </p>
          </div>
        </section>
      ) : (
        <div className="container-je pt-10 md:pt-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-mute">
            Shop
          </p>
          <h1 className="mt-2 font-display text-5xl md:text-7xl">{heading}</h1>
        </div>
      )}

      <div className="container-je pt-8 md:pt-10">
        <div className="mb-8 flex flex-wrap gap-2">
          <AudienceChip
            label="All"
            active={!selectedAudience}
            onClick={() => setAudience(null)}
          />
          {AUDIENCES.map((audience) => (
            <AudienceChip
              key={audience.id}
              label={audience.label}
              active={selectedAudience === audience.id}
              onClick={() => setAudience(audience.id)}
            />
          ))}
        </div>

        {(selectedAudience || categoryOptions.length > 0) && (
          <div className="mb-10 overflow-x-auto">
            <div className="flex min-w-max gap-2 pb-1">
              <CategoryChip
                label="All categories"
                active={!categoryParam}
                onClick={() => updateParam('category', null)}
              />
              <CategoryChip
                label="New"
                active={categoryParam === 'new'}
                onClick={() => updateParam('category', 'new')}
              />
              {categoryOptions.map((c) => (
                <CategoryChip
                  key={c.id}
                  label={`${c.name} · ${c.count}`}
                  active={categoryParam === c.id}
                  onClick={() => updateParam('category', c.id)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            {!audienceMeta ? null : (
              <h2 className="font-display text-3xl md:text-4xl">
                {categoryParam && categoryParam !== 'new'
                  ? getCategoryName(categoryParam)
                  : categoryParam === 'new'
                    ? 'New arrivals'
                    : `All ${audienceMeta.label.toLowerCase()}`}
              </h2>
            )}
            <p className="mt-2 text-sm text-mute">
              {filtered.length} product{filtered.length === 1 ? '' : 's'}
              {search ? ` for “${search}”` : ''}
              {selectedAudience && categoryParam && categoryParam !== 'new'
                ? ` · ${getCategoryName(categoryParam)}`
                : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-line bg-snow px-4 py-2.5 text-[11px] uppercase tracking-[0.16em] lg:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter size={16} /> Filters
            </button>
            <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.14em] text-mute">
              Sort
              <select
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="border border-line bg-snow px-3 py-2.5 text-[11px] uppercase tracking-[0.12em] text-ink outline-none"
              >
                <option value="newest">Newest</option>
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-36 border border-line bg-snow/90 p-6 backdrop-blur-sm">
              {filterPanel}
            </div>
          </aside>

          <div>
            {loading ? (
              <p className="py-20 text-center text-[11px] uppercase tracking-[0.2em] text-mute">
                Loading products…
              </p>
            ) : shown.length === 0 ? (
              <EmptyState
                title={emptyTitle}
                description={emptyDescription}
                actionLabel={selectedAudience ? 'Browse all shop' : 'Clear filters'}
                actionTo={selectedAudience ? '/shop' : '/shop'}
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
                      Load more
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,340px)] overflow-y-auto bg-snow p-6 shadow-xl animate-fade-in">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-3xl">Filters</p>
              <button type="button" aria-label="Close" onClick={() => setFiltersOpen(false)}>
                <X size={22} />
              </button>
            </div>
            {filterPanel}
          </div>
        </div>
      ) : null}

      {!selectedAudience ? (
        <div className="container-je mt-16 grid gap-3 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <Link
              key={audience.id}
              to={`/shop?audience=${audience.id}`}
              className="group relative aspect-[16/10] overflow-hidden bg-mist"
            >
              <img
                src={audience.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy-deep/50 transition-colors group-hover:bg-navy-deep/60" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <p className="font-display text-4xl text-snow">{audience.label.toUpperCase()}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-accent">
                  Shop edit →
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function AudienceChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'animate-press border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition-all duration-300',
        active
          ? 'border-navy bg-navy text-accent'
          : 'border-line bg-snow text-ink hover:border-navy',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'animate-press border px-4 py-2 text-[11px] uppercase tracking-[0.14em] transition-all duration-300',
        active
          ? 'border-accent bg-accent-soft text-ink'
          : 'border-line bg-paper text-mute hover:border-navy hover:text-ink',
      ].join(' ')}
    >
      {label}
    </button>
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
