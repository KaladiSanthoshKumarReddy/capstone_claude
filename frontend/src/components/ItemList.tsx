import type { Item } from '../types'
import ItemCard from './ItemCard'

interface Props {
  items: Item[]
  loading: boolean
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, patch: Partial<Pick<Item, 'title' | 'status'>>) => Promise<void>
}

export default function ItemList({ items, loading, onDelete, onUpdate }: Props) {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400" data-testid="items-loading">
        Loading items…
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl"
        data-testid="empty-state">
        <p className="text-lg">No items found</p>
        <p className="text-sm mt-1">Add your first item above or adjust your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2" data-testid="item-list">
      {items.map(item => (
        <ItemCard key={item.id} item={item} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  )
}
