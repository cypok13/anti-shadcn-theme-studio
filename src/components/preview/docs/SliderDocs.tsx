'use client'

import { useState } from 'react'
import { Slider } from '../../ui/slider'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const SLIDER_PROPS = [
  {
    name: 'value',
    type: 'number | undefined',
    default: 'undefined',
    description:
      'Controlled value. Omit (or pass undefined) to use uncontrolled mode with defaultValue.',
  },
  {
    name: 'defaultValue',
    type: 'number | undefined',
    default: 'undefined',
    description:
      'Initial value for uncontrolled mode. Ignored when value is provided. Falls back to min when neither is set.',
  },
  {
    name: 'min',
    type: 'number',
    default: '0',
    description: 'Lower bound of the value range.',
  },
  {
    name: 'max',
    type: 'number',
    default: '100',
    description: 'Upper bound of the value range.',
  },
  {
    name: 'step',
    type: 'number',
    default: '1',
    description:
      'Granularity of value changes from keyboard and pointer drag. Must be greater than zero.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Removes the thumb from the tab order, blocks pointer + keyboard input, and applies a 50% opacity treatment to the root.',
  },
  {
    name: 'size',
    type: '"sm" | "md"',
    default: '"md"',
    description:
      'Visual size of the track and thumb. The 44px hit zone on the thumb preserves a touch target across sizes.',
  },
  {
    name: 'aria-label',
    type: 'string',
    default: '— (required*)',
    description:
      'Required if no aria-labelledby is provided. Announced by screen readers in place of a visible label.',
  },
  {
    name: 'aria-labelledby',
    type: 'string',
    default: 'undefined',
    description:
      'ID of an external element that labels this slider. Use when a visible label exists in the DOM.',
  },
  {
    name: 'label',
    type: 'string',
    default: 'undefined',
    description:
      'Visually-hidden helper. Sets aria-label automatically when no other labelling prop is provided.',
  },
  {
    name: 'showValue',
    type: 'boolean',
    default: 'false',
    description:
      'Renders the current value at the end of the track. Uses tabular-nums to prevent layout shift while changing.',
  },
  {
    name: 'formatValue',
    type: '(v: number) => string',
    default: 'undefined',
    description:
      'Formats both the showValue text and aria-valuetext. Use for currency, units, or qualitative labels.',
  },
  {
    name: 'onValueChange',
    type: '(v: number) => void',
    default: 'undefined',
    description:
      'Fires on every value change (drag, keyboard). Suitable for cheap consumers like local state or live previews.',
  },
  {
    name: 'onValueCommit',
    type: '(v: number) => void',
    default: 'undefined',
    description:
      'Fires once on pointer-up or key-up. Use for expensive consumers (network, heavy compute) instead of onValueChange.',
  },
]

export function SliderOverviewTab() {
  const [volume, setVolume] = useState(50)
  const [price, setPrice] = useState(100)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Default (md)</p>
        <Slider value={volume} onValueChange={setVolume} aria-label="Volume" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">With value + format</p>
        <Slider
          value={price}
          onValueChange={setPrice}
          min={0}
          max={500}
          step={5}
          showValue
          formatValue={(v) => `$${v}`}
          aria-label="Max price"
        />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Small</p>
        <Slider defaultValue={80} size="sm" aria-label="Compact opacity" />
      </div>
    </div>
  )
}

export function SliderApiTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Slider</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Single-thumb horizontal slider for selecting a numeric value across a continuous or discrete range. Thumb is the single tab stop; track is decorative.
        </p>
        <DocPropsTable rows={SLIDER_PROPS} />
      </div>
    </div>
  )
}

