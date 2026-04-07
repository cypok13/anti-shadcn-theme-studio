'use client'

import type { TokenOverrides } from '@/components/tokens/TokenEditor'

interface PreviewFrameProps {
  presetId: string
  mode: 'light' | 'dark'
  overrides?: TokenOverrides
  activeTab?: string
}

export function PreviewFrame({ presetId, mode, overrides, activeTab }: PreviewFrameProps) {
  const params = new URLSearchParams({ theme: presetId, mode })
  if (overrides?.primary) params.set('primary', overrides.primary)
  if (overrides?.secondary) params.set('secondary', overrides.secondary)
  if (overrides?.accent) params.set('accent', overrides.accent)
  if (overrides?.radius) params.set('radius', overrides.radius)
  if (activeTab) params.set('tab', activeTab)

  const src = `/preview?${params.toString()}`
  return (
    <iframe
      src={src}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="Theme preview"
    />
  )
}
