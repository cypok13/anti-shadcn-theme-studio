import { describe, it, expect } from 'vitest'
import { generateClaudeMd, generateCursorRules } from '@/lib/themes/ai-rules'
import { concreteBrutalist } from '@/lib/themes/presets/concrete-brutalist'

describe('generateClaudeMd', () => {
  it('contains preset name', () => {
    const md = generateClaudeMd(concreteBrutalist)
    expect(md).toContain(concreteBrutalist.name)
  })

  it('contains all do list items', () => {
    const md = generateClaudeMd(concreteBrutalist)
    for (const item of concreteBrutalist.aiPersonality.doList) {
      expect(md).toContain(item)
    }
  })

  it('contains all dont list items', () => {
    const md = generateClaudeMd(concreteBrutalist)
    for (const item of concreteBrutalist.aiPersonality.dontList) {
      expect(md).toContain(item)
    }
  })

  it('contains CSS variables block', () => {
    const md = generateClaudeMd(concreteBrutalist)
    expect(md).toContain(':root {')
    expect(md).toContain('--primary')
  })
})

describe('generateCursorRules', () => {
  it('contains preset name in header', () => {
    const rules = generateCursorRules(concreteBrutalist)
    expect(rules).toContain(concreteBrutalist.name)
  })

  it('contains tone', () => {
    const rules = generateCursorRules(concreteBrutalist)
    expect(rules).toContain(concreteBrutalist.aiPersonality.tone)
  })
})
