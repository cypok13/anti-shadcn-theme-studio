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

function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  return (
    <div className={['rounded-lg p-4 text-sm', type === 'do' ? 'border-l-[3px] border-l-[hsl(var(--success,142_71%_45%))] bg-[hsl(var(--success,142_71%_45%)/0.06)]' : 'border-l-[3px] border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.06)]'].join(' ')}>
      <div className="flex items-center gap-1.5 mb-2">
        <span className={['text-xs font-bold uppercase tracking-wider', type === 'do' ? 'text-[hsl(var(--success,142_71%_45%))]' : 'text-[hsl(var(--destructive))]'].join(' ')}>{type === 'do' ? '✓ Do' : "✕ Don't"}</span>
        <span className="text-xs font-medium text-[hsl(var(--foreground))]">{title}</span>
      </div>
      <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{children}</div>
    </div>
  )
}

const VARIANT_GUIDE = [
  { variant: 'default',     when: 'Primary status label or action label' },
  { variant: 'secondary',   when: 'Neutral info — categories, tags, counts' },
  { variant: 'outline',     when: 'Low-emphasis label on colored backgrounds' },
  { variant: 'destructive', when: 'Error, failure, danger state' },
  { variant: 'success',     when: 'Success, active, verified, online' },
  { variant: 'warning',     when: 'Caution, pending, expiring soon' },
  { variant: 'info',        when: 'Informational, neutral-blue context' },
]

export function BadgeUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for status and labels">
            Badge is for communicating state (active, pending, error) or categorising content (tags, types). It is a decorative element.
          </DoDontCard>
          <DoDontCard type="dont" title="Use as a button">
            Badge has no click handler by default. If you need an interactive tag, use a Button with a variant or add an action via <code className="font-mono">asChild</code>.
          </DoDontCard>
          <DoDontCard type="do" title="Add aria-label to dot badges">
            A dot badge with no text child must have <code className="font-mono">aria-label</code> so screen readers announce the status (e.g. "Online").
          </DoDontCard>
          <DoDontCard type="dont" title="Use badge for full-width status">
            For a prominent alert or callout bar, use a dedicated Callout or Alert component — badge is inline and compact.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">When to use each variant</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {VARIANT_GUIDE.map((row, i) => (
            <div key={row.variant} className={`flex items-center gap-4 px-4 py-2 ${i < VARIANT_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}>
              <code className="font-mono text-xs text-[hsl(var(--primary))] w-28 shrink-0">{row.variant}</code>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function BadgeStatesTab() {
  const VARIANTS = ['default', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info'] as const

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">All variants — md</p>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map(v => <Badge key={v} variant={v}>{v}</Badge>)}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">All variants — sm</p>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map(v => <Badge key={v} variant={v} size="sm">{v}</Badge>)}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">With dot</p>
        <div className="flex flex-wrap gap-2">
          {VARIANTS.map(v => <Badge key={v} variant={v} dot>{v}</Badge>)}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">With leading icon</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="success"><CheckCircle aria-hidden="true" />Verified</Badge>
          <Badge variant="destructive"><AlertTriangle aria-hidden="true" />Critical</Badge>
          <Badge variant="info"><Info aria-hidden="true" />Info</Badge>
          <Badge variant="default"><Zap aria-hidden="true" />New</Badge>
        </div>
      </div>
    </div>
  )
}
