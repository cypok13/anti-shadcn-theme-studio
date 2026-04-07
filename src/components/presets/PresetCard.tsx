'use client'

import { useState } from 'react'
import type { ThemePreset } from '@/lib/themes/types'

interface PresetCardProps {
  preset: ThemePreset
  isSelected: boolean
  onClick: () => void
}

export function PresetCard({ preset, isSelected, onClick }: PresetCardProps) {
  const [hovered, setHovered] = useState(false)

  const borderClass = isSelected
    ? 'border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--ring))]'
    : hovered
      ? 'border-[hsl(var(--primary)/0.5)]'
      : 'border-[hsl(var(--border))]'

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        'w-full text-left p-2.5 rounded-[var(--radius)] border transition-all duration-150 cursor-pointer',
        'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]',
        borderClass,
      ].join(' ')}
    >
      <div className="flex gap-1 mb-2">
        <div
          className="w-4 h-4 rounded-sm"
          style={{ background: `hsl(${preset.light.primary})` }}
        />
        <div
          className="w-4 h-4 rounded-sm"
          style={{ background: `hsl(${preset.light.secondary})` }}
        />
        <div
          className="w-4 h-4 rounded-sm"
          style={{ background: `hsl(${preset.light.accent})` }}
        />
        <div
          className="w-4 h-4 rounded-sm border border-[hsl(var(--border))]"
          style={{ background: `hsl(${preset.light.background})` }}
        />
      </div>

      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0">
          <p className="text-xs font-semibold leading-tight">{preset.name}</p>
          <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5 leading-tight truncate">
            {preset.tagline}
          </p>
        </div>
        {preset.vibe.length > 0 && (
          <div className="flex flex-col gap-0.5 shrink-0">
            {preset.vibe.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] leading-none whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
