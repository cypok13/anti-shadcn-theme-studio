import { PRESETS } from '@/lib/themes/registry'
import { resolveCSS } from '@/lib/themes/resolve'
import { ComponentGallery } from '@/components/preview/ComponentGallery'
import type { ThemeTokens } from '@/lib/themes/types'

interface PreviewPageProps {
  searchParams: Promise<{
    theme?: string
    mode?: string
    primary?: string
    secondary?: string
    accent?: string
    radius?: string
    tab?: string
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
    ...(params.primary ? { primary: params.primary } : {}),
    ...(params.secondary ? { secondary: params.secondary } : {}),
    ...(params.accent ? { accent: params.accent } : {}),
    ...(params.radius ? { radius: params.radius } : {}),
  }

  const mergedPreset = { ...preset, light: tokens, dark: tokens }
  // css is generated server-side from our own resolveCSS — no user input involved
  const css = resolveCSS(mergedPreset, mode, 'v3')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <ComponentGallery activeTab={activeTab} />
    </>
  )
}
