'use client'

import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectField,
} from '../../ui/select'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

// ─── Props tables ─────────────────────────────────────────────────────────────

const SELECT_PRIMITIVE_PROPS = [
  {
    name: 'value',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Controlled selected value. Omit to use uncontrolled mode with defaultValue.',
  },
  {
    name: 'defaultValue',
    type: 'string',
    default: '""',
    description: 'Initial value for uncontrolled mode. Ignored when value is provided.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    default: 'undefined',
    description: 'Fires after the user selects an option.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the entire select, including the trigger and all items.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '— (required)',
    description: 'Must contain SelectTrigger and SelectContent at minimum.',
  },
]

const SELECT_TRIGGER_PROPS = [
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Visual height of the trigger button. sm=32px, md=36px, lg=40px.',
  },
  {
    name: 'isError',
    type: 'boolean',
    default: 'false',
    description: 'Applies destructive border and focus ring; sets aria-invalid="true".',
  },
]

const SELECT_VALUE_PROPS = [
  {
    name: 'placeholder',
    type: 'string',
    default: '""',
    description: 'Shown in muted color when no value is selected.',
  },
]

const SELECT_ITEM_PROPS = [
  {
    name: 'value',
    type: 'string',
    default: '— (required)',
    description: 'The value reported to onValueChange when this option is selected.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Prevents selection and skips this item during arrow-key navigation.',
  },
  {
    name: 'leadingIcon',
    type: 'ReactNode',
    default: 'undefined',
    description: 'Icon rendered before the label. Also shown in the trigger when selected.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '— (required)',
    description: 'The visible option label.',
  },
]

const SELECT_FIELD_PROPS = [
  {
    name: 'id',
    type: 'string',
    default: '— (required)',
    description: 'Wires <label htmlFor> and trigger id. Required for accessible form usage.',
  },
  {
    name: 'label',
    type: 'string',
    default: 'undefined',
    description: 'Visible label rendered above the trigger.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: 'undefined',
    description: 'Forwarded to SelectValue.',
  },
  {
    name: 'helperText',
    type: 'string',
    default: 'undefined',
    description: 'Secondary text below the trigger. Wired to aria-describedby.',
  },
  {
    name: 'errorMessage',
    type: 'string',
    default: 'undefined',
    description: 'Error text shown when isError is true. Announced via role="alert".',
  },
  {
    name: 'isError',
    type: 'boolean',
    default: 'false',
    description: 'Triggers error border, destructive focus ring, and errorMessage display.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Shows an asterisk after the label and sets aria-required on the trigger.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the entire field.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Forwarded to SelectTrigger.',
  },
  {
    name: 'value',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Controlled value forwarded to Select root.',
  },
  {
    name: 'defaultValue',
    type: 'string | undefined',
    default: 'undefined',
    description: 'Uncontrolled initial value forwarded to Select root.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    default: 'undefined',
    description: 'Forwarded to Select root.',
  },
  {
    name: 'children',
    type: 'ReactNode',
    default: '— (required)',
    description: 'SelectItem (and optionally SelectGroup, SelectLabel, SelectSeparator) nodes.',
  },
]

// ─── Shared DoDontCard ────────────────────────────────────────────────────────

function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  return (
    <div
      className={[
        'rounded-lg p-4 text-sm',
        type === 'do'
          ? 'border-l-4 border-l-[hsl(var(--success))] bg-[hsl(var(--success)/0.06)]'
          : 'border-l-4 border-l-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.06)]',
      ].join(' ')}
    >
      <div className="flex items-baseline gap-1.5 mb-2">
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

// ─── Tab 1 — Overview ─────────────────────────────────────────────────────────

export function SelectOverviewTab() {
  const [theme, setTheme] = useState('')
  const [country, setCountry] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Basic (md)</p>
        <div className="max-w-xs">
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger aria-label="Theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">With label + helper (SelectField)</p>
        <div className="max-w-xs">
          <SelectField
            id="demo-country"
            label="Country"
            placeholder="Select country"
            helperText="We'll ship to this address."
            value={country}
            onValueChange={setCountry}
          >
            <SelectItem value="us">United States</SelectItem>
            <SelectItem value="gb">United Kingdom</SelectItem>
            <SelectItem value="de">Germany</SelectItem>
          </SelectField>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Error state</p>
        <div className="max-w-xs">
          <SelectField
            id="select-error"
            label="Plan"
            placeholder="Select plan"
            isError
            errorMessage="Please select a plan."
          >
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectField>
        </div>
      </div>
    </div>
  )
}

