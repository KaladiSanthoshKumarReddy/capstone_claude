import { useState } from 'react'

interface Props {
  onAdd: (title: string, description: string, tags: string) => Promise<void>
}

export default function ItemForm({ onAdd }: Props) {
  const [title, setTitle]       = useState('')
  const [desc, setDesc]         = useState('')
  const [tags, setTags]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    setError('')
    try {
      await onAdd(title.trim(), desc.trim(), tags.trim())
      setTitle('')
      setDesc('')
      setTags('')
    } catch {
      setError('Failed to add item.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-4 mb-6 space-y-3">
      <h2 className="font-semibold text-gray-700">Add New Item</h2>
      {error && <p className="text-red-500 text-sm" data-testid="form-error">{error}</p>}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Title *"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          data-testid="item-title-input"
          required
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          data-testid="item-desc-input"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated, optional)"
          value={tags}
          onChange={e => setTags(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          data-testid="item-tags-input"
        />
        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap"
          data-testid="add-item-button"
        >
          {loading ? 'Adding…' : '+ Add Item'}
        </button>
      </div>
    </form>
  )
}
