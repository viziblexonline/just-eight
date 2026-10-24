import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createProduct,
  fetchAdminProducts,
  updateProduct,
  uploadProductImage,
  type AdminProductInput,
} from '../../services/admin'
import { useCatalog } from '../../context/CatalogContext'
import type { ProductColor, ProductSize, Audience } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const SIZE_OPTIONS: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
const DEFAULT_COLORS: ProductColor[] = [
  { name: 'Black', hex: '#0a0a0a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#8a8a8a' },
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
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
  const [price, setPrice] = useState('0')
  const [salePrice, setSalePrice] = useState('')
  const [categoryId, setCategoryId] = useState('t-shirts')
  const [audience, setAudience] = useState<Audience>('men')
  const [stock, setStock] = useState('0')
  const [popularity, setPopularity] = useState('50')
  const [featured, setFeatured] = useState(false)
  const [newArrival, setNewArrival] = useState(false)
  const [bestSeller, setBestSeller] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const [sizes, setSizes] = useState<ProductSize[]>(['S', 'M', 'L'])
  const [colors, setColors] = useState<ProductColor[]>([DEFAULT_COLORS[0]])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imagePaths, setImagePaths] = useState<(string | null)[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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
        setImageUrls(product.images)
        setImagePaths(product.images.map(() => null))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [isEdit, productId])

  function toggleSize(size: ProductSize) {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    )
  }

  function toggleColor(color: ProductColor) {
    setColors((prev) => {
      const exists = prev.some((c) => c.name === color.name)
      return exists
        ? prev.filter((c) => c.name !== color.name)
        : [...prev, color]
    })
  }

  async function handleUpload(fileList: FileList | null) {
    if (!fileList?.length) return
    setUploading(true)
    setError(null)
    try {
      const uploaded = await Promise.all(
        [...fileList].map((file) => uploadProductImage(file)),
      )
      setImageUrls((prev) => [...prev, ...uploaded.map((u) => u.url)])
      setImagePaths((prev) => [...prev, ...uploaded.map((u) => u.path)])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function buildInput(): AdminProductInput {
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
      imageUrls,
      imagePaths,
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
          <div className="mt-3 flex flex-wrap gap-2">
            {DEFAULT_COLORS.map((color) => {
              const active = colors.some((c) => c.name === color.name)
              return (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => toggleColor(color)}
                  className={[
                    'border px-3 py-2 text-xs uppercase',
                    active ? 'border-ink bg-ink text-snow' : 'border-line',
                  ].join(' ')}
                >
                  {color.name}
                </button>
              )
            })}
          </div>
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

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-mute">Images</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="mt-3 block w-full text-sm"
            onChange={(e) => void handleUpload(e.target.files)}
          />
          {uploading ? (
            <p className="mt-2 text-xs text-mute">Uploading…</p>
          ) : null}
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {imageUrls.map((url, index) => (
              <div key={`${url}-${index}`} className="relative aspect-[3/4] bg-mist">
                <img src={url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  className="absolute right-1 top-1 bg-ink px-2 py-1 text-[10px] text-snow"
                  onClick={() => {
                    setImageUrls((prev) => prev.filter((_, i) => i !== index))
                    setImagePaths((prev) => prev.filter((_, i) => i !== index))
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" disabled={saving || uploading}>
          {saving ? 'Saving…' : isEdit ? 'Update product' : 'Create product'}
        </Button>
      </form>
    </div>
  )
}
