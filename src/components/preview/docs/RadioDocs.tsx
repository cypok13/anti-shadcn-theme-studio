'use client'

import { useState } from 'react'
import { RadioGroup, RadioItem } from '../../ui/radio-group'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const RADIO_GROUP_PROPS = [
  {
    name: 'value',
    type: 'string | undefined',
    default: 'undefined',
    description:
      'Controlled selected value. Omit (or pass undefined) to use uncontrolled mode with defaultValue.',
  },
  {
    name: 'defaultValue',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Initial selected value for uncontrolled mode. Ignored when value is provided.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    default: 'undefined',
    description:
      'Fires after selection changes. Receives the value of the newly selected item.',
  },
  {
    name: 'label',
    type: 'string',
    default: '— (required)',
    description:
      'Accessible group label. Rendered visually-hidden and wired to aria-labelledby on the radiogroup.',
  },
  {
    name: 'size',
    type: '"sm" | "md"',
    default: '"md"',
    description:
      'Visual size of every item in the group. The 44px label row preserves touch target across sizes.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Disables every item in the group. Individual RadioItem can also be disabled independently.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description:
      'Sets aria-required on the radiogroup. Visible asterisk goes on the parent field label.',
  },
]

const RADIO_ITEM_PROPS = [
  {
    name: 'value',
    type: 'string',
    default: '— (required)',
    description: 'The value reported via onValueChange when this item is selected.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Disables this individual item. Roving tabindex skips disabled items during arrow navigation.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '— (required)',
    description: 'The visible label rendered next to the radio control.',
  },
]

export function RadioOverviewTab() {
  const [plan, setPlan] = useState('free')
  const [billing, setBilling] = useState('monthly')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Default (md)</p>
        <RadioGroup value={plan} onValueChange={setPlan} label="Choose a plan">
          <RadioItem value="free">Free</RadioItem>
          <RadioItem value="pro">Pro</RadioItem>
          <RadioItem value="enterprise">Enterprise</RadioItem>
        </RadioGroup>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Small</p>
        <RadioGroup value={billing} onValueChange={setBilling} label="Billing cycle" size="sm">
          <RadioItem value="monthly">Monthly</RadioItem>
          <RadioItem value="yearly">Yearly (save 20%)</RadioItem>
        </RadioGroup>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Disabled group</p>
        <RadioGroup value="basic" onValueChange={() => {}} label="Disabled group" disabled>
          <RadioItem value="basic">Basic</RadioItem>
          <RadioItem value="premium">Premium</RadioItem>
        </RadioGroup>
      </div>
    </div>
  )
}

export function RadioApiTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">RadioGroup</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Wraps every <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">RadioItem</code>. Provides shared <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">role="radiogroup"</code>, roving tabindex, and arrow-key navigation.
        </p>
        <DocPropsTable rows={RADIO_GROUP_PROPS} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">RadioItem</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          One option in the group. Must be a direct child of <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">RadioGroup</code>.
        </p>
        <DocPropsTable rows={RADIO_ITEM_PROPS} />
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
  { use: 'Radio',    when: 'Mutually exclusive choice from 2+ options, one must always be selected' },
  { use: 'Checkbox', when: 'Multi-select, or a single optional toggle inside a form' },
  { use: 'Switch',   when: 'Immediate-effect on/off setting, no save button' },
  { use: 'Select',   when: '6+ options, or vertical space is constrained' },
]

export function RadioUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for mutually exclusive options">
            One choice from a small set (2–5 options). Selecting one automatically deselects the others — that is the entire point.
          </DoDontCard>
          <DoDontCard type="dont" title="Use for multi-select">
            If users may pick more than one, use Checkbox. Radio enforces single selection at the ARIA level.
          </DoDontCard>
          <DoDontCard type="do" title="Stack vertically and keep labels parallel">
            Vertical stacks scan faster than horizontal. Match grammar (&quot;Free&quot; / &quot;Pro&quot; / &quot;Enterprise&quot;), not (&quot;Free plan&quot; / &quot;Upgrade now&quot;).
          </DoDontCard>
          <DoDontCard type="dont" title="Use for 6+ options">
            Long radio lists waste vertical space and slow scanning. Switch to Select once you exceed five items.
          </DoDontCard>
          <DoDontCard type="do" title="Pre-select a sensible default">
            Always select the safest or most common choice up front. An empty group forces an extra click and increases form-abandon rate.
          </DoDontCard>
          <DoDontCard type="dont" title="Use for instant-effect settings">
            Radio implies a deferred decision (form submit). For immediate on/off effect, use Switch.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Radio vs Checkbox vs Switch vs Select</p>
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

