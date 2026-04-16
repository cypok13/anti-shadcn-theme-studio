'use client'

import { useState } from 'react'
import { hslStringToHex, hexToHslString } from '@/lib/color/convert'
import { contrastRatio } from '@/lib/color/contrast'
import type { ThemeTokens } from '@/lib/themes/types'

export interface TokenOverrides {
  background?: string
  foreground?: string
  card?: string
  cardForeground?: string
  popover?: string
  popoverForeground?: string
  primary?: string
  primaryForeground?: string
  secondary?: string
  secondaryForeground?: string
  muted?: string
  mutedForeground?: string
  accent?: string
  accentForeground?: string
  destructive?: string
  destructiveForeground?: string
  border?: string
  input?: string
  ring?: string
  chart1?: string
  chart2?: string
  chart3?: string
  chart4?: string
  chart5?: string
  sidebarBackground?: string
  sidebarForeground?: string
  sidebarPrimary?: string
  sidebarPrimaryForeground?: string
  sidebarAccent?: string
  sidebarAccentForeground?: string
  sidebarBorder?: string
  sidebarRing?: string
  radius?: string
  shadowStyle?: 'none' | 'flat' | 'soft' | 'dramatic' | 'glow'
  fontHeading?: string
  fontBody?: string
  fontMono?: string
}

interface TokenEditorProps {
  tokens: ThemeTokens
  presetTokens: ThemeTokens
  overrides: TokenOverrides
  presetFonts: { heading: string; body: string; mono: string }
  onChange: (overrides: TokenOverrides) => void
}

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '16px', '24px']
const SHADOW_OPTIONS = ['none', 'flat', 'soft', 'dramatic', 'glow'] as const

const HEADING_FONTS = [
  { label: 'Preset default', value: '' },
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial Black', value: "'Arial Black', Impact, sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Palatino', value: 'Palatino, serif' },
]
const BODY_FONTS = [
  { label: 'Preset default', value: '' },
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: "'Courier New', monospace" },
]
const MONO_FONTS = [
  { label: 'Preset default', value: '' },
  { label: 'Courier New', value: "'Courier New', monospace" },
  { label: 'Lucida Console', value: "'Lucida Console', monospace" },
  { label: 'Monaco', value: 'Monaco, monospace' },
]

type ColorKey = keyof Omit<ThemeTokens, 'radius'>

interface TokenGroup {
  id: string
  label: string
  keys: ColorKey[]
  syncButton?: boolean
}

