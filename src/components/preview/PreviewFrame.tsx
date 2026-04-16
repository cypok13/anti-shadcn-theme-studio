'use client'

import type { TokenOverrides } from '@/components/tokens/TokenEditor'

interface PreviewFrameProps {
  presetId: string
  mode: 'light' | 'dark'
  overrides?: TokenOverrides
  activeTab?: string
  shadowStyle?: string
}

const COLOR_KEYS = [
  'primary', 'secondary', 'accent',
  'background', 'foreground', 'card', 'cardForeground',
  'popover', 'popoverForeground', 'primaryForeground',
  'secondaryForeground', 'muted', 'mutedForeground',
  'accentForeground', 'destructive', 'destructiveForeground',
  'border', 'input', 'ring',
  'chart1', 'chart2', 'chart3', 'chart4', 'chart5',
  'sidebarBackground', 'sidebarForeground', 'sidebarPrimary', 'sidebarPrimaryForeground',
  'sidebarAccent', 'sidebarAccentForeground', 'sidebarBorder', 'sidebarRing',
] as const

type ColorKey = (typeof COLOR_KEYS)[number]

export function PreviewFrame({ presetId, mode, overrides, activeTab, shadowStyle }: PreviewFrameProps) {
  const params = new URLSearchParams({ theme: presetId, mode })

  for (const key of COLOR_KEYS) {
    const val = overrides?.[key as keyof TokenOverrides] as string | undefined
    if (val) params.set(key, val)
  }

  if (overrides?.radius) params.set('radius', overrides.radius)
  if (overrides?.fontHeading) params.set('fontHeading', overrides.fontHeading)
  if (overrides?.fontBody) params.set('fontBody', overrides.fontBody)
  if (overrides?.fontMono) params.set('fontMono', overrides.fontMono)
  if (shadowStyle) params.set('shadow', shadowStyle)
  if (activeTab) params.set('tab', activeTab)

  const src = `/preview?${params.toString()}`
  return (
    <iframe
      key={src}
      src={src}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="Theme preview"
    />
  )
}
