export const dynamic = "force-dynamic"

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getPreset } from "@/lib/themes/registry"
import type { RegistryEntry, CssVarsTokens } from "@/types/registry"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

function tokensToVars(tokens: Record<string, string>): CssVarsTokens {
  const CSS_VAR_MAP: Record<string, string> = {
    background: "--background",
    foreground: "--foreground",
    card: "--card",
    cardForeground: "--card-foreground",
    popover: "--popover",
    popoverForeground: "--popover-foreground",
    primary: "--primary",
    primaryForeground: "--primary-foreground",
    secondary: "--secondary",
    secondaryForeground: "--secondary-foreground",
    muted: "--muted",
    mutedForeground: "--muted-foreground",
    accent: "--accent",
    accentForeground: "--accent-foreground",
    destructive: "--destructive",
    destructiveForeground: "--destructive-foreground",
    border: "--border",
    input: "--input",
    ring: "--ring",
    radius: "--radius",
    chart1: "--chart-1",
    chart2: "--chart-2",
    chart3: "--chart-3",
    chart4: "--chart-4",
    chart5: "--chart-5",
  }

  return Object.fromEntries(
    Object.entries(tokens)
      .filter(([key]) => key in CSS_VAR_MAP)
      .map(([key, value]) => [CSS_VAR_MAP[key], value])
  )
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params
  const preset = getPreset(name)

  if (!preset) {
    return NextResponse.json(
      { error: "Theme not found" },
      { status: 404, headers: CORS_HEADERS }
    )
  }

  const entry: RegistryEntry = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: preset.id,
    type: "registry:theme",
    title: preset.name,
    description: preset.tagline,
    author: "Anti-shadcn Theme Studio <https://theme-studio-beta.vercel.app>",
    license: "MIT",
    tags: preset.vibe,
    cssVars: {
      light: tokensToVars(preset.light as unknown as Record<string, string>),
      dark: tokensToVars(preset.dark as unknown as Record<string, string>),
    },
  }

  return NextResponse.json(entry, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
    },
  })
}
