import type { ThemePreset } from '@/lib/themes/types'

interface PresetCardProps {
  preset: ThemePreset
  isSelected: boolean
  onClick: () => void
}

export function PresetCard({ preset, isSelected, onClick }: PresetCardProps) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left p-3 rounded-[var(--radius)] border transition-all',
        'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]',
        isSelected
          ? 'border-[hsl(var(--primary))] ring-2 ring-[hsl(var(--ring))]'
          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]',
      ].join(' ')}
    >
      <div className="flex gap-1 mb-2">
        <div
          className="w-5 h-5 rounded-sm"
          style={{ background: `hsl(${preset.light.primary})` }}
        />
        <div
          className="w-5 h-5 rounded-sm"
          style={{ background: `hsl(${preset.light.secondary})` }}
        />
        <div
          className="w-5 h-5 rounded-sm"
          style={{ background: `hsl(${preset.light.accent})` }}
        />
        <div
          className="w-5 h-5 rounded-sm border border-[hsl(var(--border))]"
          style={{ background: `hsl(${preset.light.background})` }}
        />
      </div>
      <p className="text-xs font-semibold leading-tight">{preset.name}</p>
      <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-tight">
        {preset.tagline}
      </p>
    </button>
  )
}
