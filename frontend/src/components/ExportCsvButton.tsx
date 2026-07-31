import { useState } from 'react'
import { exportItems } from '../api/items'

interface ExportCsvButtonProps {
  search: string
  status: string
}

export default function ExportCsvButton({ search, status }: ExportCsvButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState('')

  async function handleExport() {
    setIsExporting(true)
    setExportError('')
    try {
      const blob = await exportItems({ search, status })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `items-export-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } }
      if (axiosErr.response?.data instanceof Blob) {
        try {
          const text = await (axiosErr.response.data as Blob).text()
          const parsed = JSON.parse(text) as { error?: string }
          setExportError(parsed.error ?? 'Export failed. Please try again.')
        } catch {
          setExportError('Export failed. Please try again.')
        }
      } else {
        setExportError('Export failed. Please try again.')
      }
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      <button
        data-testid="export-csv-button"
        onClick={handleExport}
        disabled={isExporting}
        className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? 'Exporting...' : 'Export CSV'}
      </button>
      {exportError && (
        <p data-testid="export-csv-error" className="text-red-600 text-xs mt-1">
          {exportError}
        </p>
      )}
    </div>
  )
}
