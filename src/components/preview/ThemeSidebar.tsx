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
import { ShadowPicker } from './ShadowPicker'
import { ExportTrigger } from './ExportTrigger'

const HEADING_OPTIONS = [
  { label: 'Inter',         value: 'var(--font-sans)' },
  { label: 'Geist Sans',    value: 'var(--font-geist-sans)' },
  { label: 'Space Grotesk', value: 'var(--font-grotesk)' },
  { label: 'Syne',          value: 'var(--font-syne)' },
]

const BODY_OPTIONS = [
  { label: 'Inter',         value: 'var(--font-sans)' },
  { label: 'DM Sans',       value: 'var(--font-dm)' },
  { label: 'Manrope',       value: 'var(--font-manrope)' },
  { label: 'IBM Plex Sans', value: 'var(--font-ibm-plex-sans)' },
  { label: 'Geist Sans',    value: 'var(--font-geist-sans)' },
]

const MONO_OPTIONS = [
  { label: 'JetBrains Mono', value: 'var(--font-jetbrains-mono)' },
  { label: 'Geist Mono',     value: 'var(--font-geist-mono)' },
  { label: 'IBM Plex Mono',  value: 'var(--font-ibm-plex-mono)' },
  { label: 'Fira Code',      value: 'var(--font-fira-code)' },
]

const labelClass =
  'text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-2'

export function ThemeSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTheme  = searchParams.get('theme')  ?? PRESETS[0].id
  const currentMode   = searchParams.get('mode')   ?? 'light'
  const currentRadius = searchParams.get('radius') ?? '0.5rem'
  const currentShadow = searchParams.get('shadow') ?? 'none'

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
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-md overflow-y-auto max-h-[calc(100vh-64px)] p-4 space-y-4">

      {/* Theme preset */}
      <section>
        <p className={labelClass}>Theme</p>
        <div className="flex flex-col gap-0.5">
          {PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={currentTheme === preset.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setParam('theme', preset.id)}
              className="w-full justify-start gap-2 h-8 text-xs"
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
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

      {/* Radius */}
      <section>
        <p className={labelClass}>Radius</p>
        <RadiusPicker value={currentRadius} onChange={(v) => setParam('radius', v)} />
      </section>

      <Separator />

      {/* Shadow */}
      <section>
        <p className={labelClass}>Shadow</p>
        <ShadowPicker value={currentShadow} onChange={(v) => setParam('shadow', v)} />
      </section>

      <Separator />

      {/* Typography */}
      <section>
        <p className={labelClass}>Typography</p>
        <div className="space-y-1.5">
          {([
            { key: 'fontHeading', label: 'Heading', value: currentFontHeading, options: HEADING_OPTIONS },
            { key: 'fontBody',    label: 'Body',    value: currentFontBody,    options: BODY_OPTIONS },
            { key: 'fontMono',    label: 'Mono',    value: currentFontMono,    options: MONO_OPTIONS },
          ] as const).map(({ key, label, value, options }) => (
            <div key={key} className="flex items-center gap-2">
              <span className="text-xs text-[hsl(var(--muted-foreground))] w-12 shrink-0">{label}</span>
              <div className="flex-1 min-w-0">
                <Select value={value} onValueChange={(v) => setParam(key, v)}>
                  <SelectTrigger size="sm" aria-label={`${label} font`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Export */}
      <ExportTrigger />

      {/* Copy Theme */}
      <Button variant="secondary" size="sm" className="w-full" onClick={handleCopy}>
        Copy Theme URL
      </Button>

      {/* GitHub */}
      <a
        href="https://github.com/cypok13/anti-shadcn-theme-studio"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors pb-1"
      >
        ↗ GitHub
      </a>

    </div>
  )
}
