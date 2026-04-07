'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ThemePreset, ThemeTokens } from '@/lib/themes/types'
import type { TokenOverrides } from '@/components/tokens/TokenEditor'
import { resolveCSS } from '@/lib/themes/resolve'
import { generateClaudeMd, generateCursorRules } from '@/lib/themes/ai-rules'

type Tab = 'css' | 'claude' | 'cursor' | 'cli'
type CSSFormat = 'v3' | 'v4'

export interface ExportModalProps {
  preset: ThemePreset
  mode: 'light' | 'dark'
  overrides?: TokenOverrides
  isOpen: boolean
  onClose: () => void
}

function applyOverrides(preset: ThemePreset, overrides: TokenOverrides): ThemePreset {
  if (!overrides || Object.keys(overrides).length === 0) return preset
  const patch = (tokens: ThemeTokens): ThemeTokens => ({
    ...tokens,
    ...(overrides.primary ? { primary: overrides.primary } : {}),
    ...(overrides.secondary ? { secondary: overrides.secondary } : {}),
    ...(overrides.accent ? { accent: overrides.accent } : {}),
    ...(overrides.radius ? { radius: overrides.radius } : {}),
  })
  return { ...preset, light: patch(preset.light), dark: patch(preset.dark) }
}

export function ExportModal({ preset, mode, overrides = {}, isOpen, onClose }: ExportModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('css')
  const [cssFormat, setCSSFormat] = useState<CSSFormat>('v3')
  const [copied, setCopied] = useState(false)

  const effectivePreset = applyOverrides(preset, overrides)

  const getContent = useCallback((): string => {
    if (activeTab === 'css') return resolveCSS(effectivePreset, mode, cssFormat)
    if (activeTab === 'claude') return generateClaudeMd(effectivePreset)
    if (activeTab === 'cursor') return generateCursorRules(effectivePreset)
    return `npx shadcn@latest add https://themestudio.vercel.app/r/themes/${preset.id}`
  }, [activeTab, effectivePreset, preset.id, mode, cssFormat])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }, [getContent])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const tabs: { id: Tab; label: string }[] = [
    { id: 'css', label: 'CSS Variables' },
    { id: 'claude', label: 'CLAUDE.md' },
    { id: 'cursor', label: '.cursorrules' },
    { id: 'cli', label: 'CLI' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-[var(--radius)] p-6 w-full max-w-2xl mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-[hsl(var(--foreground))] font-semibold text-sm mb-4">
          Export — {preset.name}
        </h2>

        <div className="flex gap-1 mb-4 border-b border-[hsl(var(--border))]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'px-3 py-1.5 text-xs font-mono transition-colors border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-[hsl(var(--primary))] text-[hsl(var(--foreground))]'
                  : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'css' && (
          <div className="flex gap-2 mb-3">
            {(['v3', 'v4'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setCSSFormat(fmt)}
                className={[
                  'px-2.5 py-1 text-xs font-mono rounded transition-colors',
                  cssFormat === fmt
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                ].join(' ')}
              >
                {fmt === 'v3' ? 'Tailwind v3' : 'Tailwind v4'}
              </button>
            ))}
          </div>
        )}

        <pre className="bg-[hsl(var(--muted))] rounded p-4 text-xs overflow-auto max-h-80 font-mono text-[hsl(var(--foreground))] leading-relaxed">
          {getContent()}
        </pre>

        <div className="flex justify-end mt-4">
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-mono bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-[var(--radius)] hover:opacity-90 transition-opacity"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
