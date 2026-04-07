function hslToRgbLinear(hsl: string): [number, number, number] {
  const parts = hsl.trim().split(/\s+/)
  const h = parseFloat(parts[0] ?? '0')
  const s = parseFloat(parts[1] ?? '0') / 100
  const l = parseFloat(parts[2] ?? '0') / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))
  }
  return [f(0), f(8), f(4)]
}

function relativeLuminance(r: number, g: number, b: number): number {
  const linearize = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b)
}

export function contrastRatio(hsl1: string, hsl2: string): number {
  const [r1, g1, b1] = hslToRgbLinear(hsl1)
  const [r2, g2, b2] = hslToRgbLinear(hsl2)
  const l1 = relativeLuminance(r1, g1, b1)
  const l2 = relativeLuminance(r2, g2, b2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}
