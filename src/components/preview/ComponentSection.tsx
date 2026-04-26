'use client'

import { useState } from 'react'
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

  const activeContent = tabs?.find((t) => t.key === activeTab)?.content ?? children

  return (
    <div className={cn(
      'rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-8',
      className
    )}>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h2>
        {/* {_docsHref && (
          <a
            href={_docsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-[hsl(var(--primary))] hover:text-[hsl(var(--primary)/0.8)] transition-colors"
          >
            View in docs
            <ExternalLink className="size-3" />
          </a>
        )} */}
      </div>

      {/* Inline tab pills */}
      {tabs && tabs.length > 1 && (
        <div className="flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                activeTab === tab.key
                  ? 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Demo area */}
      <div className="rounded-xl bg-[hsl(var(--muted)/0.4)] p-6 min-h-[80px] [box-shadow:var(--shadow-preset,none)]">
        <div className="w-full overflow-x-auto px-1.5 py-1.5">
          {activeContent}
        </div>
      </div>
    </div>
  )
}
