interface Props {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: Props) {
  if (totalPages <= 1) return null
  const from = (page - 1) * limit + 1
  const to   = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between mt-4" data-testid="pagination">
      <span className="text-sm text-gray-500">
        Showing {from}–{to} of {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40"
          data-testid="prev-page"
        >
          ← Prev
        </button>
        <span className="text-sm text-gray-600" data-testid="page-indicator">
          {page} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-40"
          data-testid="next-page"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
