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
      setShareCopied(false)
    }
  }, [presetId, mode])

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: `hsl(${tokens.background})`,
        color: `hsl(${tokens.foreground})`,
        fontFamily: selectedPreset.fonts.body,
      }}
    >
      <style>{`
        :root {
          --background: ${tokens.background};
          --foreground: ${tokens.foreground};
          --card: ${tokens.card};
          --card-foreground: ${tokens.cardForeground};
          --popover: ${tokens.popover};
          --popover-foreground: ${tokens.popoverForeground};
          --primary: ${tokens.primary};
          --primary-foreground: ${tokens.primaryForeground};
          --secondary: ${tokens.secondary};
          --secondary-foreground: ${tokens.secondaryForeground};
          --muted: ${tokens.muted};
          --muted-foreground: ${tokens.mutedForeground};
          --accent: ${tokens.accent};
          --accent-foreground: ${tokens.accentForeground};
          --destructive: ${tokens.destructive};
          --destructive-foreground: ${tokens.destructiveForeground};
          --border: ${tokens.border};
          --input: ${tokens.input};
          --ring: ${tokens.ring};
          --radius: ${tokens.radius};
          --font-body: ${selectedPreset.fonts.body};
          --font-heading: ${selectedPreset.fonts.heading};
          --font-mono: ${selectedPreset.fonts.mono};
        }
      `}</style>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          minWidth: '240px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRight: `1px solid hsl(${tokens.border})`,
          background: `hsl(${tokens.background})`,
        }}
      >
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid hsl(${tokens.border})`,
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
          tokens={tokens}
          presetTokens={mode === 'dark' ? selectedPreset.dark : selectedPreset.light}
          overrides={overrides}
          presetFonts={selectedPreset.fonts}
          onChange={setOverrides}
        />

        <div
          style={{
            padding: '12px',
            borderTop: `1px solid hsl(${tokens.border})`,
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
              background: `hsl(${tokens.primary})`,
              color: `hsl(${tokens.primaryForeground})`,
              border: 'none',
              borderRadius: tokens.radius,
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
              background: `hsl(${tokens.muted})`,
              color: `hsl(${tokens.mutedForeground})`,
              border: 'none',
              borderRadius: tokens.radius,
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
              color: `hsl(${tokens.mutedForeground})`,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            {mode === 'light' ? '◐ Dark' : '○ Light'}
          </button>
          <a
            href="https://github.com/cypok13/anti-shadcn-theme-studio"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '12px',
              color: `hsl(${tokens.mutedForeground})`,
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
            borderBottom: `1px solid hsl(${tokens.border})`,
            background: `hsl(${tokens.background})`,
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
                  ? `2px solid hsl(${tokens.primary})`
                  : '2px solid transparent',
                color: activeTab === tab
                  ? `hsl(${tokens.foreground})`
                  : `hsl(${tokens.mutedForeground})`,
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
            shadowStyle={overrides.shadowStyle ?? selectedPreset.shadowStyle}
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
