'use client'

import { useState } from 'react'
import { Switch } from '../../ui/switch'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const SWITCH_PROPS = [
  {
    name: 'checked',
    type: 'boolean | undefined',
    default: 'undefined',
    description:
      'Controlled checked state. Omit (or pass undefined) to use uncontrolled mode with defaultChecked.',
  },
  {
    name: 'defaultChecked',
    type: 'boolean',
    default: 'false',
    description: 'Initial state for uncontrolled mode. Ignored when checked is provided.',
  },
  {
    name: 'onCheckedChange',
    type: '(checked: boolean) => void',
    default: 'undefined',
    description:
      'Fires after the user toggles. Use this, not native onChange — the underlying button has no native change event.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description:
      'Visual size of track and thumb. Min 44px touch target is provided by the wrapping <label> row.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Removes from tab order. Wrap label in cursor-not-allowed opacity-50 for the full-row visual.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description:
      'Sets aria-required="true". The visible asterisk goes on the parent label, not the toggle itself.',
  },
]

export function SwitchOverviewTab() {
  const [unchecked, setUnchecked] = useState(false)
  const [checked, setChecked] = useState(true)
  const [smOn, setSmOn] = useState(false)
  const [lgOn, setLgOn] = useState(true)

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Switch checked={unchecked} onCheckedChange={setUnchecked} />
        <span className="text-sm text-[hsl(var(--foreground))]">Unchecked</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span className="text-sm text-[hsl(var(--foreground))]">Checked</span>
      </label>
      <label className="flex items-center gap-2 select-none cursor-not-allowed opacity-50">
        <Switch disabled />
        <span className="text-sm text-[hsl(var(--foreground))]">Disabled (off)</span>
      </label>
      <label className="flex items-center gap-2 select-none cursor-not-allowed opacity-50">
        <Switch disabled defaultChecked />
        <span className="text-sm text-[hsl(var(--foreground))]">Disabled (on)</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Switch size="sm" checked={smOn} onCheckedChange={setSmOn} />
        <span className="text-sm text-[hsl(var(--foreground))]">Small</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Switch size="lg" checked={lgOn} onCheckedChange={setLgOn} />
        <span className="text-sm text-[hsl(var(--foreground))]">Large</span>
      </label>
    </div>
  )
}

export function SwitchApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Extends all <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">{'<button>'}</code> HTML attributes via spread, except <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">onChange</code> (use <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">onCheckedChange</code> for the toggle event).
      </p>
      <DocPropsTable rows={SWITCH_PROPS} />
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
  { use: 'Switch',   when: 'Immediate on/off effect, system-level setting' },
  { use: 'Checkbox', when: 'Form-style state, deferred save, multi-select' },
  { use: 'Radio',    when: 'Mutually exclusive choice from 2+ options' },
]

export function SwitchUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for immediate-effect system settings">
            Switch toggles take effect right away. No save button needed (notifications, dark mode, autoplay).
          </DoDontCard>
          <DoDontCard type="dont" title="Use for form submissions">
            If a save or submit button is required, use Checkbox. Switches imply instant action.
          </DoDontCard>
          <DoDontCard type="do" title="Wrap the entire row in <label> for full hit target">
            Click anywhere on the row toggles state. Track-only click zones fail mobile and frustrate users.
          </DoDontCard>
          <DoDontCard type="dont" title="Change the label text on toggle">
            ARIA APG: the label stays constant. State is announced via <code className="font-mono">aria-checked</code>, not by swapping &quot;On&quot;/&quot;Off&quot; in the visible text.
          </DoDontCard>
          <DoDontCard type="do" title="Use hsl(var(--primary-foreground)) for the thumb">
            Thumb must contrast with both checked and unchecked tracks. Hardcoded white/black breaks dark themes (Error Log E-008).
          </DoDontCard>
          <DoDontCard type="dont" title="Use Switch for one-of-many choice">
            Mutually exclusive options need RadioGroup. Switches imply independent toggles.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Switch vs Checkbox vs Radio</p>
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

export function SwitchCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic (controlled)"
        code={`const [enabled, setEnabled] = useState(false)

<label className="flex items-center gap-2 cursor-pointer">
  <Switch checked={enabled} onCheckedChange={setEnabled} />
  <span>Enable notifications</span>
</label>`}
      />
      <DocCodeBlock
        label="With description"
        code={`<label className="flex items-center justify-between gap-4 cursor-pointer">
  <div>
    <p className="text-sm font-medium">Dark mode</p>
    <p className="text-xs text-muted-foreground">Switch between themes</p>
  </div>
  <Switch checked={dark} onCheckedChange={setDark} />
</label>`}
      />
      <DocCodeBlock
        label="Disabled (off)"
        code={`<label className="flex items-center gap-2 cursor-not-allowed opacity-50">
  <Switch disabled />
  <span>Unavailable option</span>
</label>`}
      />
      <DocCodeBlock
        label="Required in a form"
        code={`<label className="flex items-center gap-2 cursor-pointer">
  <Switch required checked={agreed} onCheckedChange={setAgreed} />
  <span>
    I agree to the terms
    <span aria-hidden="true" className="text-[hsl(var(--destructive))]"> *</span>
  </span>
</label>`}
      />
      <DocCodeBlock
        label="Size variants"
        code={`<div className="flex items-center gap-4">
  <Switch size="sm" defaultChecked />
  <Switch size="md" defaultChecked />
  <Switch size="lg" defaultChecked />
</div>`}
      />
    </div>
  )
}

const STATE_COLUMNS: Array<{ label: string; props: Record<string, unknown> }> = [
  { label: 'Unchecked',     props: {} },
  { label: 'Checked',       props: { defaultChecked: true } },
  { label: 'Disabled off',  props: { disabled: true } },
  { label: 'Disabled on',   props: { disabled: true, defaultChecked: true } },
]

const SIZE_ROWS: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg']

export function SwitchStatesTab() {
  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="border-separate border-spacing-x-4 border-spacing-y-3">
          <thead>
            <tr>
              <th className="w-20" />
              {STATE_COLUMNS.map(({ label }) => (
                <th key={label} className="text-xs font-normal text-[hsl(var(--muted-foreground))] pb-2 text-left">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_ROWS.map((size) => (
              <tr key={size}>
                <td className="text-xs text-[hsl(var(--muted-foreground))] pr-4 align-middle font-mono">{size}</td>
                {STATE_COLUMNS.map(({ label, props }) => (
                  <td key={label} className="align-middle">
                    <Switch size={size} {...props} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
        Switch is strictly binary (ARIA spec) — no <code className="font-mono">indeterminate</code>. There is no built-in <code className="font-mono">error</code> state; field-level validation is handled by the surrounding form wrapper.
      </p>
    </div>
  )
}