function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'rounded-lg p-4 text-sm',
        type === 'do'
          ? 'border-l-[3px] border-l-[hsl(var(--success,142_71%_45%))] bg-[hsl(var(--success,142_71%_45%)/0.06)]'
          : 'border-l-[3px] border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.06)]',
      ].join(' ')}
    >
      <div className="flex items-baseline gap-1.5 mb-2">
        <span
          className={[
            'text-xs font-bold uppercase tracking-wider shrink-0',
            type === 'do'
              ? 'text-[hsl(var(--success,142_71%_45%))]'
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

const DECISION_GUIDE = [
  { use: 'Slider',          when: 'Single numeric value with spatial feedback (volume, brightness, opacity)' },
  { use: 'Input[number]',   when: 'Exact numeric precision (tax rate 7.125%, ID, port number)' },
  { use: 'Switch',          when: 'Binary on/off setting with immediate effect' },
  { use: 'Radio / Select',  when: 'Discrete labelled options (Small / Medium / Large)' },
]

export function SliderUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Always provide aria-label or aria-labelledby">
            Without one, screen readers announce only &quot;slider&quot; with no context. The ARIA APG pattern requires it.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Slider for exact numeric input">
            If users must type a precise value (tax rate, port number), use an Input[type=number] — pixel-snapped sliders cannot land on arbitrary decimals.
          </DoDontCard>
          <DoDontCard type="do" title="Use onValueCommit for expensive consumers">
            Network calls, heavy renders, or persistence belong in onValueCommit. onValueChange fires on every pixel of drag.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't call expensive work from onValueChange">
            Saving to a server on every drag pixel will spam the network and lag the UI. Save the local preview from onValueChange and persist from onValueCommit.
          </DoDontCard>
          <DoDontCard type="do" title="Use Slider when spatial feedback matters">
            Volume, brightness, opacity, threshold — values where users gauge &quot;near max&quot; vs &quot;midpoint&quot; visually.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Slider for discrete labelled options">
            Small / Medium / Large is a Radio choice. Slider implies a continuum; mapping integers to labels is friction.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Slider vs Input vs Switch vs Radio</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {DECISION_GUIDE.map((row, i) => (
            <div
              key={row.use}
              className={`flex items-center gap-4 px-4 py-2 ${i < DECISION_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}
            >
              <div className="flex items-center gap-2 w-36 shrink-0">
                <code className="font-mono text-xs text-[hsl(var(--primary))]">{row.use}</code>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function SliderCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Controlled"
        code={`const [volume, setVolume] = useState(50)

<Slider
  value={volume}
  onValueChange={setVolume}
  min={0}
  max={100}
  aria-label="Volume"
/>`}
      />
      <DocCodeBlock
        label="With visible value + custom format"
        code={`const [price, setPrice] = useState(100)

<Slider
  value={price}
  onValueChange={setPrice}
  min={0}
  max={500}
  step={5}
  showValue
  formatValue={(v) => \`$\${v}\`}
  aria-label="Max price"
/>`}
      />
      <DocCodeBlock
        label="Async-coupled consumer (avoid spam)"
        code={`<Slider
  defaultValue={50}
  onValueChange={setLocalPreview}
  onValueCommit={persistToServer}
  aria-label="Quality"
/>`}
      />
      <DocCodeBlock
        label="Disabled"
        code={`<Slider value={70} disabled aria-label="Volume (locked)" />`}
      />
    </div>
  )
}

const STATE_ROWS: Array<{
  label: string
  props: React.ComponentProps<typeof Slider>
}> = [
  { label: 'Default (md)',    props: { defaultValue: 50, 'aria-label': 'Default md' } },
  { label: 'With value',      props: { defaultValue: 100, max: 500, step: 5, showValue: true, formatValue: (v: number) => `$${v}`, 'aria-label': 'With value' } },
  { label: 'At min',          props: { value: 0, 'aria-label': 'At min' } },
  { label: 'At max',          props: { value: 100, 'aria-label': 'At max' } },
  { label: 'Disabled',        props: { value: 70, disabled: true, 'aria-label': 'Disabled' } },
  { label: 'Size sm',         props: { defaultValue: 80, size: 'sm', 'aria-label': 'Size sm' } },
]

export function SliderStatesTab() {
  return (
    <div className="space-y-3">
      <div className="space-y-5 max-w-md">
        {STATE_ROWS.map((row) => (
          <div key={row.label} className="space-y-2">
            <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">{row.label}</p>
            <Slider {...row.props} />
          </div>
        ))}
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
        The thumb hosts a 44px invisible hit zone for touch even at <code className="font-mono">sm</code> (16px) and <code className="font-mono">md</code> (20px) sizes. Disabled state removes the thumb from the tab order and applies a 50% opacity treatment to the root.
      </p>
    </div>
  )
}
