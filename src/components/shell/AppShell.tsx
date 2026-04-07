'use client'

import { useState, useCallback } from 'react'
import { useTheme } from '@/hooks/useTheme'
import { PRESETS, getPreset } from '@/lib/themes/registry'
import { PresetGrid } from '@/components/presets/PresetGrid'
import { PreviewFrame } from '@/components/preview/PreviewFrame'
import { ExportModal } from '@/components/export/ExportModal'
import { TokenEditor, type TokenOverrides } from '@/components/tokens/TokenEditor'

const TABS = ['components', 'cards', 'typography'] as const
type PreviewTab = (typeof TABS)[number]

export function AppShell() {
  const { presetId, setPresetId, mode, setMode } = useTheme()
  const [overrides, setOverrides] = useState<TokenOverrides>({})
  const [activeTab, setActiveTab] = useState<PreviewTab>('components')
  const [exportOpen, setExportOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)

  const selectedPreset = getPreset(presetId) ?? PRESETS[0]
  const tokens = mode === 'dark' ? selectedPreset.dark : selectedPreset.light

  const handleSelectPreset = useCallback(
    (id: string) => {
      setPresetId(id)
      setOverrides({})
    },
    [setPresetId],
  )

  const handleShare = useCallback(async () => {
    const params = new URLSearchParams({ theme: presetId, mode: mode ?? 'light' })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    try {
      await navigator.clipboard.writeText(url)
      setShareCopied(true)
      setTimeout(() => setShareCopied(false), 2000)
    } catch {
      // clipboard not available
    }
  }, [presetId, mode])

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'hsl(var(--background, 5 0% 97%))',
        color: 'hsl(var(--foreground, 0 0% 5%))',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          minWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: '1px solid hsl(var(--border, 0 0% 20%))',
          background: 'hsl(var(--background, 5 0% 97%))',
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid hsl(var(--border, 0 0% 20%))',
          }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: '14px', fontWeight: 700 }}>
            anti-shadcn
          </span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <PresetGrid
            presets={PRESETS}
            selectedId={presetId}
            onSelect={handleSelectPreset}
          />
        </div>

        <TokenEditor
          primaryForeground={tokens.primaryForeground}
          overrides={overrides}
          defaults={{
            primary: tokens.primary,
            secondary: tokens.secondary,
            accent: tokens.accent,
            radius: tokens.radius,
          }}
          onChange={setOverrides}
        />

        <div
          style={{
            padding: '12px',
            borderTop: '1px solid hsl(var(--border, 0 0% 20%))',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setExportOpen(true)}
            style={{
              flex: 1,
              fontSize: '12px',
              fontFamily: 'monospace',
              padding: '6px 0',
              background: 'hsl(var(--primary, 0 0% 5%))',
              color: 'hsl(var(--primary-foreground, 0 0% 100%))',
              border: 'none',
              borderRadius: 'var(--radius, 0)',
              cursor: 'pointer',
            }}
          >
            Export
          </button>
          <button
            onClick={handleShare}
            style={{
              flex: 1,
              fontSize: '12px',
              fontFamily: 'monospace',
              padding: '6px 0',
              background: 'hsl(var(--muted, 0 0% 88%))',
              color: 'hsl(var(--muted-foreground, 0 0% 40%))',
              border: 'none',
              borderRadius: 'var(--radius, 0)',
              cursor: 'pointer',
            }}
          >
            {shareCopied ? 'Copied!' : 'Share'}
          </button>
        </div>

        <div
          style={{
            padding: '0 12px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            style={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground, 0 0% 40%))',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {mode === 'light' ? '◐ Dark' : '○ Light'}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: 'hsl(var(--muted-foreground, 0 0% 40%))',
              textDecoration: 'none',
            }}
            aria-label="GitHub"
          >
            ↗ GitHub
          </a>
        </div>
      </aside>

      {/* Main preview area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid hsl(var(--border, 0 0% 20%))',
            background: 'hsl(var(--background, 5 0% 97%))',
            padding: '0 16px',
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                padding: '8px 12px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab
                  ? '2px solid hsl(var(--primary, 0 0% 5%))'
                  : '2px solid transparent',
                color: activeTab === tab
                  ? 'hsl(var(--foreground, 0 0% 5%))'
                  : 'hsl(var(--muted-foreground, 0 0% 40%))',
                cursor: 'pointer',
                marginBottom: '-1px',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <main style={{ flex: 1, overflow: 'hidden' }}>
          <PreviewFrame
            presetId={presetId}
            mode={mode ?? 'light'}
            overrides={overrides}
            activeTab={activeTab}
          />
        </main>
      </div>

      <ExportModal
        preset={selectedPreset}
        mode={mode ?? 'light'}
        overrides={overrides}
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  )
}
