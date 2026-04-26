'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
// import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type TabKey = string

interface Tab {
  key: TabKey
  label: string
  content: React.ReactNode
}

interface ComponentSectionProps {
  title: string
  docsHref?: string
  tabs?: Tab[]
  children?: React.ReactNode
  className?: string
}

export function ComponentSection({ title, docsHref: _docsHref, tabs, children, className }: ComponentSectionProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(tabs?.[0]?.key ?? 'variants')
  const baseId = useId()
  const tablistRef = useRef<HTMLDivElement>(null)

  const activeContent = tabs?.find((t) => t.key === activeTab)?.content ?? children

  const tabId = (key: TabKey) => `${baseId}-tab-${key}`
  const panelId = (key: TabKey) => `${baseId}-panel-${key}`

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!tabs || tabs.length < 2) return
    const items = Array.from(
      tablistRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    )
    const currentIdx = items.findIndex((el) => el === document.activeElement)
    if (currentIdx === -1) return

    let nextIdx = currentIdx
    if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % items.length
    else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + items.length) % items.length
    else if (e.key === 'Home') nextIdx = 0
    else if (e.key === 'End') nextIdx = items.length - 1
    else return

    e.preventDefault()
    const nextTab = tabs[nextIdx]
    items[nextIdx].focus()
    setActiveTab(nextTab.key)
  }

  return (
    <div className={cn(
      'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8',
      className
    )}>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h2>
      </div>

      {/* Inline tab pills */}
      {tabs && tabs.length > 1 && (
        <div
          ref={tablistRef}
          role="tablist"
          aria-orientation="horizontal"
          aria-label={`${title} sections`}
          onKeyDown={handleKeyDown}
          className="flex gap-1 mb-4"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                id={tabId(tab.key)}
                aria-selected={isActive}
                aria-controls={panelId(tab.key)}
                tabIndex={isActive ? 0 : -1}
                data-state={isActive ? 'active' : 'inactive'}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
                  isActive
                    ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] font-semibold'
                    : 'font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.6)]'
                )}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Demo area */}
      <div
        {...(tabs && tabs.length > 1
          ? {
              role: 'tabpanel',
              id: panelId(activeTab),
              'aria-labelledby': tabId(activeTab),
              tabIndex: 0,
            }
          : {})}
        className="rounded-xl bg-[hsl(var(--muted)/0.4)] p-6 min-h-[80px] [box-shadow:var(--shadow-preset,none)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
      >
        <div className="w-full overflow-x-auto px-1.5 py-1.5">
          {activeContent}
        </div>
      </div>
    </div>
  )
}
