import { useState, type FormEvent } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import {
  createCategory,
  deleteCategory,
  updateCategory,
  uploadCategoryImage,
} from '../../services/admin'
import type { Category } from '../../types'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const emptyForm = {
  id: '',
  name: '',
  description: '',
  imageUrl: '',
}

export function AdminCategoriesPage() {
  const { categories, refresh } = useCatalog()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const isEditing = Boolean(editingId)

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setError(null)
    setSuccess(null)
  }

  function startEdit(category: Category) {
    setEditingId(category.id)
    setForm({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.image,
    })
    setError(null)
    setSuccess(null)
  }

  async function handleImageUpload(fileList: FileList | null) {
    const file = fileList?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const uploaded = await uploadCategoryImage(file)
      setForm((prev) => ({ ...prev, imageUrl: uploaded.url }))
      setSuccess('Image uploaded. Save the category to apply it.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      const payload = {
        id: form.id.trim().toLowerCase().replace(/\s+/g, '-'),
        name: form.name.trim(),
        description: form.description.trim(),
        imageUrl: form.imageUrl.trim(),
      }
      if (!payload.id || !payload.name) {
        throw new Error('ID and name are required.')
      }
      if (!payload.imageUrl) {
        throw new Error('Upload a category image from your PC.')
      }

      if (isEditing && editingId) {
        await updateCategory({ ...payload, id: editingId })
        setSuccess('Category updated. Storefront will use the new values.')
      } else {
        await createCategory(payload)
        setSuccess('Category created.')
        setForm(emptyForm)
        setEditingId(null)
      }
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save category')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(category: Category) {
    if (
      !window.confirm(
        `Delete “${category.name}”? Default/seed categories can also be removed. Products using this category must be moved first.`,
      )
    ) {
      return
    }
    setBusyId(category.id)
    setError(null)
    setSuccess(null)
    try {
      await deleteCategory(category.id)
      if (editingId === category.id) startCreate()
      setSuccess(`Deleted “${category.name}”.`)
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Categories
        </h1>
        <p className="mt-2 text-sm text-mute">
          Edit default seed categories or add new ones. Upload images directly
          from your PC — no image URL needed.
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-wrap items-center gap-4 py-4"
            >
              <img
                src={category.image}
                alt=""
                className="h-14 w-14 object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-mute">{category.id}</p>
                <p className="mt-1 line-clamp-2 text-xs text-mute">
                  {category.description}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => startEdit(category)}
                  className="text-xs uppercase tracking-[0.12em] underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={busyId === category.id}
                  onClick={() => void handleDelete(category)}
                  className="text-xs uppercase tracking-[0.12em] text-red-600 underline disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 border border-line bg-snow p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold">
            {isEditing ? 'Edit category' : 'Add category'}
          </h2>
          {isEditing ? (
            <button
              type="button"
              onClick={startCreate}
              className="text-xs uppercase tracking-[0.12em] text-mute underline"
            >
              New instead
            </button>
          ) : null}
        </div>

        <Input
          label="ID / slug"
          value={form.id}
          onChange={(e) => setForm((prev) => ({ ...prev, id: e.target.value }))}
          placeholder="e.g. caps"
          required
          disabled={isEditing}
        />
        {isEditing ? (
          <p className="text-xs text-mute">
            Category ID stays the same so existing products keep working.
          </p>
        ) : null}
        <Input
          label="Name"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Input
          label="Description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />

        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mute">
            Category image
          </p>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-line bg-paper px-4 py-8 text-center transition-colors hover:border-accent">
            <span className="text-sm font-medium text-ink">
              {uploading ? 'Uploading…' : 'Choose image from PC'}
            </span>
            <span className="text-xs text-mute">
              JPG, PNG, WebP, or GIF — max 5MB
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="sr-only"
              disabled={uploading || saving}
              onChange={(e) => {
                void handleImageUpload(e.target.files)
                e.target.value = ''
              }}
            />
          </label>
          {form.imageUrl ? (
            <div className="relative overflow-hidden bg-mist">
              <img
                src={form.imageUrl}
                alt="Category preview"
                className="h-40 w-full object-cover"
              />
              <button
                type="button"
                className="absolute right-2 top-2 bg-ink/80 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-snow"
                onClick={() => setForm((prev) => ({ ...prev, imageUrl: '' }))}
              >
                Remove
              </button>
            </div>
          ) : (
            <p className="text-xs text-mute">No image selected yet.</p>
          )}
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-ink">{success}</p> : null}
        <Button type="submit" disabled={saving || uploading}>
          {saving
            ? 'Saving…'
            : isEditing
              ? 'Save category changes'
              : 'Create category'}
        </Button>
      </form>
    </div>
  )
}