// ─── Tab 2 — API ──────────────────────────────────────────────────────────────

export function SelectApiTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Select</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Context root. Manages open state, selected value, and item registration. Wrap{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectTrigger</code>{' '}
          and{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectContent</code>{' '}
          inside.
        </p>
        <DocPropsTable rows={SELECT_PRIMITIVE_PROPS} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">SelectTrigger</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          The button that opens the listbox. Renders{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">role="combobox"</code>{' '}
          with full ARIA wiring. In forms, use{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectField</code>{' '}
          instead — it wires the label automatically.
        </p>
        <DocPropsTable rows={SELECT_TRIGGER_PROPS} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">SelectValue</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Renders the currently selected label inside SelectTrigger. Shows placeholder in muted color when nothing is selected.
        </p>
        <DocPropsTable rows={SELECT_VALUE_PROPS} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">SelectItem</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          One option inside{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectContent</code>.
          Renders{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">role="option"</code>{' '}
          with a check icon in the left slot when selected.
        </p>
        <DocPropsTable rows={SELECT_ITEM_PROPS} />
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">SelectLabel, SelectGroup, SelectSeparator</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectGroup</code>{' '}
          wraps a set of related items (<code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">role="group"</code>).{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectLabel</code>{' '}
          is a non-interactive heading inside a group.{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectSeparator</code>{' '}
          is a visual divider (<code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">role="separator"</code>).
        </p>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">SelectField</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Convenience wrapper for form use. Wires label, helper text, error message, and all ARIA attributes automatically. Prefer this over bare{' '}
          <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">SelectTrigger</code>{' '}
          in forms.
        </p>
        <DocPropsTable rows={SELECT_FIELD_PROPS} />
      </div>
    </div>
  )
}

// ─── Tab 3 — Usage ────────────────────────────────────────────────────────────

const DECISION_GUIDE = [
  { use: 'Select',   when: '6–30 mutually exclusive options when vertical space is constrained' },
  { use: 'Radio',    when: '2–5 options and vertical space allows — shows all choices at once' },
  { use: 'Combobox', when: '30+ options, or user needs to type/filter to find an option' },
  { use: 'Switch',   when: 'Single boolean on/off setting with immediate effect' },
]

export function SelectUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use Select for 6+ mutually exclusive options when vertical space is constrained">
            A collapsed trigger keeps forms compact. The listbox renders in a portal — it never affects surrounding layout.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Select for 2–4 options — Radio shows all choices, reducing cognitive load">
            When users can see all options at once, they decide faster. Select hides the list until the trigger is clicked.
          </DoDontCard>
          <DoDontCard type="do" title="Use SelectField in forms — it wires label, helper, error, and ARIA automatically">
            A bare SelectTrigger inside a form requires manual aria-labelledby, aria-describedby, and error wiring — SelectField handles all of it.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use bare SelectTrigger in forms — label/aria wiring is manual">
            Missing htmlFor/id pairing is an axe-core violation. SelectField prevents this entirely.
          </DoDontCard>
          <DoDontCard type="do" title="Use Combobox when users need to search or filter (30+ options)">
            Combobox adds a text input for filtering. Select has no search — scrolling through 50+ items is friction.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Select when the list has 30+ items">
            Long unfiltered lists frustrate users. If users need to find an option, Combobox is the right component.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Select vs Radio vs Combobox vs Switch</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {DECISION_GUIDE.map((row, i) => (
            <div
              key={row.use}
              className={`flex items-center gap-4 px-4 py-2 ${i < DECISION_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}
            >
              <div className="w-28 shrink-0">
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

// ─── Tab 4 — Code ─────────────────────────────────────────────────────────────

export function SelectCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic controlled"
        code={`const [theme, setTheme] = useState('system')

<Select value={theme} onValueChange={setTheme}>
  <SelectTrigger>
    <SelectValue placeholder="Select theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>`}
      />
      <DocCodeBlock
        label="Uncontrolled with defaultValue"
        code={`<Select defaultValue="system">
  <SelectTrigger>
    <SelectValue placeholder="Select theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>`}
      />
      <DocCodeBlock
        label="SelectField with error"
        code={`<SelectField
  id="plan"
  label="Plan"
  placeholder="Select plan"
  isError
  errorMessage="Please select a plan."
>
  <SelectItem value="free">Free</SelectItem>
  <SelectItem value="pro">Pro</SelectItem>
</SelectField>`}
      />
      <DocCodeBlock
        label="Grouped with separator"
        code={`<SelectField id="category" label="Category" placeholder="Choose…">
  <SelectGroup>
    <SelectLabel>Frontend</SelectLabel>
    <SelectItem value="react">React</SelectItem>
    <SelectItem value="vue">Vue</SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Backend</SelectLabel>
    <SelectItem value="node">Node.js</SelectItem>
    <SelectItem value="python">Python</SelectItem>
  </SelectGroup>
</SelectField>`}
      />
      <DocCodeBlock
        label="Disabled trigger"
        code={`<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Not available" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>`}
      />
      <DocCodeBlock
        label="Disabled individual item"
        code={`<Select defaultValue="free">
  <SelectTrigger>
    <SelectValue placeholder="Select plan" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="free">Free</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
    <SelectItem value="enterprise" disabled>
      Enterprise (contact sales)
    </SelectItem>
  </SelectContent>
</Select>`}
      />
      <DocCodeBlock
        label="Size variants (sm / md / lg)"
        code={`<Select>
  <SelectTrigger size="sm"><SelectValue placeholder="Small" /></SelectTrigger>
  <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
</Select>

<Select>
  <SelectTrigger size="md"><SelectValue placeholder="Medium (default)" /></SelectTrigger>
  <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
</Select>

<Select>
  <SelectTrigger size="lg"><SelectValue placeholder="Large" /></SelectTrigger>
  <SelectContent><SelectItem value="a">Option A</SelectItem></SelectContent>
</Select>`}
      />
      <DocCodeBlock
        label="Leading icon on items"
        code={`const FlagUS = () => <span aria-hidden="true">🇺🇸</span>
const FlagGB = () => <span aria-hidden="true">🇬🇧</span>
const FlagDE = () => <span aria-hidden="true">🇩🇪</span>

<SelectField id="country" label="Country" placeholder="Select country">
  <SelectItem value="us" leadingIcon={<FlagUS />}>United States</SelectItem>
  <SelectItem value="gb" leadingIcon={<FlagGB />}>United Kingdom</SelectItem>
  <SelectItem value="de" leadingIcon={<FlagDE />}>Germany</SelectItem>
</SelectField>`}
      />
    </div>
  )
}

// ─── Tab 5 — States ───────────────────────────────────────────────────────────

const FlagUS = () => <span aria-hidden="true">🇺🇸</span>
const FlagGB = () => <span aria-hidden="true">🇬🇧</span>
const FlagDE = () => <span aria-hidden="true">🇩🇪</span>

export function SelectStatesTab() {
  const [selectedValue, setSelectedValue] = useState('system')

  return (
    <div className="space-y-3">
      <div className="space-y-5 max-w-xs">
        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Default (no selection)</p>
          <Select>
            <SelectTrigger aria-label="Theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Default (value selected)</p>
          <Select value={selectedValue} onValueChange={setSelectedValue}>
            <SelectTrigger aria-label="Theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Size sm</p>
          <Select defaultValue="light">
            <SelectTrigger size="sm" aria-label="Theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Size lg</p>
          <Select defaultValue="dark">
            <SelectTrigger size="lg" aria-label="Theme">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Disabled</p>
          <Select disabled defaultValue="light">
            <SelectTrigger aria-label="Theme">
              <SelectValue placeholder="Not available" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Error</p>
          <Select>
            <SelectTrigger id="select-error-states" isError aria-label="Plan">
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">With leadingIcon</p>
          <Select defaultValue="us">
            <SelectTrigger aria-label="Country">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us" leadingIcon={<FlagUS />}>United States</SelectItem>
              <SelectItem value="gb" leadingIcon={<FlagGB />}>United Kingdom</SelectItem>
              <SelectItem value="de" leadingIcon={<FlagDE />}>Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">Grouped + separator</p>
          <Select defaultValue="react">
            <SelectTrigger aria-label="Framework">
              <SelectValue placeholder="Choose framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Frontend</SelectLabel>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="vue">Vue</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Backend</SelectLabel>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
        Focus is managed via real DOM focus on{' '}
        <code className="font-mono">{'<li>'}</code> elements (not aria-activedescendant).
        The listbox renders in a portal — it never clips inside overflow containers.
        Escape closes and returns focus to the trigger.
      </p>
    </div>
  )
}