export function RadioCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic (controlled)"
        code={`const [plan, setPlan] = useState('free')

<RadioGroup value={plan} onValueChange={setPlan} label="Choose a plan">
  <RadioItem value="free">Free</RadioItem>
  <RadioItem value="pro">Pro</RadioItem>
  <RadioItem value="enterprise">Enterprise</RadioItem>
</RadioGroup>`}
      />
      <DocCodeBlock
        label="Uncontrolled with default"
        code={`<RadioGroup defaultValue="monthly" label="Billing cycle">
  <RadioItem value="monthly">Monthly</RadioItem>
  <RadioItem value="yearly">Yearly (save 20%)</RadioItem>
</RadioGroup>`}
      />
      <DocCodeBlock
        label="One option disabled"
        code={`<RadioGroup defaultValue="free" label="Plan">
  <RadioItem value="free">Free</RadioItem>
  <RadioItem value="pro">Pro</RadioItem>
  <RadioItem value="enterprise" disabled>
    Enterprise (contact sales)
  </RadioItem>
</RadioGroup>`}
      />
      <DocCodeBlock
        label="Entire group disabled"
        code={`<RadioGroup value="basic" onValueChange={() => {}} label="Tier" disabled>
  <RadioItem value="basic">Basic</RadioItem>
  <RadioItem value="premium">Premium</RadioItem>
</RadioGroup>`}
      />
      <DocCodeBlock
        label="Required in a form"
        code={`<fieldset>
  <legend className="text-sm font-medium">
    Delivery method
    <span aria-hidden="true" className="text-[hsl(var(--destructive))]"> *</span>
  </legend>
  <RadioGroup value={method} onValueChange={setMethod} label="Delivery method" required>
    <RadioItem value="standard">Standard (3–5 days)</RadioItem>
    <RadioItem value="express">Express (next day)</RadioItem>
  </RadioGroup>
</fieldset>`}
      />
      <DocCodeBlock
        label="Size variants"
        code={`<RadioGroup defaultValue="a" label="Sample" size="sm">
  <RadioItem value="a">Small option A</RadioItem>
  <RadioItem value="b">Small option B</RadioItem>
</RadioGroup>`}
      />
    </div>
  )
}

const STATE_COLUMNS: Array<{ label: string; selectedValue: string; itemValue: string; disabledItem: boolean }> = [
  { label: 'Unchecked',    selectedValue: 'other', itemValue: 'a', disabledItem: false },
  { label: 'Checked',      selectedValue: 'a',     itemValue: 'a', disabledItem: false },
  { label: 'Disabled off', selectedValue: 'other', itemValue: 'a', disabledItem: true  },
  { label: 'Disabled on',  selectedValue: 'a',     itemValue: 'a', disabledItem: true  },
]

const SIZE_ROWS: Array<'sm' | 'md'> = ['sm', 'md']

export function RadioStatesTab() {
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
                {STATE_COLUMNS.map(({ label, selectedValue, itemValue, disabledItem }) => (
                  <td key={label} className="align-middle">
                    {/* One isolated RadioGroup per cell to keep selection state scoped */}
                    <RadioGroup value={selectedValue} onValueChange={() => {}} label={`${size}-${label}`} size={size}>
                      <RadioItem value={itemValue} disabled={disabledItem}>
                        <span className="sr-only">{label}</span>
                      </RadioItem>
                    </RadioGroup>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
        Radio is strictly single-select within a group (ARIA spec) — no <code className="font-mono">indeterminate</code>. Size tokens are <code className="font-mono">sm</code> (16px) and <code className="font-mono">md</code> (20px); the wrapping label preserves a 44px touch target at every size.
      </p>
    </div>
  )
}
