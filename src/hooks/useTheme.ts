'use client'

import { useQueryState } from 'nuqs'
import { encodeTheme, decodeTheme } from '@/lib/url/codec'

export function useTheme() {
  const [raw, setRaw] = useQueryState('theme', {
    defaultValue: 'concrete-brutalist',
    parse: (v) => decodeTheme(v) ?? 'concrete-brutalist',
    serialize: encodeTheme,
  })

  const [mode, setMode] = useQueryState<'light' | 'dark'>('mode', {
    defaultValue: 'light',
    parse: (v) => (v === 'dark' ? 'dark' : 'light'),
    serialize: (v) => v,
  })

  return {
    presetId: raw,
    setPresetId: setRaw,
    mode,
    setMode,
  }
}
