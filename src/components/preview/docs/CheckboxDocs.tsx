'use client'

import { useState } from 'react'
import { Checkbox } from '../../ui/checkbox'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const CHECKBOX_PROPS = [
  {
    name: 'checked',
    type: 'boolean | "indeterminate"',
    default: 'false',
    description: 'Controlled state. Pass "indeterminate" for parent/bulk-select scenarios; component syncs input.indeterminate and sets aria-checked="mixed".',
  },
  {
    name: 'onChange',
    type: '(event: ChangeEvent<HTMLInputElement>) => void',
    default: 'undefined',
    description: 'Native change handler. Fires on every toggle including from indeterminate.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Removes from tab order. Wrap label in cursor-not-allowed opacity-50 for the full-row visual.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Passed to native input; sets aria-required="true". Parent label should render * for the visible marker.',
  },
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'Visual invalid state: destructive border + focus ring. Sets aria-invalid="true". Show only after a validation attempt, not on initial render.',
  },
  {
    name: 'errorMessage',
    type: 'string',
    default: 'undefined',
    description: 'Renders inline below the box and links via aria-describedby. Use with error={true}.',
  },
]

export function CheckboxOverviewTab() {
  const [uncheckedRow, setUncheckedRow] = useState(false)
  const [checkedRow, setCheckedRow] = useState(true)
  const [indeterminate, setIndeterminate] = useState<boolean | 'indeterminate'>('indeterminate')

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Checkbox checked={uncheckedRow} onChange={(e) => setUncheckedRow(e.target.checked)} />
        <span className="text-sm text-[hsl(var(--foreground))]">Unchecked</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Checkbox checked={checkedRow} onChange={(e) => setCheckedRow(e.target.checked)} />
        <span className="text-sm text-[hsl(var(--foreground))]">Checked</span>
      </label>
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <Checkbox
          checked={indeterminate}
          onChange={(e) => setIndeterminate(e.target.checked)}
        />
        <span className="text-sm text-[hsl(var(--foreground))]">Indeterminate</span>
      </label>
      <label className="flex items-center gap-2 select-none cursor-not-allowed opacity-50">
        <Checkbox disabled checked />
        <span className="text-sm text-[hsl(var(--foreground))]">Disabled</span>
      </label>
    </div>
  )
}

export function CheckboxApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Extends all native <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">{'<input type="checkbox">'}</code> HTML attributes via spread.
      </p>
      <DocPropsTable rows={CHECKBOX_PROPS} />
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
  { use: 'Checkbox', when: 'Independent binary toggle, form-style state' },
  { use: 'Switch',   when: 'Immediate on/off effect, system-level setting' },
  { use: 'Radio',    when: 'Mutually exclusive choice from 2+ options' },
]

export function CheckboxUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for multi-select and standalone toggles">
            Checkboxes are for independent binary choices where each option does not affect the others.
          </DoDontCard>
          <DoDontCard type="dont" title="Use for mutually-exclusive choices">
            For one-of-N, reach for a RadioGroup. Checkboxes suggest independent options.
          </DoDontCard>
          <DoDontCard type="do" title="Reserve indeterminate for parent/bulk state">
            Valid only when it represents partial child selection a user cannot directly assign.
          </DoDontCard>
          <DoDontCard type="dont" title="Set indeterminate on leaf checkboxes">
            A single terminal option is always checked or unchecked. Indeterminate here is a lie to the user.
          </DoDontCard>
          <DoDontCard type="do" title="Keep required and error independent">
            <code className="font-mono">required</code> announces expectation. <code className="font-mono">error</code> shows the user failed it. Don&apos;t style required fields red preemptively.
          </DoDontCard>
          <DoDontCard type="dont" title="Use a checkbox for immediate actions">
            If the toggle should take effect instantly (notifications on/off), that is a Switch, not a Checkbox.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Checkbox vs Switch vs Radio</p>
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

export function CheckboxCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic (controlled)"
        code={`const [accepted, setAccepted] = useState(false)

<label className="flex items-center gap-2">
  <Checkbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
  <span>I accept the terms</span>
</label>`}
      />
      <DocCodeBlock
        label="Indeterminate (bulk parent)"
        code={`const allSelected = children.every(c => c.selected)
const someSelected = children.some(c => c.selected)
const parentChecked = allSelected ? true : someSelected ? "indeterminate" : false

<Checkbox
  checked={parentChecked}
  onChange={(e) => toggleAll(e.target.checked)}
/>`}
      />
      <DocCodeBlock
        label="Required in a form"
        code={`<label className="flex items-center gap-2">
  <Checkbox required />
  <span>
    Subscribe to newsletter
    <span aria-hidden="true" className="text-[hsl(var(--destructive))]"> *</span>
  </span>
</label>`}
      />
      <DocCodeBlock
        label="Error with inline message"
        code={`<Checkbox
  error
  errorMessage="You must accept to continue"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>`}
      />
      <DocCodeBlock
        label="Disabled (with checked state)"
        code={`<label className="flex items-center gap-2 cursor-not-allowed opacity-50">
  <Checkbox disabled checked />
  <span>Locked preference</span>
</label>`}
      />
      <DocCodeBlock
        label="Uncontrolled with defaultChecked"
        code={`<form onSubmit={handleSubmit}>
  <label className="flex items-center gap-2">
    <Checkbox name="remember" defaultChecked />
    <span>Remember me</span>
  </label>
</form>`}
      />
    </div>
  )
}

const STATE_COLUMNS: Array<{ label: string; props: Record<string, unknown> }> = [
  { label: 'Unchecked',     props: { checked: false } },
  { label: 'Checked',       props: { checked: true } },
  { label: 'Indeterminate', props: { checked: 'indeterminate' } },
  { label: 'Disabled',      props: { disabled: true, checked: true } },
]

export function CheckboxStatesTab() {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-x-4 border-spacing-y-3">
        <thead>
          <tr>
            <th className="w-28" />
            {STATE_COLUMNS.map(({ label }) => (
              <th key={label} className="text-xs font-normal text-[hsl(var(--muted-foreground))] pb-2 text-left">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-xs text-[hsl(var(--muted-foreground))] pr-4 align-middle">Default</td>
            {STATE_COLUMNS.map(({ label, props }) => (
              <td key={label} className="align-middle">
                <Checkbox {...props} readOnly />
              </td>
            ))}
          </tr>
          <tr>
            <td className="text-xs text-[hsl(var(--muted-foreground))] pr-4 align-middle">Required</td>
            {STATE_COLUMNS.map(({ label, props }) => (
              <td key={label} className="align-middle">
                <span className="inline-flex items-center gap-1">
                  <Checkbox {...props} required readOnly />
                  <span aria-hidden="true" className="text-xs text-[hsl(var(--destructive))]">*</span>
                </span>
              </td>
            ))}
          </tr>
          <tr>
            <td className="text-xs text-[hsl(var(--muted-foreground))] pr-4 align-top pt-1">Error</td>
            {STATE_COLUMNS.map(({ label, props }) => (
              <td key={label} className="align-top">
                <Checkbox
                  {...props}
                  error
                  errorMessage={label === 'Unchecked' ? 'Required field' : undefined}
                  readOnly
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
