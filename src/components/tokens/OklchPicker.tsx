'use client'

import { useState, useEffect, useId } from 'react'
import {
  oklchFromHsl,
  oklchFromHex,
  oklchToHslString,
  oklchToHex,
  getGamutInfo,
  type OklchColor,
} from '../../../lib/colors/oklch-engine'
import { contrastRatio } from '@/lib/color/contrast'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OklchPickerProps {
  hsl: string
  pairHsl?: string
  label?: string
  onChange: (hsl: string) => void
  onCommit?: (hsl: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseHslToOklch(hsl: string): OklchColor {
  const parts = hsl.trim().split(/\s+/)
  const h = parseFloat(parts[0] ?? '0')
  const s = parseFloat(parts[1] ?? '0')
  const l = parseFloat(parts[2] ?? '0')
  return oklchFromHsl(h, s, l)
}

function shallowEqualOklch(a: OklchColor, b: OklchColor): boolean {
  return (
    Math.abs(a.l - b.l) < 0.0001 &&
    Math.abs(a.c - b.c) < 0.0001 &&
    Math.abs(a.h - b.h) < 0.01
  )
}

function contrastTier(ratio: number): string {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA Large'
  return 'Fail'
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OklchPicker({ hsl, pairHsl, label, onChange, onCommit }: OklchPickerProps) {
  const hexInputId = useId()
  const [oklch, setOklch] = useState<OklchColor>(() => parseHslToOklch(hsl))
  const [hexDraft, setHexDraft] = useState<string>(() => oklchToHex(parseHslToOklch(hsl)))

  // Sync from external hsl prop without creating feedback loops
  useEffect(() => {
    const next = parseHslToOklch(hsl)
    if (!shallowEqualOklch(next, oklch)) {
      setOklch(next)
      setHexDraft(oklchToHex(next))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hsl])

  const currentHex = oklchToHex(oklch)
  const gamut = getGamutInfo(oklch)
  const outOfGamut = !gamut.inSRGB

  const handleSliderChange = (field: 'l' | 'c' | 'h', val: number) => {
    const next: OklchColor = { ...oklch, [field]: val }
    setOklch(next)
    setHexDraft(oklchToHex(next))
    onChange(oklchToHslString(next))
  }

  const handleSliderCommit = (field: 'l' | 'c' | 'h', val: number) => {
    const next: OklchColor = { ...oklch, [field]: val }
    onCommit?.(oklchToHslString(next))
  }

  const handleHexInput = (raw: string) => {
    setHexDraft(raw)
    const clean = raw.replace(/^#/, '')
    if (/^[0-9a-fA-F]{6}$/.test(clean)) {
      const next = oklchFromHex(`#${clean}`)
      setOklch(next)
      onChange(oklchToHslString(next))
    }
  }

  // Contrast ratio (only when pair is supplied)
  const ratio = pairHsl ? Math.round(contrastRatio(hsl, pairHsl) * 100) / 100 : null
  const tier = ratio !== null ? contrastTier(ratio) : null
  const tierPass = tier !== null && tier !== 'Fail'

  const triggerLabel = label ? `Edit color: ${label}` : 'Edit color'

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* 44×44 hit area via padding + ::before overlay */}
        <button
          type="button"
          aria-label={triggerLabel}
          className={[
            'relative flex items-center justify-center',
            'rounded border border-[hsl(var(--border))]',
            'cursor-pointer outline-none',
            'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(var(--background))]',
            'hover:ring-2 hover:ring-[hsl(var(--ring)/0.3)]',
            'active:scale-95',
            // 44×44 hit area via before overlay
            'before:absolute before:inset-[-12px] before:content-[""]',
          ].join(' ')}
          style={{
            // 24×24 visual swatch
            width: '24px',
            height: '24px',
            backgroundColor: currentHex,
            flexShrink: 0,
          }}
        />
      </PopoverTrigger>

      <PopoverContent
        side="left"
        align="center"
        sideOffset={8}
        className="w-56 p-3"
      >
        <div className="flex flex-col gap-2">

          {/* Row 1: swatch preview + hex input */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-6 h-6 rounded border border-[hsl(var(--border))] flex-shrink-0"
              style={{ backgroundColor: currentHex }}
            />
            <label htmlFor={hexInputId} className="sr-only">
              Hex color
            </label>
            <Input
              id={hexInputId}
              size="sm"
              value={hexDraft}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#1a2b3c"
              className="font-mono text-xs"
              spellCheck={false}
            />
          </div>

          {/* Row 2: L slider */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-3 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-center flex-shrink-0"
            >
              L
            </span>
            <Slider
              aria-label="Lightness"
              value={oklch.l}
              min={0}
              max={1}
              step={0.01}
              size="sm"
              onValueChange={(v) => handleSliderChange('l', v)}
              onValueCommit={(v) => handleSliderCommit('l', v)}
            />
            <span className="w-8 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-right tabular-nums flex-shrink-0">
              {oklch.l.toFixed(2)}
            </span>
          </div>

          {/* Row 3: C slider */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-3 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-center flex-shrink-0"
            >
              C
            </span>
            <Slider
              aria-label="Chroma"
              value={oklch.c}
              min={0}
              max={0.4}
              step={0.001}
              size="sm"
              onValueChange={(v) => handleSliderChange('c', v)}
              onValueCommit={(v) => handleSliderCommit('c', v)}
            />
            <span className="w-8 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-right tabular-nums flex-shrink-0">
              {oklch.c.toFixed(3)}
            </span>
          </div>

          {/* Row 4: H slider */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-3 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-center flex-shrink-0"
            >
              H
            </span>
            <Slider
              aria-label="Hue"
              value={oklch.h}
              min={0}
              max={360}
              step={1}
              size="sm"
              onValueChange={(v) => handleSliderChange('h', v)}
              onValueCommit={(v) => handleSliderCommit('h', v)}
            />
            <span className="w-8 text-[10px] font-mono text-[hsl(var(--muted-foreground))] text-right tabular-nums flex-shrink-0">
              {Math.round(oklch.h)}°
            </span>
          </div>

          {/* Row 5: contrast ratio (only if pairHsl provided) */}
          {ratio !== null && tier !== null && (
            <div className="flex items-center justify-between pt-1 border-t border-[hsl(var(--border))]">
              <span className="text-[10px] font-mono text-[hsl(var(--muted-foreground))]">
                contrast
              </span>
              <span
                className={[
                  'text-[10px] font-mono font-medium tabular-nums',
                  tierPass
                    ? 'text-[hsl(var(--foreground))]'
                    : 'text-[hsl(var(--destructive))]',
                ].join(' ')}
              >
                {ratio.toFixed(1)}:1 {tier}
              </span>
            </div>
          )}

          {/* Out-of-gamut warning */}
          {outOfGamut && (
            <div className="text-[10px] font-mono text-[hsl(var(--destructive))] flex items-center gap-1">
              <span aria-hidden="true">⚠</span>
              <span>outside sRGB</span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
