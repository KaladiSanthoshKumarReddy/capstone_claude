import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ItemForm from '../components/ItemForm'
import ItemList from '../components/ItemList'
import SearchBar from '../components/SearchBar'
import StatusFilter from '../components/StatusFilter'
import TagFilter from '../components/TagFilter'
import ExportCsvButton from '../components/ExportCsvButton'
import Pagination from '../components/Pagination'
import { fetchItems, createItem, updateItem, deleteItem } from '../api/items'
import type { Item, PaginationMeta, ItemStatus } from '../types'

const LIMIT = 10

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [items, setItems]     = useState<Item[]>([])
  const [meta, setMeta]       = useState<PaginationMeta>({ total: 0, page: 1, limit: LIMIT, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const search = searchParams.get('search') ?? ''
  const status = (searchParams.get('status') ?? 'all') as ItemStatus
  const tag    = searchParams.get('tag') ?? ''
  const page   = parseInt(searchParams.get('page') ?? '1')

  function updateParams(patch: Record<string, string>) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      Object.entries(patch).forEach(([k, v]) => {
        if (!v || (k === 'page' && v === '1')) {
          next.delete(k)
        } else {
          next.set(k, v)
        }
      })
      return next
    }, { replace: true })
  }

  const loadItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetchItems({
        page,
        limit: LIMIT,
        search: search || undefined,
        status: status !== 'all' ? status : undefined,
        tag: tag || undefined,
      })
      setItems(res.data as unknown as Item[])
      setMeta(res.meta)
    } catch {
      setError('Failed to load items.')
    } finally {
      setLoading(false)
    }
  }, [page, search, status, tag])

  useEffect(() => { loadItems() }, [loadItems])

  const tagOptions = Array.from(
    new Set(items.flatMap(i => (i.tags ?? '').split(',').filter(Boolean)))
  ).sort()

  async function handleAdd(title: string, description: string, tags: string) {
    await createItem(title, description || undefined, tags || undefined)
    updateParams({ page: '1' })
    await loadItems()
  }

  async function handleDelete(id: number) {
    await deleteItem(id)
    await loadItems()
  }

  async function handleUpdate(id: number, patch: Partial<Pick<Item, 'title' | 'status'>>) {
    await updateItem(id, patch)
    await loadItems()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800" data-testid="dashboard-heading">
            My Items
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {meta.total} item{meta.total !== 1 ? 's' : ''} total
          </p>
        </div>

        <ItemForm onAdd={handleAdd} />

        <div className="flex gap-3 mb-4 flex-wrap">
          <SearchBar
            value={search}
            onChange={v => updateParams({ search: v, page: '' })}
          />
          <StatusFilter
            value={status}
            onChange={v => updateParams({ status: v, page: '' })}
          />
          <TagFilter
            value={tag}
            options={tagOptions}
            onChange={v => updateParams({ tag: v, page: '' })}
          />
          <ExportCsvButton search={search} status={status} />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-3" data-testid="list-error">{error}</p>
        )}

        <ItemList
          items={items}
          loading={loading}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={p => updateParams({ page: String(p) })}
        />
      </main>
    </div>
  )
}
