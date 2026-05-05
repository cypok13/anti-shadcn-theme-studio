'use client'

import { CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const BADGE_PROPS = [
  {
    name: 'variant',
    type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info"',
    default: '"default"',
    description: 'Visual color style of the badge.',
  },
  {
    name: 'size',
    type: '"sm" | "md"',
    default: '"md"',
    description: 'Controls the badge height and font size.',
  },
  {
    name: 'dot',
    type: 'boolean',
    default: 'false',
    description: 'Shows a colored dot indicator before the label.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    required: true,
    description: 'Badge label text or content. Can include an icon as the first child.',
  },
]

export function BadgeOverviewTab() {
  return (
    <section className="space-y-4" data-section="badge">
      <div className="space-y-3">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Color variants</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Brand</Badge>
          <Badge variant="secondary">Gray</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">Sizes</p>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="default" size="sm">Small</Badge>
          <Badge variant="default" size="md">Medium</Badge>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">With dot indicator</p>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="success" dot>Online</Badge>
          <Badge variant="destructive" dot>Offline</Badge>
          <Badge variant="warning" dot>Away</Badge>
          <Badge variant="info" dot>Busy</Badge>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">With leading icon</p>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="success"><CheckCircle aria-hidden="true" />Verified</Badge>
          <Badge variant="destructive"><AlertTriangle aria-hidden="true" />Critical</Badge>
          <Badge variant="info"><Info aria-hidden="true" />Info</Badge>
          <Badge variant="default"><Zap aria-hidden="true" />New</Badge>
        </div>
      </div>
    </section>
  )
}

export function BadgeApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">Badge</code> extends all native{' '}
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">{'<span>'}</code> HTML attributes via spread.
      </p>
      <DocPropsTable rows={BADGE_PROPS} />
    </div>
  )
}

export function BadgeCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Variants"
        code={`<Badge variant="default">Brand</Badge>
<Badge variant="secondary">Gray</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>`}
      />
      <DocCodeBlock
        label="With dot indicator"
        code={`<Badge variant="success" dot>Online</Badge>
<Badge variant="destructive" dot>Offline</Badge>
<Badge variant="warning" dot>Away</Badge>`}
      />
      <DocCodeBlock
        label="With leading icon"
        code={`<Badge variant="success">
  <CheckCircle aria-hidden="true" />
  Verified
</Badge>
<Badge variant="destructive">
  <AlertTriangle aria-hidden="true" />
  Critical
</Badge>`}
      />
      <DocCodeBlock
        label="Small size"
        code={`<Badge variant="default" size="sm">New</Badge>`}
      />
    </div>
  )
}
