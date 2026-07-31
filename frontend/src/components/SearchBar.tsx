import { useEffect, useState } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  useEffect(() => {
    if (local === value) return
    const t = setTimeout(() => onChange(local), 300)
    return () => clearTimeout(t)
  }, [local, value, onChange])

  return (
    <input
      type="search"
      placeholder="Search items…"
      value={local}
      onChange={e => setLocal(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-400"
      data-testid="search-input"
    />
  )
}
