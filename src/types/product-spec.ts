/**
 * Theme Studio — Product Spec TypeScript Interfaces
 * Day 12 artifact. Created 2026-04-14.
 *
 * These interfaces define the data contracts for Phase 1-5 implementation.
 * Source: docs/product-spec.md
 *
 * Dependencies:
 *   - TokenOverrides v2: extends ThemeTokens (src/lib/themes/types.ts) with OKLCH
 *   - StructuralPreset: from Day 10 CSS mapping (docs/research/day10-structural-mutation.md)
 *   - GalleryEntry: social gallery schema for Phase 4
 *   - RegistryExport: shadcn registry format, extends RegistryEntry (src/types/registry.ts)
 */

// ─────────────────────────────────────────────────────────────
// TokenOverrides v2
// ─────────────────────────────────────────────────────────────

/**
 * OKLCH color representation.
 * Perceptually uniform color space (CIE 2006).
 * Used by Tailwind v4 and modern CSS Color Level 4.
 *
 * Range: lightness 0–1, chroma 0–0.4, hue 0–360
 */
export interface OklchColor {
  /** Lightness: 0 (black) → 1 (white) */
  lightness: number
  /** Chroma: 0 (gray) → ~0.4 (vivid). Actual max is gamut-dependent. */
  chroma: number
  /** Hue angle in degrees: 0–360 */
  hue: number
}

/**
 * A single token entry with both HSL (legacy) and OKLCH representations.
 * HSL is the storage format (shadcn-compatible bare triples "210 40% 98%").
 * OKLCH is computed on the fly via culori for export and color picker.
 */
export interface TokenValue {
  /** Bare HSL triple without hsl() wrapper. e.g. "210 40% 98%" */
  hsl: string
  /** OKLCH representation for color picker and v4 export. */
  oklch?: OklchColor
}

/**
 * TokenOverrides v2 — all shadcn/ui semantic color tokens + OKLCH support.
 *
 * Extends v1 (ThemeTokens) by:
 * 1. Wrapping each color field in TokenValue (hsl + oklch) instead of bare string
 * 2. Separating light/dark mode into explicit fields
 * 3. Adding radius as a first-class field
 *
 * shadcn/ui token reference: https://ui.shadcn.com/docs/theming
 */
export interface TokenOverridesV2 {
  // ── Color tokens (light mode) ──────────────────────────────
  light: {
    background: TokenValue
    foreground: TokenValue
    card: TokenValue
    cardForeground: TokenValue
    popover: TokenValue
    popoverForeground: TokenValue
    primary: TokenValue
    primaryForeground: TokenValue
    secondary: TokenValue
    secondaryForeground: TokenValue
    muted: TokenValue
    mutedForeground: TokenValue
    accent: TokenValue
    accentForeground: TokenValue
    destructive: TokenValue
    destructiveForeground: TokenValue
    border: TokenValue
    input: TokenValue
    ring: TokenValue
    /** Chart palette — optional, defaults to shadcn preset */
    chart1?: TokenValue
    chart2?: TokenValue
    chart3?: TokenValue
    chart4?: TokenValue
    chart5?: TokenValue
  }

  // ── Color tokens (dark mode) ───────────────────────────────
  dark: {
    background: TokenValue
    foreground: TokenValue
    card: TokenValue
    cardForeground: TokenValue
    popover: TokenValue
    popoverForeground: TokenValue
    primary: TokenValue
    primaryForeground: TokenValue
    secondary: TokenValue
    secondaryForeground: TokenValue
    muted: TokenValue
    mutedForeground: TokenValue
    accent: TokenValue
    accentForeground: TokenValue
    destructive: TokenValue
    destructiveForeground: TokenValue
    border: TokenValue
    input: TokenValue
    ring: TokenValue
    chart1?: TokenValue
    chart2?: TokenValue
    chart3?: TokenValue
    chart4?: TokenValue
    chart5?: TokenValue
  }

  // ── Shape tokens (mode-independent) ───────────────────────
  /** Base border-radius. e.g. "0.5rem". Applied via CSS --radius custom property. */
  radius: string

  // ── Typography tokens (optional, Phase 2+) ────────────────
  fonts?: {
    /** Google Fonts family name for headings. e.g. "Inter" */
    heading?: string
    /** Google Fonts family name for body. e.g. "Inter" */
    body?: string
    /** Monospace family. e.g. "JetBrains Mono" */
    mono?: string
  }
}

// ─────────────────────────────────────────────────────────────
// StructuralPreset
// ─────────────────────────────────────────────────────────────

/**
 * The four structural preset IDs.
 * Defines the visual "feel" (shape/depth/texture) independently from color.
 *
 * Source: Day 10 CSS mapping (docs/research/day10-structural-mutation.md)
 */
export type StructuralPresetId =
  | 'default'
  | 'flat'
  | 'neo-brutalism'
  | 'glassmorphism'

/**
 * CSS variable overrides that define a structural preset.
 * Applied on top of TokenOverridesV2 to control shape, depth, and spacing.
 *
 * Variable semantics:
 *   --radius           → base border-radius (propagates to sm/md/lg via calc())
 *   --shadow-sm        → small component shadow (inputs, buttons)
 *   --shadow-md        → medium component shadow (cards, dropdowns)
 *   --border-width     → border thickness
 *   --border-color     → border color (if preset overrides theme color, e.g. neo-brutalism #000)
 *   --backdrop-filter  → CSS backdrop-filter (glassmorphism only)
 *   --bg-alpha         → background opacity as decimal (glassmorphism only)
 *   --spacing-component → base component padding
 */
