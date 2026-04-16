import type { ThemePreset, ThemeTokens } from './types'

const COLOR_KEYS: (keyof ThemeTokens)[] = [
  'background', 'foreground',
  'card', 'cardForeground',
  'popover', 'popoverForeground',
  'primary', 'primaryForeground',
  'secondary', 'secondaryForeground',
  'muted', 'mutedForeground',
  'accent', 'accentForeground',
  'destructive', 'destructiveForeground',
  'border', 'input', 'ring',
  'chart1', 'chart2', 'chart3', 'chart4', 'chart5',
]

function toCssVarName(key: string): string {
  return key
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^chart(\d)$/, 'chart-$1')
}

function hslToOklch(hsl: string): string {
  const parts = hsl.trim().split(/\s+/)
  if (parts.length < 3) return 'oklch(0.5 0 0)'

  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1]) / 100
  const l = parseFloat(parts[2]) / 100

  const lOklch = 0.2126 + l * 0.7874 * (1 - s * 0.3)
  const c = s * 0.15 * (1 - Math.abs(2 * l - 1))

  return `oklch(${lOklch.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`
}

function buildV4Block(tokens: ThemeTokens, indent: string): string {
  const colorLines = COLOR_KEYS.map((key) => {
    const name = toCssVarName(key as string)
    return `${indent}  --${name}: ${hslToOklch(tokens[key])};`
  })
  return colorLines.join('\n')
}

function buildV3ColorsBlock(tokens: ThemeTokens, indent: string): string {
  const grouped: string[] = []

  const simpleTokens: (keyof ThemeTokens)[] = [
    'background', 'foreground', 'border', 'input', 'ring',
  ]
  const pairedTokens: [string, string][] = [
    ['primary', 'primaryForeground'],
    ['secondary', 'secondaryForeground'],
    ['muted', 'mutedForeground'],
    ['accent', 'accentForeground'],
    ['destructive', 'destructiveForeground'],
    ['card', 'cardForeground'],
    ['popover', 'popoverForeground'],
  ]
  const chartTokens = ['chart1', 'chart2', 'chart3', 'chart4', 'chart5'] as const

  for (const key of simpleTokens) {
    const name = toCssVarName(key as string)
    grouped.push(`${indent}  ${name}: "hsl(var(--${name}))",`)
  }

  for (const [base, fg] of pairedTokens) {
    const baseName = toCssVarName(base)
    const fgName = toCssVarName(fg)
    grouped.push(
      `${indent}  ${baseName}: {`,
      `${indent}    DEFAULT: "hsl(var(--${baseName}))",`,
      `${indent}    foreground: "hsl(var(--${fgName}))",`,
      `${indent}  },`,
    )
  }

  for (const key of chartTokens) {
    const name = toCssVarName(key)
    grouped.push(`${indent}  ${name}: "hsl(var(--${name}))",`)
  }

  return grouped.join('\n')
}

/**
 * Tailwind v4 format — intended for globals.css below @import "tailwindcss"
 *
 * Output:
 * @layer base {
 *   :root {
 *     --background: oklch(...);
 *     --radius: 0rem;
 *   }
 *   .dark {
 *     --background: oklch(...);
 *   }
 * }
 */
export function tokensToTailwindV4(preset: ThemePreset): string {
  const lightLines = buildV4Block(preset.light, '  ')
  const darkLines = buildV4Block(preset.dark, '  ')

  return [
    '@layer base {',
    '  :root {',
    lightLines,
    `    --radius: ${preset.radius};`,
    '  }',
    '  .dark {',
    darkLines,
    '  }',
    '}',
  ].join('\n')
}

/**
 * Tailwind v3 format — tailwind.config.js theme.extend block
 *
 * Output:
 * /** @type {import('tailwindcss').Config} *\/
 * module.exports = {
 *   theme: {
 *     extend: {
 *       colors: { ... hsl(var(--token)) references ... },
 *       borderRadius: { lg: "var(--radius)" },
 *     },
 *   },
 * }
 */
export function tokensToTailwindV3(preset: ThemePreset): string {
  const colorsBlock = buildV3ColorsBlock(preset.light, '        ')

  return [
    '/** @type {import(\'tailwindcss\').Config} */',
    'module.exports = {',
    '  theme: {',
    '    extend: {',
    '      colors: {',
    colorsBlock,
    '      },',
    '      borderRadius: {',
    `        lg: "var(--radius)",`,
    `        md: "calc(var(--radius) - 2px)",`,
    `        sm: "calc(var(--radius) - 4px)",`,
    '      },',
    '    },',
    '  },',
    '}',
  ].join('\n')
}
