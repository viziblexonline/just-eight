import { useState, type FormEvent } from 'react'
import { useCatalog } from '../../context/CatalogContext'
import { createCategory } from '../../services/admin'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

export function AdminCategoriesPage() {
  const { categories, refresh } = useCatalog()
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)
    try {
      await createCategory({
        id: id.trim().toLowerCase().replace(/\s+/g, '-'),
        name: name.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      })
      setSuccess('Category created.')
      setId('')
      setName('')
      setDescription('')
      setImageUrl('')
      await refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Categories
        </h1>
        <p className="mt-2 text-sm text-mute">
          Existing categories power the storefront filters and shop-by-category
          grid.
        </p>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center gap-4 py-4">
              <img
                src={category.image}
                alt=""
                className="h-14 w-14 object-cover"
              />
              <div>
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-mute">{category.id}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border border-line bg-snow p-6">
        <h2 className="font-display text-xl font-semibold">Add category</h2>
        <Input
          label="ID / slug"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="e.g. caps"
          required
        />
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://..."
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-ink">{success}</p> : null}
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Create category'}
        </Button>
      </form>
    </div>
  )
}