const TOKEN_GROUPS: TokenGroup[] = [
  { id: 'base', label: 'BASE', keys: ['background', 'foreground'] },
  { id: 'primary', label: 'PRIMARY', keys: ['primary', 'primaryForeground'] },
  { id: 'secondary', label: 'SECONDARY', keys: ['secondary', 'secondaryForeground'] },
  { id: 'accent', label: 'ACCENT', keys: ['accent', 'accentForeground'] },
  { id: 'muted', label: 'MUTED', keys: ['muted', 'mutedForeground'] },
  { id: 'destructive', label: 'DESTRUCTIVE', keys: ['destructive', 'destructiveForeground'] },
  { id: 'border', label: 'BORDER & INPUT', keys: ['border', 'input', 'ring'] },
  { id: 'card', label: 'CARD', keys: ['card', 'cardForeground', 'popover', 'popoverForeground'] },
  { id: 'chart', label: 'CHART', keys: ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'] },
  {
    id: 'sidebar',
    label: 'SIDEBAR',
    keys: [
      'sidebarBackground', 'sidebarForeground', 'sidebarPrimary', 'sidebarPrimaryForeground',
      'sidebarAccent', 'sidebarAccentForeground', 'sidebarBorder', 'sidebarRing',
    ],
    syncButton: true,
  },
]

const DEFAULT_OPEN = new Set(['base', 'primary', 'secondary', 'accent'])

const LABEL_MAP: Partial<Record<ColorKey, string>> = {
  primaryForeground: 'primary-fg',
  secondaryForeground: 'secondary-fg',
  accentForeground: 'accent-fg',
  mutedForeground: 'muted-fg',
  destructiveForeground: 'destructive-fg',
  cardForeground: 'card-fg',
  popoverForeground: 'popover-fg',
  sidebarBackground: 'sidebar-bg',
  sidebarForeground: 'sidebar-fg',
  sidebarPrimary: 'sidebar-primary',
  sidebarPrimaryForeground: 'sidebar-primary-fg',
  sidebarAccent: 'sidebar-accent',
  sidebarAccentForeground: 'sidebar-accent-fg',
  sidebarBorder: 'sidebar-border',
  sidebarRing: 'sidebar-ring',
  chart1: 'chart-1',
  chart2: 'chart-2',
  chart3: 'chart-3',
  chart4: 'chart-4',
  chart5: 'chart-5',
}

function tokenLabel(key: ColorKey): string {
  return LABEL_MAP[key] ?? key
}

export function TokenEditor({ tokens, presetTokens, overrides, presetFonts, onChange }: TokenEditorProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(DEFAULT_OPEN)

  const primary = overrides.primary ?? tokens.primary
  const ratio = contrastRatio(primary, overrides.primaryForeground ?? tokens.primaryForeground)
  const passesAA = ratio >= 4.5

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const setColor = (key: ColorKey, hex: string) => {
    onChange({ ...overrides, [key]: hexToHslString(hex) })
  }

  const resetToken = (key: ColorKey) => {
    const { [key]: _removed, ...rest } = overrides as Record<string, unknown>
    onChange(rest as TokenOverrides)
  }

  const setRadius = (val: string) => onChange({ ...overrides, radius: val })

  const setShadow = (val: 'none' | 'flat' | 'soft' | 'dramatic' | 'glow') => {
    onChange({ ...overrides, shadowStyle: val })
  }

  const setFont = (key: 'fontHeading' | 'fontBody' | 'fontMono', val: string) => {
    onChange({ ...overrides, [key]: val || undefined })
  }

  const syncSidebar = () => {
    onChange({
      ...overrides,
      sidebarBackground: overrides.background ?? tokens.background,
      sidebarForeground: overrides.foreground ?? tokens.foreground,
      sidebarBorder: overrides.border ?? tokens.border,
      sidebarRing: overrides.ring ?? tokens.ring,
    })
  }

  const currentRadius = overrides.radius ?? tokens.radius
  const currentShadow = overrides.shadowStyle ?? 'none'

  return (
    <div style={{ borderTop: '1px solid hsl(var(--border, 0 0% 20%))' }}>
      <div style={{ padding: '8px 16px 4px', fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Tokens
      </div>

      {/* Color accordion */}
      <div style={{ overflowY: 'auto', maxHeight: '300px' }}>
        {TOKEN_GROUPS.map((group) => {
          const isOpen = openGroups.has(group.id)
          return (
            <div key={group.id} style={{ borderBottom: '1px solid hsl(var(--border, 0 0% 20%))' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 16px', cursor: 'pointer', userSelect: 'none' }}
                onClick={() => toggleGroup(group.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))', letterSpacing: '0.05em' }}>
                    {group.label}
                  </span>
                  {group.syncButton && isOpen && (
                    <button
                      onClick={(e) => { e.stopPropagation(); syncSidebar() }}
                      style={{
                        fontSize: '9px',
                        fontFamily: 'monospace',
                        padding: '1px 5px',
                        background: 'hsl(var(--muted, 0 0% 88%))',
                        color: 'hsl(var(--foreground, 0 0% 5%))',
                        border: '1px solid hsl(var(--border, 0 0% 20%))',
                        borderRadius: '2px',
                        cursor: 'pointer',
                      }}
                    >
                      Sync
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '10px', color: 'hsl(var(--muted-foreground, 0 0% 40%))' }}>
                  {isOpen ? '↑' : '↓'}
                </span>
              </div>

              {isOpen && (
                <div style={{ padding: '4px 16px 8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {group.keys.map((key) => {
                    const hsl = (overrides[key as keyof TokenOverrides] as string | undefined) ?? tokens[key]
                    const hex = hslStringToHex(hsl)
                    const isOverridden = key in overrides
                    const showBadge = key === 'primary'
                    return (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '110px' }}>
                          {tokenLabel(key)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                          {showBadge && (
                            <span style={{
                              fontSize: '9px',
                              fontFamily: 'monospace',
                              padding: '1px 4px',
                              borderRadius: '2px',
                              background: passesAA ? '#16a34a' : '#dc2626',
                              color: '#fff',
                            }}>
                              {passesAA ? 'AA ✓' : 'AA ✗'}
                            </span>
                          )}
                          <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))' }}>
                            {hex}
                          </span>
                          <input
                            type="color"
                            value={hex}
                            onChange={(e) => setColor(key, e.target.value)}
                            style={{ width: '18px', height: '18px', padding: '0', border: '1px solid hsl(var(--border, 0 0% 20%))', borderRadius: '50%', cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
                          />
                          {isOverridden && (
                            <button
                              onClick={() => resetToken(key)}
                              title="Reset to preset"
                              style={{
                                fontSize: '10px',
                                fontFamily: 'monospace',
                                color: 'hsl(var(--muted-foreground, 0 0% 40%))',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0',
                                lineHeight: 1,
                              }}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Structural */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid hsl(var(--border, 0 0% 20%))' }}>
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Structure
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))' }}>Shadow</span>
            <div style={{ display: 'flex', gap: '2px' }}>
              {SHADOW_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setShadow(opt)}
                  style={{
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    padding: '2px 5px',
                    background: currentShadow === opt ? 'hsl(var(--foreground, 0 0% 5%))' : 'hsl(var(--muted, 0 0% 88%))',
                    color: currentShadow === opt ? 'hsl(var(--background, 0 0% 100%))' : 'hsl(var(--foreground, 0 0% 5%))',
                    border: '1px solid hsl(var(--border, 0 0% 20%))',
                    borderRadius: '2px',
                    cursor: 'pointer',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))' }}>Radius</span>
            <select
              value={RADIUS_OPTIONS.includes(currentRadius) ? currentRadius : RADIUS_OPTIONS[0]}
              onChange={(e) => setRadius(e.target.value)}
              style={{
                fontSize: '11px',
                fontFamily: 'monospace',
                background: 'hsl(var(--muted, 0 0% 88%))',
                color: 'hsl(var(--foreground, 0 0% 5%))',
                border: '1px solid hsl(var(--border, 0 0% 20%))',
                borderRadius: '2px',
                padding: '2px 4px',
                cursor: 'pointer',
              }}
            >
              {RADIUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div style={{ padding: '8px 16px', borderTop: '1px solid hsl(var(--border, 0 0% 20%))' }}>
        <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Typography
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <FontRow label="Heading" options={HEADING_FONTS} value={overrides.fontHeading ?? ''} presetDefault={presetFonts.heading} onChange={(val) => setFont('fontHeading', val)} />
          <FontRow label="Body" options={BODY_FONTS} value={overrides.fontBody ?? ''} presetDefault={presetFonts.body} onChange={(val) => setFont('fontBody', val)} />
          <FontRow label="Mono" options={MONO_FONTS} value={overrides.fontMono ?? ''} presetDefault={presetFonts.mono} onChange={(val) => setFont('fontMono', val)} />
        </div>
      </div>
    </div>
  )
}

interface FontRowProps {
  label: string
  options: { label: string; value: string }[]
  value: string
  presetDefault: string
  onChange: (val: string) => void
}

function FontRow({ label, options, onChange }: FontRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))' }}>
        {label}
      </span>
      <select
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: '11px',
          fontFamily: 'monospace',
          background: 'hsl(var(--muted, 0 0% 88%))',
          color: 'hsl(var(--foreground, 0 0% 5%))',
          border: '1px solid hsl(var(--border, 0 0% 20%))',
          borderRadius: '2px',
          padding: '2px 4px',
          cursor: 'pointer',
          maxWidth: '130px',
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
