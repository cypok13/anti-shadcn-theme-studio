'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'
import { PRESETS } from '@/lib/themes/registry'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../ui/select'
import { RadiusPicker } from './RadiusPicker'

const HEADING_OPTIONS = [
  { label: 'Inter',         value: 'var(--font-sans)' },
  { label: 'Space Grotesk', value: 'var(--font-grotesk)' },
  { label: 'Syne',          value: 'var(--font-syne)' },
]

const BODY_OPTIONS = [
  { label: 'Inter',         value: 'var(--font-sans)' },
  { label: 'DM Sans',       value: 'var(--font-dm)' },
  { label: 'Manrope',       value: 'var(--font-manrope)' },
  { label: 'IBM Plex Sans', value: 'var(--font-ibm-plex-sans)' },
]

const MONO_OPTIONS = [
  { label: 'JetBrains Mono', value: 'var(--font-jetbrains-mono)' },
  { label: 'IBM Plex Mono',  value: 'var(--font-ibm-plex-mono)' },
  { label: 'Fira Code',      value: 'var(--font-fira-code)' },
]

const labelClass =
  'text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3'

export function ThemeSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTheme  = searchParams.get('theme')  ?? PRESETS[0].id
  const currentMode   = searchParams.get('mode')   ?? 'light'
  const currentRadius = searchParams.get('radius') ?? '0.5rem'

  const currentPreset      = PRESETS.find((p) => p.id === currentTheme) ?? PRESETS[0]
  const currentFontHeading = searchParams.get('fontHeading') ?? currentPreset.fonts.heading
  const currentFontBody    = searchParams.get('fontBody')    ?? currentPreset.fonts.body
  const currentFontMono    = searchParams.get('fontMono')    ?? currentPreset.fonts.mono

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
  }, [])

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-md p-5 space-y-6">

      {/* Theme preset — button list */}
      <section>
        <p className={labelClass}>Theme</p>
        <div className="flex flex-col gap-1">
          {PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={currentTheme === preset.id ? 'default' : 'ghost'}
              onClick={() => setParam('theme', preset.id)}
              className="w-full justify-start gap-2"
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: `hsl(${preset.light.primary})` }}
                aria-hidden="true"
              />
              {preset.name}
            </Button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Appearance */}
      <section>
        <p className={labelClass}>Appearance</p>
        <div className="flex gap-2">
          {(['light', 'dark'] as const).map((mode) => (
            <Button
              key={mode}
              variant={currentMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setParam('mode', mode)}
              className="flex-1 capitalize gap-1.5"
            >
              {mode === 'light'
                ? <Sun  className="size-3.5" aria-hidden="true" />
                : <Moon className="size-3.5" aria-hidden="true" />}
              {mode}
            </Button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Radius — visual picker */}
      <section>
        <p className={labelClass}>Radius</p>
        <RadiusPicker value={currentRadius} onChange={(v) => setParam('radius', v)} />
      </section>

      <Separator />

      {/* Typography — 3 DS Selects */}
      <section>
        <p className={labelClass}>Typography</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))] w-14 shrink-0">Heading</span>
            <div className="flex-1 min-w-0">
              <Select value={currentFontHeading} onValueChange={(v) => setParam('fontHeading', v)}>
                <SelectTrigger size="sm" aria-label="Heading font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HEADING_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))] w-14 shrink-0">Body</span>
            <div className="flex-1 min-w-0">
              <Select value={currentFontBody} onValueChange={(v) => setParam('fontBody', v)}>
                <SelectTrigger size="sm" aria-label="Body font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BODY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[hsl(var(--muted-foreground))] w-14 shrink-0">Mono</span>
            <div className="flex-1 min-w-0">
              <Select value={currentFontMono} onValueChange={(v) => setParam('fontMono', v)}>
                <SelectTrigger size="sm" aria-label="Mono font">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONO_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Copy Theme */}
      <Button variant="secondary" className="w-full" onClick={handleCopy}>
        Copy Theme URL
      </Button>

    </div>
  )
}
