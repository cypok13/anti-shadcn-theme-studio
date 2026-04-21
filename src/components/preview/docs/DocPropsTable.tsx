'use client'

interface PropRow {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
}

interface DocPropsTableProps {
  rows: PropRow[]
}

function TypePills({ type }: { type: string }) {
  const parts = type.split(' | ').map((p) => p.trim())
  if (parts.length === 1) {
    return (
      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
        {type}
      </span>
    )
  }
  return (
    <div className="flex flex-wrap gap-1">
      {parts.map((part) => (
        <span
          key={part}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
        >
          {part}
        </span>
      ))}
    </div>
  )
}

export function DocPropsTable({ rows }: DocPropsTableProps) {
  return (
    <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden text-sm">
      <div className="grid grid-cols-[160px_1fr_120px_1fr] gap-4 px-4 py-2 bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))]">
        {['Prop', 'Type', 'Default', 'Description'].map((h) => (
          <span key={h} className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            {h}
          </span>
        ))}
      </div>
      {rows.map((row, i) => (
        <div
          key={row.name}
          className={`grid grid-cols-[160px_1fr_120px_1fr] gap-4 px-4 py-3 ${i < rows.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}
        >
          <div className="flex items-center gap-1.5">
            <code className="text-xs font-mono font-medium text-[hsl(var(--primary))]">{row.name}</code>
            {row.required && (
              <span className="text-xs font-medium px-1 py-0.5 rounded bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] leading-none">req</span>
            )}
          </div>
          <div className="flex items-start pt-0.5">
            <TypePills type={row.type} />
          </div>
          <div className="flex items-center">
            {row.default ? (
              <code className="text-xs font-mono text-[hsl(var(--muted-foreground))]">{row.default}</code>
            ) : (
              <span className="text-xs text-[hsl(var(--muted-foreground)/0.5)]">—</span>
            )}
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed pt-0.5">{row.description}</p>
        </div>
      ))}
    </div>
  )
}
