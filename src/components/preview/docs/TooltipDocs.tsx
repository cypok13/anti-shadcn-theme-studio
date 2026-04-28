'use client'

import { Info } from 'lucide-react'
import { Button } from '../../ui/button'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

// ─── Shared helpers ───────────────────────────────────────────────────────────

function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'rounded-[var(--radius)] p-4 text-sm',
        type === 'do'
          ? 'border-l-4 border-l-[hsl(var(--success))] bg-[hsl(var(--success)/0.06)]'
          : 'border-l-4 border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.06)]',
      ].join(' ')}
    >
      <div className="flex items-baseline gap-2 mb-2">
        <span
          className={[
            'text-xs font-bold uppercase tracking-wider shrink-0',
            type === 'do'
              ? 'text-[hsl(var(--success))]'
              : 'text-[hsl(var(--destructive))]',
          ].join(' ')}
        >
          {type === 'do' ? '✓ Do' : "✕ Don't"}
        </span>
        <span className="text-xs font-medium text-[hsl(var(--foreground))] leading-snug">{title}</span>
      </div>
      <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{children}</div>
    </div>
  )
}

function DemoRow({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
      <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">{label}</p>
      <div className="flex items-center gap-4 rounded-lg border border-[hsl(var(--border))] p-4">
        {children}
      </div>
    </div>
  )
}

// ─── Props definitions ────────────────────────────────────────────────────────

const TOOLTIP_PROPS = [
  {
    name: 'delayDuration',
    type: 'number',
    default: '300',
    description: 'Delay in ms before tooltip opens on hover.',
  },
  {
    name: 'side',
    type: '"top" | "right" | "bottom" | "left"',
    default: '"top"',
    description: 'Preferred placement side relative to the trigger.',
  },
  {
    name: 'sideOffset',
    type: 'number',
    default: '6',
    description: 'Gap in px between the trigger and the tooltip.',
  },
  {
    name: 'showArrow',
    type: 'boolean',
    default: 'true',
    description: 'Show the directional arrow pointing at the trigger.',
  },
  {
    name: 'asChild (TooltipTrigger)',
    type: 'boolean',
    default: 'false',
    description: 'Merge event props onto the child element instead of wrapping in a span.',
  },
]

// ─── Tab 1 — Overview ─────────────────────────────────────────────────────────

export function TooltipOverviewTab() {
  return (
    <div className="space-y-4">
      <DemoRow label="Default (top)" className="pt-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Save changes</Button>
          </TooltipTrigger>
          <TooltipContent>Save changes</TooltipContent>
        </Tooltip>
      </DemoRow>

      <DemoRow label="Placement variants" className="pt-8">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">Top</Button>
          </TooltipTrigger>
          <TooltipContent side="top">Top placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">Right</Button>
          </TooltipTrigger>
          <TooltipContent side="right">Right placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">Bottom</Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bottom placement</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">Left</Button>
          </TooltipTrigger>
          <TooltipContent side="left">Left placement</TooltipContent>
        </Tooltip>
      </DemoRow>

      <DemoRow label="Icon button">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="More information">
              <Info className="h-4 w-4" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>More information</TooltipContent>
        </Tooltip>
      </DemoRow>
    </div>
  )
}

// ─── Tab 2 — API ──────────────────────────────────────────────────────────────

export function TooltipApiTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Tooltip props</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Context root. Manages open state and delay timer. Wrap{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">TooltipTrigger</code>{' '}
          and{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">TooltipContent</code>{' '}
          inside.
        </p>
        <DocPropsTable rows={TOOLTIP_PROPS} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">TooltipProvider</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Passthrough wrapper for compatibility. No props — wrap your app or page root to satisfy import expectations.
        </p>
      </div>
    </div>
  )
}

// ─── Tab 3 — Usage ────────────────────────────────────────────────────────────

export function TooltipUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for non-interactive supplementary information only">
            Tooltips are for brief labels and hints — keyboard shortcuts, icon meanings, field context. They disappear on blur/mouseout.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't put interactive content (links, buttons) inside tooltip — use Popover">
            Tooltip content is not keyboard-reachable and disappears on mouse-out. Any clickable content must live in a Popover instead.
          </DoDontCard>
          <DoDontCard type="do" title="Wrap disabled buttons in a span with tabIndex={0} to enable tooltip">
            Disabled buttons suppress pointer events, so the tooltip trigger never fires. A wrapper span restores hover and focus events.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't attach tooltip directly to a disabled button">
            A disabled button has pointer-events: none. Hover and focus events are swallowed — the tooltip never opens for keyboard or mouse users.
          </DoDontCard>
        </div>
      </section>
    </div>
  )
}

// ─── Tab 4 — Code ─────────────────────────────────────────────────────────────

export function TooltipCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic with icon button trigger"
        code={`import { Info } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="icon" aria-label="More information">
      <Info className="h-4 w-4" aria-hidden="true" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>More information</TooltipContent>
</Tooltip>`}
      />
      <DocCodeBlock
        label="Right placement"
        code={`<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent side="right" sideOffset={8}>
    Opens to the right
  </TooltipContent>
</Tooltip>`}
      />
      <DocCodeBlock
        label="Disabled button wrapped in span"
        code={`<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0} className="inline-flex">
      <Button disabled aria-disabled="true" style={{ pointerEvents: 'none' }}>
        Submit
      </Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>Complete all required fields first</TooltipContent>
</Tooltip>`}
      />
    </div>
  )
}

// ─── Tab 5 — States ───────────────────────────────────────────────────────────

export function TooltipStatesTab() {
  return (
    <div className="space-y-4">
      <div className="space-y-4 max-w-sm">

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Top (default)</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" aria-describedby={undefined}>Top</Button>
            </TooltipTrigger>
            <TooltipContent side="top">Top tooltip</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Right</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Right</Button>
            </TooltipTrigger>
            <TooltipContent side="right">Right tooltip</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Bottom</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Bottom</Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Left</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Left</Button>
            </TooltipTrigger>
            <TooltipContent side="left">Left tooltip</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">No arrow</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">No arrow</Button>
            </TooltipTrigger>
            <TooltipContent showArrow={false}>No arrow tooltip</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Long text</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm">Long text</Button>
            </TooltipTrigger>
            <TooltipContent>
              This tooltip contains a longer description to test how the max-width constraint wraps text across multiple lines correctly.
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Keyboard focus</p>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button id="tooltip-focus-demo" variant="outline" size="sm">Focus me (Tab)</Button>
            </TooltipTrigger>
            <TooltipContent>Tooltip opens on focus too</TooltipContent>
          </Tooltip>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Tab to trigger button to see instant-open on focus
          </p>
        </div>

      </div>
    </div>
  )
}
