'use client'

import { Separator } from '../../ui/separator'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

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

const ORIENTATION_GUIDE = [
  { use: 'horizontal', when: 'Dividing stacked sections — card rows, form groups, list items' },
  { use: 'vertical',   when: 'Dividing inline items — breadcrumbs, toolbar actions, nav links' },
]

export function SeparatorUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use to group related content">
            Separator creates visual breathing room between distinct groups. Use it inside cards, sidebars, and menus to separate sections without a heading.
          </DoDontCard>
          <DoDontCard type="dont" title="Use instead of spacing">
            Separator is a structural element, not a substitute for margin or padding. Don&apos;t reach for it just to add space — use a spacing token instead.
          </DoDontCard>
          <DoDontCard type="do" title="Set explicit height on vertical separators">
            Vertical separators inherit 100% of the flex container height. Always pass <code className="font-mono">className=&quot;h-4&quot;</code> (or another height) to keep it visually proportional.
          </DoDontCard>
          <DoDontCard type="dont" title="Use decorative separators as landmarks">
            Leave <code className="font-mono">decorative</code> at its default (<code className="font-mono">true</code>) unless the separator marks a genuine structural boundary that screen readers must announce.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Orientation guide</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {ORIENTATION_GUIDE.map((row, i) => (
            <div key={row.use} className={`flex items-center gap-4 px-4 py-2 ${i < ORIENTATION_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}>
              <code className="font-mono text-xs text-[hsl(var(--primary))] w-28 shrink-0">{row.use}</code>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function SeparatorCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Horizontal (default)"
        code={`<Separator />`}
      />
      <DocCodeBlock
        label="Vertical — explicit height required"
        code={`<div className="flex items-center gap-2">
  <span>Home</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Settings</span>
</div>`}
      />
      <DocCodeBlock
        label="With label"
        code={`<div className="flex items-center gap-3">
  <Separator className="flex-1" />
  <span className="text-xs text-muted-foreground">OR</span>
  <Separator className="flex-1" />
</div>`}
      />
      <DocCodeBlock
        label="Semantic (structural landmark)"
        code={`<Separator decorative={false} />`}
      />
    </div>
  )
}
