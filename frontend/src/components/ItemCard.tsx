import { useState } from 'react'
import type { Item } from '../types'

interface Props {
  item: Item
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, patch: Partial<Pick<Item, 'title' | 'status'>>) => Promise<void>
}

const STATUS_COLORS: Record<Item['status'], string> = {
  active:    'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  archived:  'bg-gray-100 text-gray-500',
}

export default function ItemCard({ item, onDelete, onUpdate }: Props) {
  const [editing, setEditing]     = useState(false)
  const [editTitle, setEditTitle] = useState(item.title)
  const [busy, setBusy]           = useState(false)

  async function handleToggle() {
    if (item.status === 'archived') return
    setBusy(true)
    try {
      const next = item.status === 'completed' ? 'active' : 'completed'
      await onUpdate(item.id, { status: next })
    } catch {
      setBusy(false)
    }
  }

  async function handleArchive() {
    setBusy(true)
    try {
      await onUpdate(item.id, { status: 'archived' })
    } catch {
      setBusy(false)
    }
  }

  async function handleEditSave() {
    if (!editTitle.trim() || editTitle === item.title) { setEditing(false); return }
    setBusy(true)
    try {
      await onUpdate(item.id, { title: editTitle.trim() })
      setEditing(false)
    } catch {
      setBusy(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${item.title}"?`)) return
    setBusy(true)
    try {
      await onDelete(item.id)
    } catch {
      setBusy(false)
    }
  }

  return (
    <div
      className="bg-white border rounded-xl p-4 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`item-card-${item.id}`}
    >
      <input
        type="checkbox"
        checked={item.status === 'completed'}
        onChange={handleToggle}
        disabled={busy || item.status === 'archived'}
        className="mt-1 h-4 w-4 rounded accent-green-500 cursor-pointer"
        data-testid={`item-toggle-${item.id}`}
        title="Toggle complete"
      />

      <div className="flex-1 min-w-0">
        {editing ? (
          <div className="flex gap-2">
            <input
              autoFocus
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleEditSave(); if (e.key === 'Escape') setEditing(false) }}
              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-testid={`item-edit-input-${item.id}`}
            />
            <button onClick={handleEditSave} className="text-xs text-green-600 hover:underline" data-testid={`item-save-${item.id}`}>Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
          </div>
        ) : (
          <p
            className={`text-sm font-medium truncate cursor-pointer hover:text-blue-600 ${item.status === 'completed' ? 'line-through text-gray-400' : ''}`}
            onClick={() => setEditing(true)}
            data-testid={`item-title-${item.id}`}
            title="Click to edit"
          >
            {item.title}
          </p>
        )}
        {item.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.description}</p>
        )}
        {item.tags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {item.tags.split(',').filter(Boolean).map(t => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                data-testid={`item-tag-${item.id}-${t}`}
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-300 mt-1">
          {item.updated_at
            ? `Updated ${new Date(item.updated_at).toLocaleDateString()}`
            : `Created ${new Date(item.created_at).toLocaleDateString()}`}
        </p>
      </div>

      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_COLORS[item.status]}`}
        data-testid={`item-status-${item.id}`}>
        {item.status}
      </span>

      {item.status !== 'archived' && (
        <button
          onClick={handleArchive}
          disabled={busy}
          className="text-gray-300 hover:text-yellow-500 transition-colors text-xs leading-none disabled:opacity-40"
          data-testid={`item-archive-${item.id}`}
          title="Archive item"
        >
          Archive
        </button>
      )}

      <button
        onClick={handleDelete}
        disabled={busy}
        className="text-gray-300 hover:text-red-500 transition-colors text-lg leading-none disabled:opacity-40"
        data-testid={`item-delete-${item.id}`}
        title="Delete item"
      >
        ×
      </button>
    </div>
  )
}
