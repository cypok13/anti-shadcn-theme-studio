import type { ThemePreset } from '@/lib/themes/types'
import { PresetCard } from './PresetCard'

interface PresetGridProps {
  presets: ThemePreset[]
  selectedId: string
  onSelect: (id: string) => void
}

export function PresetGrid({ presets, selectedId, onSelect }: PresetGridProps) {
  return (
    <div className="flex flex-col gap-2 p-3">
      {presets.map((preset) => (
        <PresetCard
          key={preset.id}
          preset={preset}
          isSelected={preset.id === selectedId}
          onClick={() => onSelect(preset.id)}
        />
      ))}
    </div>
  )
}
