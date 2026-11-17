import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createProduct,
  fetchAdminProducts,
  updateProduct,
  uploadProductImage,
  type AdminProductInput,
} from '../../services/admin'
import { useCatalog } from '../../context/CatalogContext'
import { getProductGallery } from '../../lib/products'
import type {
  ProductColor,
  ProductGalleryImage,
  ProductSize,
  Audience,
} from '../../types'
import { PRODUCT_COLORS } from '../../data/colors'
import { mapUploadsSequentially } from '../../lib/imageUpload'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const SIZE_OPTIONS: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const DEFAULT_COLORS = PRODUCT_COLORS

const SHARED_KEY = '__shared__'

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

type GalleryBucket = {
  urls: string[]
  paths: (string | null)[]
}

function emptyBucket(): GalleryBucket {
  return { urls: [], paths: [] }
}

export function AdminProductFormPage() {
  const { productId } = useParams()
  const isEdit = Boolean(productId && productId !== 'new')
  const navigate = useNavigate()
  const { categories, refresh } = useCatalog()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [details, setDetails] = useState('')
  const [care, setCare] = useState('')
  const [price, setPrice] = useState('8')
  const [salePrice, setSalePrice] = useState('')
  const [categoryId, setCategoryId] = useState('t-shirts')
  const [audience, setAudience] = useState<Audience>('men')
  const [stock, setStock] = useState('0')
  const [popularity, setPopularity] = useState('50')
  const [featured, setFeatured] = useState(!isEdit)
  const [newArrival, setNewArrival] = useState(!isEdit)
  const [bestSeller, setBestSeller] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [sizes, setSizes] = useState<ProductSize[]>(['S', 'M', 'L'])
  const [colors, setColors] = useState<ProductColor[]>([DEFAULT_COLORS[0]])
  const [galleryByColor, setGalleryByColor] = useState<
    Record<string, GalleryBucket>
  >({ [SHARED_KEY]: emptyBucket() })
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEdit || !productId) return
    async function load() {
      try {
        const products = await fetchAdminProducts()
        const product = products.find((p) => p.id === productId)
        if (!product) {
          setError('Product not found.')
          return
        }
        setName(product.name)
        setSlug(product.slug)
        setDescription(product.description)
        setDetails(product.details.join('\n'))
        setCare(product.care.join('\n'))
        setPrice(String(product.price))
        setSalePrice(
          typeof product.salePrice === 'number' ? String(product.salePrice) : '',
        )
        setCategoryId(product.category)
        setAudience(product.audience ?? 'men')
        setStock(String(product.stock))
        setPopularity(String(product.popularity))
        setFeatured(Boolean(product.featured))
        setNewArrival(Boolean(product.newArrival))
        setBestSeller(Boolean(product.bestSeller))
        setIsActive(true)
        setSizes(product.sizes)
        setColors(product.colors)

        const next: Record<string, GalleryBucket> = {
          [SHARED_KEY]: emptyBucket(),
        }
        for (const color of product.colors) {
          next[color.name] = emptyBucket()
        }
        for (const img of getProductGallery(product)) {
          const key = img.colorName || SHARED_KEY
          if (!next[key]) next[key] = emptyBucket()
          next[key].urls.push(img.url)
          next[key].paths.push(img.storagePath ?? null)
        }
        setGalleryByColor(next)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [isEdit, productId])

  const colorKeys = useMemo(
    () => [SHARED_KEY, ...colors.map((c) => c.name)],
    [colors],
  )

  function toggleSize(size: ProductSize) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  function toggleColor(color: ProductColor) {
    setColors((prev) => {
      const exists = prev.some((c) => c.name === color.name)
      if (exists) {
        setGalleryByColor((gallery) => {
          const next = { ...gallery }
          delete next[color.name]
          return next
        })
        return prev.filter((c) => c.name !== color.name)
      }
      setGalleryByColor((gallery) => ({
        ...gallery,
        [color.name]: gallery[color.name] ?? emptyBucket(),
      }))
      return [...prev, color]
    })
  }

  async function handleUpload(colorKey: string, fileList: FileList | null) {
    if (!fileList?.length) return
    setUploadingKey(colorKey)
    setUploadProgress(`0 / ${fileList.length}`)
    setError(null)
    try {
      const uploaded = await mapUploadsSequentially(
        [...fileList],
        (file) => uploadProductImage(file),
        (done, total) => setUploadProgress(`${done} / ${total}`),
      )
      setGalleryByColor((prev) => {
        const current = prev[colorKey] ?? emptyBucket()
        return {
          ...prev,
          [colorKey]: {
            urls: [...current.urls, ...uploaded.map((u) => u.url)],
            paths: [...current.paths, ...uploaded.map((u) => u.path)],
          },
        }
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploadingKey(null)
      setUploadProgress(null)
    }
  }

  function removeImage(colorKey: string, index: number) {
    setGalleryByColor((prev) => {
      const current = prev[colorKey] ?? emptyBucket()
      return {
        ...prev,
        [colorKey]: {
          urls: current.urls.filter((_, i) => i !== index),
          paths: current.paths.filter((_, i) => i !== index),
        },
      }
    })
  }

  function buildGallery(): ProductGalleryImage[] {
    const gallery: ProductGalleryImage[] = []
    for (const key of colorKeys) {
      const bucket = galleryByColor[key]
      if (!bucket?.urls.length) continue
      bucket.urls.forEach((url, index) => {
        gallery.push({
          url,
          colorName: key === SHARED_KEY ? null : key,
          storagePath: bucket.paths[index] ?? null,
        })
      })
    }
    return gallery
  }

  function buildInput(): AdminProductInput {
    const gallery = buildGallery()
    return {
      name: name.trim(),
      slug: slugify(slug || name),
      description: description.trim(),
      details: details
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
      care: care
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean),
      price: Number(price) || 0,
      salePrice: salePrice ? Number(salePrice) : null,
      categoryId,
      audience,
      stock: Number(stock) || 0,
      featured,
      newArrival,
      bestSeller,
      popularity: Number(popularity) || 0,
      isActive,
      sizes,
      colors,
      gallery,
      imageUrls: gallery.map((g) => g.url),
      imagePaths: gallery.map((g) => g.storagePath ?? null),
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const input = buildInput()
    if (!input.name || !input.slug) {
      setError('Name and slug are required.')
      return
    }
    if (!input.sizes.length || !input.colors.length) {
      setError('Select at least one size and color.')
      return
    }
    if (!input.gallery.length) {
      setError('Upload at least one product image.')
      return
    }
    const missingColor = input.colors.find(
      (color) =>
        !input.gallery.some((img) => img.colorName === color.name) &&
        !input.gallery.some((img) => img.colorName === null),
    )
    if (missingColor) {
      setError(
        `Add photos for “${missingColor.name}” (or upload shared photos for all colors).`,
      )
      return
    }

    setSaving(true)
    try {
      if (isEdit && productId) {
        await updateProduct(productId, input)
      } else {
        await createProduct(input)
      }
      await refresh()
      navigate('/admin/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-mute">Loading product…</p>
  }

  return (
    <div className="max-w-3xl">
      <Link
        to="/admin/products"
        className="text-xs uppercase tracking-[0.14em] text-mute hover:text-ink"
      >
        ← Products
      </Link>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        {isEdit ? 'Edit product' : 'Add product'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Input
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (!isEdit) setSlug(slugify(e.target.value))
          }}
          required
        />
        <Input
          label="Slug"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          required
        />
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-mute">
            Description
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-mute">
            Details (one per line)
          </span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={4}
            className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>
        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-mute">
            Care (one per line)
          </span>
          <textarea
            value={care}
            onChange={(e) => setCare(e.target.value)}
            rows={3}
            className="w-full border border-line px-4 py-3 text-sm outline-none focus:border-ink"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Sale price (optional)"
            type="number"
            min="0"
            step="0.01"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
          <Input
            label="Stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <Input
            label="Popularity"
            type="number"
            min="0"
            value={popularity}
            onChange={(e) => setPopularity(e.target.value)}
          />
        </div>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-mute">
            Category
          </span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-line bg-snow px-4 py-3 text-sm outline-none focus:border-ink"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-xs uppercase tracking-[0.14em] text-mute">
            Who
          </span>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value as Audience)}
            className="w-full border border-line bg-snow px-4 py-3 text-sm outline-none focus:border-ink"
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kids">Kids</option>
          </select>
        </label>

        <fieldset>
          <legend className="text-xs uppercase tracking-[0.14em] text-mute">
            Sizes
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={[
                  'min-w-12 border px-3 py-2 text-xs uppercase',
                  sizes.includes(size)
                    ? 'border-ink bg-ink text-snow'
                    : 'border-line',
                ].join(' ')}
              >
                {size}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-xs uppercase tracking-[0.14em] text-mute">
            Colors
          </legend>
          <p className="mt-2 text-sm text-mute">
            Pick every shade this product comes in — swatches help you match
            photos to the right color.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {DEFAULT_COLORS.map((color) => {
              const active = colors.some((c) => c.name === color.name)
              return (
                <button
                  key={color.name}
                  type="button"
                  title={color.name}
                  onClick={() => toggleColor(color)}
                  className={[
                    'flex items-center gap-2 border px-2.5 py-2 text-left text-xs transition-colors',
                    active
                      ? 'border-accent bg-accent-soft text-ink'
                      : 'border-line hover:border-ink',
                  ].join(' ')}
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded-full border border-line shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="truncate">{color.name}</span>
                </button>
              )
            })}
          </div>
          {colors.length > 0 ? (
            <p className="mt-3 text-xs text-mute">
              Selected: {colors.map((c) => c.name).join(', ')}
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-wrap gap-4 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={newArrival}
              onChange={(e) => setNewArrival(e.target.checked)}
            />
            New arrival
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={bestSeller}
              onChange={(e) => setBestSeller(e.target.checked)}
            />
            Best seller
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Active
          </label>
        </div>

        <div className="space-y-6 border border-line bg-paper/60 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-mute">
              Images by color
            </p>
            <p className="mt-2 text-sm text-mute">
              Upload photos for each color. When a shopper picks that color, those
              photos show. Shared photos are used if a color has none.
            </p>
          </div>

          {colorKeys.map((key) => {
            const label =
              key === SHARED_KEY ? 'Shared (all colors)' : key
            const bucket = galleryByColor[key] ?? emptyBucket()
            const uploading = uploadingKey === key
            return (
              <div key={key} className="border border-line bg-snow p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {key !== SHARED_KEY ? (
                      <span
                        className="h-5 w-5 rounded-full border border-line"
                        style={{
                          backgroundColor:
                            colors.find((c) => c.name === key)?.hex ?? '#ccc',
                        }}
                      />
                    ) : null}
                    <p className="text-sm font-medium">{label}</p>
                  </div>
                  <label className="cursor-pointer text-xs uppercase tracking-[0.14em] underline">
                    {uploading
                      ? `Uploading ${uploadProgress ?? ''}…`
                      : 'Upload from PC'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      multiple
                      className="sr-only"
                      disabled={Boolean(uploadingKey) || saving}
                      onChange={(e) => {
                        void handleUpload(key, e.target.files)
                        e.target.value = ''
                      }}
                    />
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-mute">
                  Large phone photos are compressed automatically before upload.
                </p>
                {bucket.urls.length === 0 ? (
                  <p className="mt-3 text-xs text-mute">No photos yet.</p>
                ) : (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {bucket.urls.map((url, index) => (
                      <div
                        key={`${key}-${url}-${index}`}
                        className="relative aspect-[3/4] bg-mist"
                      >
                        <img
                          src={url}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-1 top-1 bg-ink px-2 py-1 text-[10px] text-snow"
                          onClick={() => removeImage(key, index)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={saving || Boolean(uploadingKey)}>
          {saving ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
        </Button>
      </form>
    </div>
  )
}
