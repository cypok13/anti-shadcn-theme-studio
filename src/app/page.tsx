import { PRESETS } from '@/lib/themes/registry'
import { resolveCSS } from '@/lib/themes/resolve'
import { ComponentGallery } from '@/components/preview/ComponentGallery'
import type { ThemeTokens } from '@/lib/themes/types'

const RADIUS_RE = /^\d+(\.\d+)?(rem|px|em|%)$/
const FONT_SAFE_RE = /[^a-zA-Z0-9,.'() -]/g

function safeRadius(value: string | undefined, fallback: string): string {
  return value && RADIUS_RE.test(value.trim()) ? value.trim() : fallback
}

interface HomePageProps {
  searchParams: Promise<{
    theme?: string
    mode?: string
    radius?: string
    fontHeading?: string
    fontBody?: string
    fontMono?: string
    shadow?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const themeId = params.theme ?? PRESETS[0].id
  const mode = params.mode === 'dark' ? 'dark' : 'light'
  const preset = PRESETS.find((p) => p.id === themeId) ?? PRESETS[0]
  const baseTokens: ThemeTokens = mode === 'light' ? preset.light : preset.dark

  const tokens: ThemeTokens = {
    ...baseTokens,
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
    :root {
      --font-body: ${fonts.body};
      --font-heading: ${fonts.heading};
      --font-mono: ${fonts.mono};
    }
    body { font-family: var(--font-body); }
    h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
    code, pre, kbd, samp { font-family: var(--font-mono); }
  `

  const shikiModeCss = mode === 'dark'
    ? `:root { color-scheme: dark; } .shiki span { color: var(--shiki-dark) !important; } .shiki { color: var(--shiki-dark) !important; }`
    : `:root { color-scheme: light; } .shiki span { color: var(--shiki-light) !important; } .shiki { color: var(--shiki-light) !important; }`

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
      <style dangerouslySetInnerHTML={{ __html: css /* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */ }} />
      <style dangerouslySetInnerHTML={{ __html: fontCss /* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */ }} />
      <style dangerouslySetInnerHTML={{ __html: shadowCss /* nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml */ }} />
      <style dangerouslySetInnerHTML={{ __html: shikiModeCss }} />
      <ComponentGallery />
    </>
  )
}
