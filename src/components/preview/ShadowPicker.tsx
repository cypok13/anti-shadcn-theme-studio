'use client'

const SHADOW_OPTIONS = [
  { label: 'None',     value: 'none',     shadow: 'none' },
  { label: 'Flat',     value: 'flat',     shadow: '1px 1px 0 hsl(var(--border))' },
  { label: 'Soft',     value: 'soft',     shadow: '0 2px 8px hsl(0 0% 0% / 0.12)' },
  { label: 'Dramatic', value: 'dramatic', shadow: '0 6px 20px hsl(0 0% 0% / 0.22)' },
  { label: 'Glow',     value: 'glow',     shadow: '0 0 14px hsl(var(--primary) / 0.35)' },
]

interface ShadowPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ShadowPicker({ value, onChange }: ShadowPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-label="Shadow style">
      {SHADOW_OPTIONS.map((opt) => {
        const selected = value === opt.value
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={selected}
            aria-label={opt.label}
            onClick={() => onChange(opt.value)}
            className={[
              'flex items-center justify-center rounded-lg transition-colors cursor-pointer overflow-visible',
              'aspect-square w-full',
              'bg-[hsl(var(--background))]',
              selected
                ? 'border-2 border-[hsl(var(--primary))]'
                : 'border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.4)]',
            ].join(' ')}
          >
            <span
              style={{
                display: 'inline-block',
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                background: 'hsl(var(--primary)/0.15)',
                border: '1.5px solid hsl(var(--primary)/0.5)',
                boxShadow: opt.shadow,
              }}
            />
          </button>
        )
      })}
    </div>
  )
}
