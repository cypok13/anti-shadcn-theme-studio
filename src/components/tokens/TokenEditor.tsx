'use client'

import { hslStringToHex, hexToHslString } from '@/lib/color/convert'
import { contrastRatio } from '@/lib/color/contrast'

export interface TokenOverrides {
  primary?: string
  secondary?: string
  accent?: string
  radius?: string
}

interface TokenEditorProps {
  primaryForeground: string
  overrides: TokenOverrides
  defaults: { primary: string; secondary: string; accent: string; radius: string }
  onChange: (overrides: TokenOverrides) => void
}

const RADIUS_OPTIONS = ['0px', '4px', '8px', '12px', '16px', '24px']

export function TokenEditor({ primaryForeground, overrides, defaults, onChange }: TokenEditorProps) {
  const primary = overrides.primary ?? defaults.primary
  const secondary = overrides.secondary ?? defaults.secondary
  const accent = overrides.accent ?? defaults.accent
  const radius = overrides.radius ?? defaults.radius

  const ratio = contrastRatio(primary, primaryForeground)
  const passesAA = ratio >= 4.5

  const setColor = (key: 'primary' | 'secondary' | 'accent', hex: string) => {
    onChange({ ...overrides, [key]: hexToHslString(hex) })
  }

  const setRadius = (val: string) => {
    onChange({ ...overrides, radius: val })
  }

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid hsl(var(--border, 0 0% 20%))' }}>
      <div style={{ fontSize: '10px', fontFamily: 'monospace', color: 'hsl(var(--muted-foreground, 0 0% 40%))', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Tokens
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <ColorRow
          label="Primary"
          value={primary}
          badge={passesAA ? 'AA ✓' : 'AA ✗'}
          badgeOk={passesAA}
          onChange={(hex) => setColor('primary', hex)}
        />
        <ColorRow
          label="Secondary"
          value={secondary}
          onChange={(hex) => setColor('secondary', hex)}
        />
        <ColorRow
          label="Accent"
          value={accent}
          onChange={(hex) => setColor('accent', hex)}
        />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))' }}>
            Radius
          </span>
          <select
            value={RADIUS_OPTIONS.includes(radius) ? radius : RADIUS_OPTIONS[0]}
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
  )
}

interface ColorRowProps {
  label: string
  value: string
  badge?: string
  badgeOk?: boolean
  onChange: (hex: string) => void
}

function ColorRow({ label, value, badge, badgeOk, onChange }: ColorRowProps) {
  const hex = hslStringToHex(value)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'hsl(var(--foreground, 0 0% 5%))' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {badge !== undefined && (
          <span style={{
            fontSize: '9px',
            fontFamily: 'monospace',
            padding: '1px 4px',
            borderRadius: '2px',
            background: badgeOk ? '#16a34a' : '#dc2626',
            color: '#fff',
          }}>
            {badge}
          </span>
        )}
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '28px', height: '20px', padding: '1px', border: '1px solid hsl(var(--border, 0 0% 20%))', borderRadius: '2px', cursor: 'pointer', background: 'transparent' }}
        />
      </div>
    </div>
  )
}
