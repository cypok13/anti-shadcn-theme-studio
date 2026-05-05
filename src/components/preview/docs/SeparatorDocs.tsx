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

export function SeparatorUsageTab() {
  return (
    <div className="space-y-8 max-w-sm">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Card sections</p>
        <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4 space-y-3">
          <div>
            <p className="text-sm font-medium text-[hsl(var(--foreground))]">Alex Krasnov</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">alex@example.com</p>
          </div>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs text-[hsl(var(--muted-foreground))]">Plan</p>
            <p className="text-sm text-[hsl(var(--foreground))]">Pro — $12/mo</p>
          </div>
          <Separator />
          <p className="text-xs text-[hsl(var(--destructive))] cursor-pointer">Delete account</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Breadcrumb divider</p>
        <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
          <span className="text-[hsl(var(--foreground))]">Dashboard</span>
          <Separator orientation="vertical" className="h-4" />
          <span className="text-[hsl(var(--foreground))]">Settings</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Profile</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Auth form divider</p>
        <div className="space-y-3">
          <button className="w-full py-2 px-4 rounded-[var(--radius)] border border-[hsl(var(--border))] text-sm text-[hsl(var(--foreground))] bg-[hsl(var(--background))]">
            Continue with Google
          </button>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">or</span>
            <Separator className="flex-1" />
          </div>
          <button className="w-full py-2 px-4 rounded-[var(--radius)] text-sm font-medium text-[hsl(var(--primary-foreground))] bg-[hsl(var(--primary))]">
            Sign in with email
          </button>
        </div>
      </div>
    </div>
  )
}

export function SeparatorCodeTab() {
  return (
    <div className="space-y-4">
      <pre className="bg-[hsl(var(--muted))] rounded-[var(--radius)] p-4 text-sm font-mono text-[hsl(var(--foreground))] overflow-x-auto">
        <code>{`import { Separator } from '@/components/ui/separator'

// Horizontal (default)
<Separator />

// Vertical — set a height via className
<div className="flex items-center gap-2">
  <span>Home</span>
  <Separator orientation="vertical" className="h-4" />
  <span>Settings</span>
</div>

// With label
<div className="flex items-center gap-3">
  <Separator className="flex-1" />
  <span className="text-xs text-muted-foreground">OR</span>
  <Separator className="flex-1" />
</div>`}</code>
      </pre>
    </div>
  )
}