export interface StructuralPreset {
  /** Unique identifier */
  id: StructuralPresetId

  /** Display name shown in the UI preset picker */
  label: string

  /** One-line description shown as tooltip */
  description: string

  /**
   * CSS custom property values.
   * Applied to :root on the preview iframe via postMessage UPDATE_TOKENS.
   */
  cssVars: {
    radius: string
    'shadow-sm': string
    'shadow-md': string
    'border-width': string
    /** Optional: overrides the theme border color (neo-brutalism always uses #000) */
    'border-color'?: string
    /** Glassmorphism: CSS backdrop-filter value */
    'backdrop-filter'?: string
    /** Glassmorphism: background opacity as string decimal "0.25" */
    'bg-alpha'?: string
    'spacing-component': string
  }

  /**
   * UI warnings and constraints.
   * Shown to the user when selecting this preset.
   */
  constraints?: {
    /** Glassmorphism: requires non-solid background to be visible */
    requiresImageBackground?: boolean
    /** Neo-brutalism: shadow is always this color, regardless of theme */
    fixedShadowColor?: string
    /** WCAG contrast warning */
    contrastNote?: string
  }
}

/** Ordered list of structural preset IDs (UI display order) */
export const STRUCTURAL_PRESET_IDS: StructuralPresetId[] = [
  'default',
  'flat',
  'neo-brutalism',
  'glassmorphism',
]

// ─────────────────────────────────────────────────────────────
// GalleryEntry
// ─────────────────────────────────────────────────────────────

/**
 * A single entry in the social theme gallery (Phase 4).
 *
 * Themes are stored as GitHub Gists — the gistId is the primary key.
 * The full TokenOverridesV2 is stored in the gist; GalleryEntry is metadata only.
 *
 * Invariants:
 *   - gistId is always a valid GitHub Gist ID (alphanumeric, 32 chars)
 *   - title.length is 1–60 characters
 *   - stats.views and stats.copies are non-negative integers
 */
export interface GalleryEntry {
  /** GitHub Gist ID. Primary key. Used to reconstruct the shareable URL. */
  gistId: string

  /** Human-readable theme name. Max 60 chars. */
  title: string

  /**
   * Color preset ID from ThemePreset registry.
   * References src/lib/themes/registry.ts presets.
   */
  preset: string

  /**
   * Structural preset applied on top of the color preset.
   * null = default structural preset.
   */
  structuralPreset: StructuralPresetId | null

  /**
   * User's color token modifications on top of the base preset.
   * Only delta from the base preset is stored (not the full token set).
   * Stored in gist as full TokenOverridesV2 for self-contained export.
   */
  overrides: Partial<TokenOverridesV2>

  /** GitHub username of the creator. */
  author: string

  /** ISO 8601 creation timestamp. */
  createdAt: string

  /**
   * Descriptive tags for discovery.
   * Max 5 tags, each 1–20 chars, lowercase kebab-case.
   * e.g. ["dark-mode", "minimal", "neo-brutalism"]
   */
  tags: string[]

  /** Engagement metrics. Updated by the backend (Phase 4). */
  stats: {
    /** Number of times the theme page was viewed */
    views: number
    /** Number of times "Copy to clipboard" was clicked */
    copies: number
  }

  /**
   * Tailwind version this theme was exported for.
   * Determines which export format was used by the creator.
   */
  exportedFor?: 'v3' | 'v4'
}

// ─────────────────────────────────────────────────────────────
// RegistryExport
// ─────────────────────────────────────────────────────────────

/**
 * Theme Studio's output format for shadcn CLI install.
 *
 * Extends the shadcn registry:theme format with structural preset data.
 * Compatible with: `npx shadcn@latest add https://theme-studio-beta.vercel.app/r/[name]`
 *
 * shadcn registry spec: https://ui.shadcn.com/docs/registry/registry-item-json
 *
 * Key invariants:
 *   - type is always "registry:theme"
 *   - cssVars.light and cssVars.dark must both be present for complete themes
 *   - structural is undefined for the Default preset (baseline shadcn)
 */
export interface RegistryExport {
  /** shadcn registry schema URL */
  $schema: "https://ui.shadcn.com/schema/registry-item.json"

  /** URL-safe theme slug. Used as the filename: /r/[name].json */
  name: string

  /** Always "registry:theme" for Theme Studio exports */
  type: "registry:theme"

  /** Human-readable theme title */
  title: string

  /** One-line description of the theme */
  description: string

  /** Creator's GitHub username */
  author?: string

  /** Discovery tags */
  tags?: string[]

  /**
   * Core CSS custom property values.
   * Keys are CSS variable names without the '--' prefix.
   * Values are bare HSL triples "h s% l%" (shadcn format).
   *
   * Consumed by shadcn CLI to generate :root { ... } and .dark { ... } blocks.
   */
  cssVars: {
    light: Record<string, string>
    dark: Record<string, string>
  }

  /**
   * Structural preset overrides.
   * Undefined when the Default structural preset is used.
   *
   * When present, these CSS vars are applied in addition to cssVars.
   * The consuming app must apply them to :root manually (shadcn CLI ignores extra keys).
   */
  structural?: {
    preset: StructuralPresetId
    cssVars: StructuralPreset['cssVars']
  }

  /**
   * Tailwind version this export targets.
   * Determines whether the consumer should use globals.css or tailwind.config.js approach.
   * Included as meta for documentation purposes — shadcn CLI does not use this field.
   */
  meta?: {
    tailwindVersion: 'v3' | 'v4'
    /** Theme Studio version that generated this export */
    generatedBy: string
    /** Link to the theme gallery page */
    galleryUrl?: string
  }
}
