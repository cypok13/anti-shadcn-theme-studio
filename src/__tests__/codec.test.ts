import { describe, it, expect } from 'vitest'
import { encodeTheme, decodeTheme } from '@/lib/url/codec'

describe('codec round-trip', () => {
  it('encodes and decodes concrete-brutalist', () => {
    const encoded = encodeTheme('concrete-brutalist')
    const decoded = decodeTheme(encoded)
    expect(decoded).toBe('concrete-brutalist')
  })

  it('encodes and decodes quiet-tokyo', () => {
    const encoded = encodeTheme('quiet-tokyo')
    const decoded = decodeTheme(encoded)
    expect(decoded).toBe('quiet-tokyo')
  })

  it('returns null for empty string', () => {
    expect(decodeTheme('')).toBeNull()
  })
})
