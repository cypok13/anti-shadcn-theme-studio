import type { ThemePreset, ThemeTokens } from './types'

function hslToOklch(hsl: string): string {
  const parts = hsl.trim().split(/\s+/)
  if (parts.length < 3) return `oklch(0.5 0 0)`

  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1]) / 100
  const l = parseFloat(parts[2]) / 100

  const lOklch = 0.2126 + l * 0.7874 * (1 - s * 0.3)
  const c = s * 0.15 * (1 - Math.abs(2 * l - 1))
  const hOklch = h

  return `oklch(${lOklch.toFixed(4)} ${c.toFixed(4)} ${hOklch.toFixed(2)})`
}

function tokensToV3(tokens: ThemeTokens): string {
  return [
    `  --background: ${tokens.background};`,
    `  --foreground: ${tokens.foreground};`,
    `  --card: ${tokens.card};`,
    `  --card-foreground: ${tokens.cardForeground};`,
    `  --popover: ${tokens.popover};`,
    `  --popover-foreground: ${tokens.popoverForeground};`,
    `  --primary: ${tokens.primary};`,
    `  --primary-foreground: ${tokens.primaryForeground};`,
    `  --secondary: ${tokens.secondary};`,
    `  --secondary-foreground: ${tokens.secondaryForeground};`,
    `  --muted: ${tokens.muted};`,
    `  --muted-foreground: ${tokens.mutedForeground};`,
    `  --accent: ${tokens.accent};`,
    `  --accent-foreground: ${tokens.accentForeground};`,
    `  --destructive: ${tokens.destructive};`,
    `  --destructive-foreground: ${tokens.destructiveForeground};`,
    `  --border: ${tokens.border};`,
    `  --input: ${tokens.input};`,
    `  --ring: ${tokens.ring};`,
    `  --radius: ${tokens.radius};`,
    `  --chart-1: ${tokens.chart1};`,
    `  --chart-2: ${tokens.chart2};`,
    `  --chart-3: ${tokens.chart3};`,
    `  --chart-4: ${tokens.chart4};`,
    `  --chart-5: ${tokens.chart5};`,
    `  --sidebar-background: ${tokens.sidebarBackground};`,
    `  --sidebar-foreground: ${tokens.sidebarForeground};`,
    `  --sidebar-primary: ${tokens.sidebarPrimary};`,
    `  --sidebar-primary-foreground: ${tokens.sidebarPrimaryForeground};`,
    `  --sidebar-accent: ${tokens.sidebarAccent};`,
    `  --sidebar-accent-foreground: ${tokens.sidebarAccentForeground};`,
    `  --sidebar-border: ${tokens.sidebarBorder};`,
    `  --sidebar-ring: ${tokens.sidebarRing};`,
  ].join('\n')
}

function tokensToV4(tokens: ThemeTokens): string {
  const colorKeys: (keyof ThemeTokens)[] = [
    'background', 'foreground', 'card', 'cardForeground',
    'popover', 'popoverForeground', 'primary', 'primaryForeground',
    'secondary', 'secondaryForeground', 'muted', 'mutedForeground',
    'accent', 'accentForeground', 'destructive', 'destructiveForeground',
    'border', 'input', 'ring',
    'chart1', 'chart2', 'chart3', 'chart4', 'chart5',
    'sidebarBackground', 'sidebarForeground', 'sidebarPrimary', 'sidebarPrimaryForeground',
    'sidebarAccent', 'sidebarAccentForeground', 'sidebarBorder', 'sidebarRing',
  ]

  const cssName = (key: string): string =>
    key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^chart(\d)$/, 'chart-$1')

  const lines = colorKeys.map((key) => {
    const name = cssName(key as string)
    const oklch = hslToOklch(tokens[key])
    return `  --color-${name}: ${oklch};`
  })

  lines.push(`  --radius: ${tokens.radius};`)

  return lines.join('\n')
}

export function resolveCSS(
  preset: ThemePreset,
  mode: 'light' | 'dark',
  format: 'v3' | 'v4'
): string {
  const tokens = mode === 'light' ? preset.light : preset.dark

  if (format === 'v3') {
    return `:root {\n${tokensToV3(tokens)}\n}`
  }

  return `@theme {\n${tokensToV4(tokens)}\n}`
}
