import { PRESETS } from '@/lib/themes/registry'
import { resolveCSS } from '@/lib/themes/resolve'
import { ComponentGallery } from '@/components/preview/ComponentGallery'
import type { ThemeTokens } from '@/lib/themes/types'

const HSL_RE = /^\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%$/
const RADIUS_RE = /^\d+(\.\d+)?(rem|px|em|%)$/
const FONT_SAFE_RE = /[^a-zA-Z0-9,.' -]/g

function safeHsl(value: string | undefined, fallback: string): string {
  return value && HSL_RE.test(value.trim()) ? value.trim() : fallback
}

function safeRadius(value: string | undefined, fallback: string): string {
  return value && RADIUS_RE.test(value.trim()) ? value.trim() : fallback
}

const COLOR_PARAM_KEYS: (keyof ThemeTokens)[] = [
  'background', 'foreground', 'card', 'cardForeground',
  'popover', 'popoverForeground', 'primary', 'primaryForeground',
  'secondary', 'secondaryForeground', 'muted', 'mutedForeground',
  'accent', 'accentForeground', 'destructive', 'destructiveForeground',
  'border', 'input', 'ring',
  'chart1', 'chart2', 'chart3', 'chart4', 'chart5',
  'sidebarBackground', 'sidebarForeground', 'sidebarPrimary', 'sidebarPrimaryForeground',
  'sidebarAccent', 'sidebarAccentForeground', 'sidebarBorder', 'sidebarRing',
]

interface PreviewPageProps {
  searchParams: Promise<{
    theme?: string
    mode?: string
    radius?: string
    tab?: string
    fontHeading?: string
    fontBody?: string
    fontMono?: string
    shadow?: string
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
  }>
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams
  const themeId = params.theme ?? PRESETS[0].id
  const mode = params.mode === 'dark' ? 'dark' : 'light'
  const activeTab = params.tab ?? 'components'

  const preset = PRESETS.find((p) => p.id === themeId) ?? PRESETS[0]
  const baseTokens: ThemeTokens = mode === 'light' ? preset.light : preset.dark

  const colorPatches: Partial<ThemeTokens> = {}
  for (const key of COLOR_PARAM_KEYS) {
    const val = (params as Record<string, string | undefined>)[key]
    if (val) colorPatches[key] = safeHsl(val, baseTokens[key])
  }

  const tokens: ThemeTokens = {
    ...baseTokens,
    ...colorPatches,
    radius: safeRadius(params.radius, baseTokens.radius),
  }

  const safeFont = (value: string | undefined, fallback: string): string =>
    value ? value.replace(FONT_SAFE_RE, '').trim() || fallback : fallback

  const fonts = {
    heading: safeFont(params.fontHeading, preset.fonts.heading),
    body: safeFont(params.fontBody, preset.fonts.body),
    mono: safeFont(params.fontMono, preset.fonts.mono),
  }
  const mergedPreset = { ...preset, light: tokens, dark: tokens, fonts }
  const css = resolveCSS(mergedPreset, mode, 'v3')

  // Font tokens as CSS custom properties — allows components to use var(--font-body)
  const fontCss = `
    :root {
      --font-body: ${fonts.body};
      --font-heading: ${fonts.heading};
      --font-mono: ${fonts.mono};
    }
    body { font-family: var(--font-body); }
    h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
    code, pre, kbd, samp { font-family: var(--font-mono); }
  `

  const shadowStyle = params.shadow ?? preset.shadowStyle ?? 'none'
  const shadowMap: Record<string, string> = {
    none: 'none',
    flat: '1px 1px 0 hsl(var(--border))',
    soft: '0 2px 8px hsl(var(--foreground) / 0.08)',
    dramatic: '0 8px 24px hsl(var(--foreground) / 0.15)',
    glow: '0 0 16px hsl(var(--primary) / 0.3)',
  }
  const shadowValue = shadowMap[shadowStyle] ?? 'none'
  const shadowCss = `:root { --shadow-preset: ${shadowValue}; }`

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style dangerouslySetInnerHTML={{ __html: fontCss }} />
      <style dangerouslySetInnerHTML={{ __html: shadowCss }} />
      <ComponentGallery activeTab={activeTab} />
    </>
  )
}
