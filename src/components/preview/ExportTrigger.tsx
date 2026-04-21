'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { PRESETS } from '@/lib/themes/registry'
import { Button } from '../ui/button'
import { ExportModal } from '../export/ExportModal'

export function ExportTrigger() {
  const [isOpen, setIsOpen] = useState(false)
  const searchParams = useSearchParams()

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const themeId = searchParams.get('theme') ?? PRESETS[0].id
  const mode = searchParams.get('mode') === 'dark' ? 'dark' : 'light'
  const radius = searchParams.get('radius')
  const fontHeading = searchParams.get('fontHeading')
  const fontBody = searchParams.get('fontBody')
  const fontMono = searchParams.get('fontMono')

  const basePreset = PRESETS.find((p) => p.id === themeId) ?? PRESETS[0]

  const preset = {
    ...basePreset,
    fonts: {
      heading: fontHeading ?? basePreset.fonts.heading,
      body: fontBody ?? basePreset.fonts.body,
      mono: fontMono ?? basePreset.fonts.mono,
    },
    light: radius ? { ...basePreset.light, radius } : basePreset.light,
    dark: radius ? { ...basePreset.dark, radius } : basePreset.dark,
  }

  return (
    <>
      <Button variant="outline" className="w-full" onClick={open}>
        Export
      </Button>
      <ExportModal
        preset={preset}
        mode={mode}
        overrides={{}}
        isOpen={isOpen}
        onClose={close}
      />
    </>
  )
}
