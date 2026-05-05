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

export function BadgeUsageTab() {
  return (
    <div className="space-y-8 max-w-sm">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">User status</p>
        <div className="space-y-2">
          {[
            { name: 'Alex Krasnov', role: 'Admin', status: 'Online' as const, v: 'success' as const },
            { name: 'Maria Garcia', role: 'Editor', status: 'Away' as const, v: 'warning' as const },
            { name: 'James Lee', role: 'Viewer', status: 'Offline' as const, v: 'secondary' as const },
          ].map(u => (
            <div key={u.name} className="flex items-center justify-between py-2 border-b border-[hsl(var(--border)/0.5)] last:border-0">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{u.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">{u.role}</p>
              </div>
              <Badge variant={u.v} dot size="sm">{u.status}</Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Severity labels</p>
        <div className="space-y-2">
          {[
            { msg: 'Deployment failed on prod', v: 'destructive' as const, label: 'Critical' },
            { msg: 'SSL cert expires in 7 days', v: 'warning' as const, label: 'Warning' },
            { msg: 'New version available', v: 'info' as const, label: 'Info' },
            { msg: 'All checks passed', v: 'success' as const, label: 'Resolved' },
          ].map(e => (
            <div key={e.msg} className="flex items-start gap-3">
              <Badge variant={e.v} size="sm" className="mt-0.5 shrink-0">{e.label}</Badge>
              <p className="text-sm text-[hsl(var(--foreground))]">{e.msg}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Tag chips</p>
        <div className="flex flex-wrap gap-2">
          {['Next.js', 'TypeScript', 'Tailwind', 'Supabase', 'Vercel', 'React'].map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </div>
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
