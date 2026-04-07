import { describe, it, expect } from 'vitest'
import { hslStringToHex, hexToHslString } from '@/lib/color/convert'
import { contrastRatio } from '@/lib/color/contrast'

describe('hslStringToHex', () => {
  it('converts white HSL to hex', () => {
    expect(hslStringToHex('0 0% 100%')).toBe('#ffffff')
  })

  it('converts black HSL to hex', () => {
    expect(hslStringToHex('0 0% 0%')).toBe('#000000')
  })

  it('converts a color', () => {
    const hex = hslStringToHex('210 40% 98%')
    expect(hex).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe('hexToHslString', () => {
  it('converts white hex to HSL', () => {
    const hsl = hexToHslString('#ffffff')
    expect(hsl).toContain('100%')
  })

  it('converts black hex to HSL', () => {
    const hsl = hexToHslString('#000000')
    expect(hsl).toContain('0%')
  })

  it('returns a valid HSL string format', () => {
    const hsl = hexToHslString('#ff0000')
    const parts = hsl.split(' ')
    expect(parts).toHaveLength(3)
    expect(parts[1]).toMatch(/%$/)
    expect(parts[2]).toMatch(/%$/)
  })
})

describe('roundtrip', () => {
  it('hex → hsl → hex stays close for white', () => {
    const hsl = hexToHslString('#ffffff')
    const hex = hslStringToHex(hsl)
    expect(hex).toBe('#ffffff')
  })

  it('hex → hsl → hex stays close for black', () => {
    const hsl = hexToHslString('#000000')
    const hex = hslStringToHex(hsl)
    expect(hex).toBe('#000000')
  })
})

describe('contrastRatio', () => {
  it('white on black is ~21', () => {
    const ratio = contrastRatio('0 0% 100%', '0 0% 0%')
    expect(ratio).toBeCloseTo(21, 0)
  })

  it('same color has ratio 1', () => {
    const ratio = contrastRatio('210 40% 50%', '210 40% 50%')
    expect(ratio).toBeCloseTo(1, 5)
  })

  it('returns a number >= 1', () => {
    const ratio = contrastRatio('0 0% 5%', '0 0% 100%')
    expect(ratio).toBeGreaterThanOrEqual(1)
  })
})
