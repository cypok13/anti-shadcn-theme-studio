'use client'

import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ─── Context ─────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

// ─── Tabs root ────────────────────────────────────────────────────────────────

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

export function Tabs({
  defaultValue = '',
  value,
  onValueChange,
  children,
  ...props
}: TabsProps) {
  const [internalActive, setInternalActive] = React.useState(defaultValue)
  const activeTab = value !== undefined ? value : internalActive
  const baseId = React.useId()

  const setActiveTab = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalActive(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div data-slot="tabs" {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

// ─── TabsList ─────────────────────────────────────────────────────────────────

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-[hsl(var(--muted-foreground))]',
  {
    variants: {
      variant: {
        default: 'bg-[hsl(var(--muted))]',
        line: 'gap-1 bg-transparent border-b border-[hsl(var(--border))] w-full rounded-none p-0',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'line'
}

export function TabsList({ className, variant = 'default', children, ...props }: TabsListProps) {
  const listRef = React.useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []
    )
    const idx = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (idx === -1) return

    let next = idx
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    else return

    e.preventDefault()
    tabs[next].focus()
    tabs[next].click()
  }

  return (
    <div
      ref={listRef}
      data-slot="tabs-list"
      data-variant={variant}
      role="tablist"
      onKeyDown={handleKeyDown}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── TabsTrigger ──────────────────────────────────────────────────────────────

export interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ className, value, children, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      data-slot="tabs-trigger"
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`${baseId}-panel-${value}`}
      id={`${baseId}-tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      data-state={isActive ? 'active' : 'inactive'}
      {...(props.disabled ? { 'data-disabled': '' } : {})}
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
        'rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap',
        'cursor-pointer transition-all',
        'text-[hsl(var(--foreground)/0.6)]',
        'hover:text-[hsl(var(--foreground))]',
        'data-[state=active]:bg-[hsl(var(--background))]',
        'data-[state=active]:text-[hsl(var(--foreground))]',
        'data-[state=active]:shadow-sm',
        'focus-visible:border-[hsl(var(--ring))] focus-visible:ring-[3px] focus-visible:ring-[hsl(var(--ring)/0.5)] focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
        'group-data-[variant=line]/tabs-list:rounded-none group-data-[variant=line]/tabs-list:border-0 group-data-[variant=line]/tabs-list:border-b-2 group-data-[variant=line]/tabs-list:border-transparent group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:shadow-none group-data-[variant=line]/tabs-list:h-9 group-data-[variant=line]/tabs-list:pb-2',
        'group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:border-[hsl(var(--primary))] group-data-[variant=line]/tabs-list:data-[state=active]:text-[hsl(var(--foreground))] group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── TabsContent ──────────────────────────────────────────────────────────────

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const { activeTab, baseId } = useTabsContext()
  const isActive = activeTab === value

  return (
    <div
      data-slot="tabs-content"
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn('flex-1 outline-none', className)}
      {...props}
    >
      {children}
    </div>
  )
}
