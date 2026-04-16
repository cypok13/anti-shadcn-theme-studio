'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ThemePreset, ThemeTokens } from '@/lib/themes/types'
import type { TokenOverrides } from '@/components/tokens/TokenEditor'
import { resolveCSS } from '@/lib/themes/resolve'
import { generateClaudeMd, generateCursorRules } from '@/lib/themes/ai-rules'

const REGISTRY_BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://theme-studio-beta.vercel.app'

type Tab = 'css' | 'claude' | 'cursor' | 'cli'
type CSSFormat = 'v3' | 'v4'
type ColorFormat = 'hsl' | 'hex' | 'oklch'

function hslToHex(hsl: string): string {
  const parts = hsl.trim().split(/\s+/)
  const h = parseFloat(parts[0] ?? '0')
  const s = parseFloat(parts[1] ?? '0') / 100
  const l = parseFloat(parts[2] ?? '0') / 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

function hslToOklch(hsl: string): string {
  const parts = hsl.trim().split(/\s+/)
  if (parts.length < 3) return 'oklch(0.5 0 0)'
  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1]) / 100
  const l = parseFloat(parts[2]) / 100
  const lOklch = 0.2126 + l * 0.7874 * (1 - s * 0.3)
  const c = s * 0.15 * (1 - Math.abs(2 * l - 1))
  return `oklch(${lOklch.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`
}

function applyColorFormat(css: string, format: ColorFormat): string {
  if (format === 'hsl') return css
  const hslRe = /(\d+(?:\.\d+)?) (\d+(?:\.\d+)?)% (\d+(?:\.\d+)?%)/g
  if (format === 'hex') {
    return css.replace(hslRe, (_, hPart, sPart, lPart) =>
      hslToHex(`${hPart} ${sPart}% ${lPart}`)
    )
  }
  return css.replace(hslRe, (_, hPart, sPart, lPart) =>
    hslToOklch(`${hPart} ${sPart}% ${lPart}`)
  )
}

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
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hsl')
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)

  const effectivePreset = applyOverrides(preset, overrides)

  const getContent = useCallback((): string => {
    if (activeTab === 'css') {
      const raw = resolveCSS(effectivePreset, mode, cssFormat)
      return applyColorFormat(raw, colorFormat)
    }
    if (activeTab === 'claude') return generateClaudeMd(effectivePreset)
    if (activeTab === 'cursor') return generateCursorRules(effectivePreset)
    return `npx shadcn@latest add ${REGISTRY_BASE_URL}/r/${preset.id}`
  }, [activeTab, effectivePreset, preset.id, mode, cssFormat, colorFormat])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getContent())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopyError(true)
      setTimeout(() => setCopyError(false), 3000)
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

  const tabs: { id: Tab; label: string; title: string }[] = [
    { id: 'css', label: 'CSS Variables', title: 'Copy into your globals.css' },
    { id: 'claude', label: 'AI Config', title: 'CLAUDE.md — paste into your project root for Claude Code' },
    { id: 'cursor', label: 'AI Rules', title: '.cursorrules — paste into your project root for Cursor / Copilot' },
    { id: 'cli', label: 'CLI Install', title: 'One-command install via shadcn CLI' },
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
              title={tab.title}
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
          <>
            <div className="flex gap-2 mb-2">
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
            <div className="flex gap-2 mb-3">
              {(['hsl', 'hex', 'oklch'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setColorFormat(fmt)}
                  className={[
                    'px-2.5 py-1 text-xs font-mono rounded transition-colors uppercase',
                    colorFormat === fmt
                      ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] ring-1 ring-[hsl(var(--border))]'
                      : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
                  ].join(' ')}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </>
        )}

        <pre className="bg-[hsl(var(--muted))] rounded p-4 text-xs overflow-auto max-h-80 font-mono text-[hsl(var(--foreground))] leading-relaxed">
          {getContent()}
        </pre>

        <div className="flex items-center justify-end gap-3 mt-4">
          {copyError && (
            <span className="text-xs text-[hsl(var(--destructive))]">
              Copy failed — select and copy manually
            </span>
          )}
          <button
            onClick={handleCopy}
            className="px-4 py-2 text-xs font-mono bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-[var(--radius)] hover:opacity-90 transition-opacity"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
