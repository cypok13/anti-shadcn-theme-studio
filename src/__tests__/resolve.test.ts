import { describe, it, expect } from 'vitest'
import { resolveCSS } from '@/lib/themes/resolve'
import { concreteBrutalist } from '@/lib/themes/presets/concrete-brutalist'

const ALL_VARS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'radius',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
]

describe('resolveCSS — v3', () => {
  it('contains :root {', () => {
    const css = resolveCSS(concreteBrutalist, 'light', 'v3')
    expect(css).toContain(':root {')
  })

  it('contains all CSS variables', () => {
    const css = resolveCSS(concreteBrutalist, 'light', 'v3')
    for (const v of ALL_VARS) {
      expect(css, `missing --${v}`).toContain(`--${v}`)
    }
  })

  it('generates dark mode tokens', () => {
    const css = resolveCSS(concreteBrutalist, 'dark', 'v3')
    expect(css).toContain('--background: 0 0% 8%')
  })
})

describe('resolveCSS — v4', () => {
  it('contains @theme {', () => {
    const css = resolveCSS(concreteBrutalist, 'light', 'v4')
    expect(css).toContain('@theme {')
  })

  it('contains all CSS variables as --color- prefixed', () => {
    const css = resolveCSS(concreteBrutalist, 'light', 'v4')
    const colorVars = ALL_VARS.filter((v) => v !== 'radius')
    for (const v of colorVars) {
      expect(css, `missing --color-${v}`).toContain(`--color-${v}`)
    }
  })

  it('contains --radius', () => {
    const css = resolveCSS(concreteBrutalist, 'light', 'v4')
    expect(css).toContain('--radius')
  })
})
