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

interface PreviewPageProps {
  searchParams: Promise<{
    theme?: string
    mode?: string
    primary?: string
    secondary?: string
    accent?: string
    radius?: string
    tab?: string
    fontHeading?: string
    fontBody?: string
    fontMono?: string
  }>
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams
  const themeId = params.theme ?? PRESETS[0].id
  const mode = params.mode === 'dark' ? 'dark' : 'light'
  const activeTab = params.tab ?? 'components'

  const preset = PRESETS.find((p) => p.id === themeId) ?? PRESETS[0]
  const baseTokens: ThemeTokens = mode === 'light' ? preset.light : preset.dark

  const tokens: ThemeTokens = {
    ...baseTokens,
    primary: safeHsl(params.primary, baseTokens.primary),
    secondary: safeHsl(params.secondary, baseTokens.secondary),
    accent: safeHsl(params.accent, baseTokens.accent),
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

  const fontCss = `
    body, * { font-family: ${fonts.body}; }
    h1, h2, h3, h4, h5, h6 { font-family: ${fonts.heading}; }
    code, pre, kbd, samp { font-family: ${fonts.mono}; }
  `

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style dangerouslySetInnerHTML={{ __html: fontCss }} />
      <ComponentGallery activeTab={activeTab} />
    </>
  )
}
