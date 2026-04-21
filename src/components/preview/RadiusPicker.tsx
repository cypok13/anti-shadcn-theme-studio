'use client'

const RADIUS_OPTIONS = [
  { label: 'None',   value: '0rem',    radius: '0px' },
  { label: 'Small',  value: '0.3rem',  radius: '4px' },
  { label: 'Medium', value: '0.5rem',  radius: '8px' },
  { label: 'Large',  value: '0.75rem', radius: '12px' },
  { label: 'Full',   value: '1rem',    radius: '18px' },
]

interface RadiusPickerProps {
  value: string
  onChange: (value: string) => void
}

export function RadiusPicker({ value, onChange }: RadiusPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Border radius">
      {RADIUS_OPTIONS.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.value)}
            className={[
              'flex flex-col items-center gap-1.5 rounded-lg p-2 transition-colors',
              'bg-[hsl(var(--background))]',
              selected
                ? 'border-2 border-[hsl(var(--foreground))]'
                : 'border border-[hsl(var(--border))] hover:border-[hsl(var(--foreground)/0.4)]',
            ].join(' ')}
          >
            <div className="w-8 h-8 flex items-start justify-start">
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: 'hsl(var(--primary)/0.15)',
                  borderTop: '2px solid hsl(var(--primary)/0.6)',
                  borderLeft: '2px solid hsl(var(--primary)/0.6)',
                  borderRight: 'none',
                  borderBottom: 'none',
                  borderTopLeftRadius: opt.radius,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
                }}
              />
            </div>
            <span className="text-[10px] leading-none text-[hsl(var(--muted-foreground))]">
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
