import {
  modeOklch,
  modeRgb,
  modeHsl,
  modeP3,
  useMode,
  converter,
  wcagContrast,
  inGamut,
  clampGamut,
  formatHex,
  formatCss,
  parse,
} from 'culori/fn'

useMode(modeOklch)
useMode(modeRgb)
useMode(modeHsl)
useMode(modeP3)

const toOklch = converter('oklch')
const toRgb = converter('rgb')
const toHsl = converter('hsl')

const isInSRGB = inGamut('rgb')
const isInP3 = inGamut('p3')
const clampToSRGB = clampGamut('rgb')

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OklchColor {
  l: number
  c: number
  h: number
  alpha?: number
}

export interface ContrastResult {
  ratio: number
  passes: {
    aa: boolean
    aaLarge: boolean
    aaa: boolean
  }
}

export interface GamutInfo {
  inSRGB: boolean
  inP3: boolean
  clampedToSRGB: OklchColor
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function toCuloriOklch(color: OklchColor) {
  return {
    mode: 'oklch' as const,
    l: clamp(color.l, 0, 1),
    c: clamp(color.c, 0, 0.4),
    h: ((color.h % 360) + 360) % 360,
    ...(color.alpha !== undefined ? { alpha: color.alpha } : {}),
  }
}

function fromCuloriOklch(c: { l?: number; c?: number; h?: number; alpha?: number }): OklchColor {
  return {
    l: c.l ?? 0,
    c: c.c ?? 0,
    h: c.h ?? 0,
    ...(c.alpha !== undefined ? { alpha: c.alpha } : {}),
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function isValidNumber(n: unknown): n is number {
  return typeof n === 'number' && !Number.isNaN(n) && Number.isFinite(n)
}

// ─── Conversions ──────────────────────────────────────────────────────────────

export function oklchFromHsl(h: number, s: number, l: number): OklchColor {
  const result = toOklch({ mode: 'hsl' as const, h, s: s / 100, l: l / 100 })
  if (!result || !isValidNumber(result.l)) return { l: 0, c: 0, h: 0 }
  return fromCuloriOklch(result)
}

export function oklchFromHex(hex: string): OklchColor {
  const parsed = parse(hex)
  if (!parsed) return { l: 0, c: 0, h: 0 }
  const result = toOklch(parsed)
  if (!result || !isValidNumber(result.l)) return { l: 0, c: 0, h: 0 }
  return fromCuloriOklch(result)
}

export function oklchToHex(color: OklchColor): string {
  const rgb = toRgb(toCuloriOklch(color))
  if (!rgb) return '#000000'
  return formatHex(rgb) ?? '#000000'
}

export function oklchToCss(color: OklchColor): string {
  const { l, c, h, alpha } = color
  if (alpha !== undefined && alpha < 1) {
    return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)} / ${alpha.toFixed(3)})`
  }
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`
}

export function oklchToHslString(color: OklchColor): string {
  const hsl = toHsl(toCuloriOklch(color))
  if (!hsl) return '0 0% 0%'
  const h = isValidNumber(hsl.h) ? Math.round(hsl.h) : 0
  const s = isValidNumber(hsl.s) ? Math.round(hsl.s * 100) : 0
  const l = isValidNumber(hsl.l) ? Math.round(hsl.l * 100) : 0
  return `${h} ${s}% ${l}%`
}

// ─── WCAG Contrast ────────────────────────────────────────────────────────────

export function getContrastRatio(fg: OklchColor, bg: OklchColor): number {
  const ratio = wcagContrast(toCuloriOklch(fg), toCuloriOklch(bg))
  return isValidNumber(ratio) ? Math.round(ratio * 100) / 100 : 1
}

export function checkContrast(fg: OklchColor, bg: OklchColor): ContrastResult {
  const ratio = getContrastRatio(fg, bg)
  return {
    ratio,
    passes: {
      aa: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaa: ratio >= 7,
    },
  }
}

// ─── WCAG Auto-Fix (binary search on L channel) ───────────────────────────────

export function fixContrast(
  fg: OklchColor,
  bg: OklchColor,
  targetRatio = 4.5
): OklchColor {
  const current = getContrastRatio(fg, bg)
  if (current >= targetRatio) return fg

  const bgRgb = toRgb(toCuloriOklch(bg))
  // Relative luminance determines direction: dark bg → push fg lighter
  const bgLuminance = bgRgb
    ? bgRgb.r * 0.2126 + bgRgb.g * 0.7152 + bgRgb.b * 0.0722
    : 0.5
  const goLighter = bgLuminance < 0.5

  let lo = goLighter ? fg.l : 0
  let hi = goLighter ? 1 : fg.l
  let best: OklchColor = fg

  // 20 iterations = precision of 2^-20 ≈ 0.000001
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    const candidate: OklchColor = { ...fg, l: mid }

    if (getContrastRatio(candidate, bg) >= targetRatio) {
      best = candidate
      if (goLighter) hi = mid
      else lo = mid
    } else {
      if (goLighter) lo = mid
      else hi = mid
    }
  }

  // Clamp to sRGB if out-of-gamut after L adjustment
  const culori = toCuloriOklch(best)
  if (!isInSRGB(culori)) {
    const clamped = clampToSRGB(culori)
    if (clamped) {
      const clampedOklch = toOklch(clamped)
      if (clampedOklch) return fromCuloriOklch(clampedOklch)
    }
  }

  return best
}

// ─── Gamut ────────────────────────────────────────────────────────────────────

export function getGamutInfo(color: OklchColor): GamutInfo {
  const culori = toCuloriOklch(color)
  const clamped = clampToSRGB(culori)
  const clampedOklch = clamped ? toOklch(clamped) : null

  return {
    inSRGB: isInSRGB(culori),
    inP3: isInP3(culori),
    clampedToSRGB: clampedOklch ? fromCuloriOklch(clampedOklch) : color,
  }
}

// ─── Shadcn semantic pair ─────────────────────────────────────────────────────

export function generateSemanticPair(
  base: OklchColor,
  mode: 'light' | 'dark'
): { background: OklchColor; foreground: OklchColor } {
  const background: OklchColor =
    mode === 'light'
      ? base
      : { ...base, l: clamp(base.l * 0.4, 0.05, 0.3) }

  const initialFg: OklchColor =
    mode === 'light'
      ? { ...base, l: 0.15, c: clamp(base.c * 0.5, 0, 0.15) }
      : { ...base, l: 0.95, c: clamp(base.c * 0.3, 0, 0.1) }

  return {
    background,
    foreground: fixContrast(initialFg, background, 4.5),
  }
}
