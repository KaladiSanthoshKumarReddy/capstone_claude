interface Props {
  value: string
  options: string[]
  onChange: (v: string) => void
}

export default function TagFilter({ value, options, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      data-testid="tag-filter"
    >
      <option value="">All Tags</option>
      {options.map(t => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  )
}
