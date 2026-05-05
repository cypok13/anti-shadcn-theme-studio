'use client'

import { Separator } from '../../ui/separator'
import { DocPropsTable } from './DocPropsTable'

const SEPARATOR_PROPS = [
  {
    name: 'orientation',
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: 'Direction of the separator line.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes. Use to control height on vertical separators (e.g. className="h-4").',
  },
]

export function SeparatorOverviewTab() {
  return (
    <section className="space-y-4" data-section="separator">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Horizontal</p>
          <Separator />
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Vertical</p>
          <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
            <span>Item A</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Item B</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Item C</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">With label</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Separator style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', whiteSpace: 'nowrap' }}>OR</span>
            <Separator style={{ flex: 1 }} />
          </div>
        </div>
      </div>
    </section>
  )
}

export function SeparatorApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">Separator</code> extends all native{' '}
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">{'<div>'}</code> HTML attributes via spread.
      </p>
      <DocPropsTable rows={SEPARATOR_PROPS} />
    </div>
  )
}
