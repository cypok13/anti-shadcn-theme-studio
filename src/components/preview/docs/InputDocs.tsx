'use client'

import { Field } from '../../ui/input'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const INPUT_PROPS = [
  {
    name: 'id',
    type: 'string',
    required: true,
    description: 'Links the label to the input via htmlFor/id. Required for accessibility.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Visible label rendered above the input.',
  },
  {
    name: 'inputProps.placeholder',
    type: 'string',
    description: 'Placeholder text shown when input is empty.',
  },
  {
    name: 'inputProps.type',
    type: 'string',
    default: '"text"',
    description: 'Native input type (text, email, password, number, etc.).',
  },
  {
    name: 'inputProps.disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the input and removes it from the tab order.',
  },
  {
    name: 'inputProps.readOnly',
    type: 'boolean',
    default: 'false',
    description: 'Makes the input read-only — focusable but not editable.',
  },
  {
    name: 'inputProps.size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Controls the height and padding of the input.',
  },
  {
    name: 'inputProps.variant',
    type: '"default" | "filled"',
    default: '"default"',
    description: 'Visual style. "filled" uses a muted background instead of a border.',
  },
  {
    name: 'inputProps.leftIcon',
    type: 'ReactNode',
    description: 'Icon rendered inside the input on the left side.',
  },
  {
    name: 'inputProps.rightIcon',
    type: 'ReactNode',
    description: 'Icon rendered inside the input on the right side.',
  },
  {
    name: 'isError',
    type: 'boolean',
    default: 'false',
    description: 'Applies error styling to the input and shows errorMessage below.',
  },
  {
    name: 'errorMessage',
    type: 'string',
    description: 'Error text shown below the input when isError is true.',
  },
  {
    name: 'helperText',
    type: 'string',
    description: 'Helper text shown below the input in normal (non-error) state.',
  },
]

export function InputOverviewTab() {
  return (
    <div className="space-y-4 max-w-sm">
      <Field
        id="input-ov-default"
        label="Default"
        inputProps={{ placeholder: 'Type something…' }}
      />
      <Field
        id="input-ov-icon"
        label="With icon"
        inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon /> }}
      />
      <Field
        id="input-ov-helper"
        label="With helper text"
        helperText="As it appears on your passport"
        inputProps={{ placeholder: 'Full name' }}
      />
      <Field
        id="input-ov-error"
        label="Error state"
        isError
        errorMessage="Enter a valid email address"
        inputProps={{ defaultValue: 'not-an-email', type: 'email' }}
      />
    </div>
  )
}

export function InputStatesTab() {
  return (
    <div className="space-y-4 max-w-sm">
      <Field id="input-st-default"   label="Default"      inputProps={{ placeholder: 'Type something…' }} />
      <Field id="input-st-value"     label="With value"   inputProps={{ defaultValue: 'Alex Krasnov' }} />
      <Field id="input-st-disabled"  label="Disabled"     inputProps={{ defaultValue: 'Free plan', disabled: true }} />
      <Field id="input-st-readonly"  label="Read only"    inputProps={{ defaultValue: 'read-only@example.com', readOnly: true }} />
      <Field id="input-st-error"     label="Error"        isError errorMessage="Enter a valid email address" inputProps={{ defaultValue: 'not-an-email', type: 'email' }} />
      <Field id="input-st-helper"    label="Helper text"  helperText="As it appears on your passport" inputProps={{ placeholder: 'Full name' }} />
      <Field id="input-st-sm"        label="Size — sm"    inputProps={{ placeholder: 'Small', size: 'sm' }} />
      <Field id="input-st-md"        label="Size — md"    inputProps={{ placeholder: 'Medium (default)' }} />
      <Field id="input-st-lg"        label="Size — lg"    inputProps={{ placeholder: 'Large', size: 'lg' }} />
      <Field id="input-st-left"      label="Left icon"    inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon /> }} />
      <Field id="input-st-right"     label="Right icon"   inputProps={{ placeholder: 'Pick a date', rightIcon: <CalendarIcon /> }} />
      <Field id="input-st-both"      label="Both icons"   inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon />, rightIcon: <XIcon /> }} />
      <Field id="input-st-filled"    label="Filled"       inputProps={{ placeholder: 'Filled input', variant: 'filled' }} />
      <Field id="input-st-filled-ic" label="Filled + icon" inputProps={{ placeholder: 'Search…', variant: 'filled', leftIcon: <SearchIcon /> }} />
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

const STATE_GUIDE = [
  { state: 'default',    when: 'Editable form field — standard case' },
  { state: 'disabled',   when: 'Field is permanently or conditionally unavailable — removed from tab order' },
  { state: 'readOnly',   when: 'Value shown but not editable — stays in tab order, submitted with form' },
  { state: 'isError',    when: 'After validation failure — pair with errorMessage' },
  { state: 'helperText', when: 'Clarify expected format before the user types' },
]

export function InputUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Always pair input with a label">
            Every <code className="font-mono">Field</code> must have a visible label. Use <code className="font-mono">id</code> + <code className="font-mono">htmlFor</code> to link them — orphan inputs are a critical accessibility violation.
          </DoDontCard>
          <DoDontCard type="dont" title="Use placeholder as a label">
            Placeholder disappears on focus. Screen readers announce it inconsistently. It is hint text, not a label.
          </DoDontCard>
          <DoDontCard type="do" title="Show error after submission or blur">
            Trigger <code className="font-mono">isError</code> after the user has had a chance to complete the field — not while they are still typing.
          </DoDontCard>
          <DoDontCard type="dont" title="Use disabled when readOnly is correct">
            <code className="font-mono">disabled</code> removes the field from tab order and form submission. If the value must be submitted or readable, use <code className="font-mono">readOnly</code>.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">State decision guide</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {STATE_GUIDE.map((row, i) => (
            <div key={row.state} className={`flex items-center gap-4 px-4 py-2 ${i < STATE_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}>
              <code className="font-mono text-xs text-[hsl(var(--primary))] w-28 shrink-0">{row.state}</code>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function InputApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">Field</code> wraps{' '}
        <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">Input</code>{' '}
        with a label, helper text, and error message. Use <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">Input</code> standalone when you need full control over layout.
      </p>
      <DocPropsTable rows={INPUT_PROPS} />
    </div>
  )
}

export function InputCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Basic Field"
        code={`<Field
  id="email"
  label="Email address"
  inputProps={{ placeholder: 'you@example.com', type: 'email' }}
/>`}
      />
      <DocCodeBlock
        label="With error state"
        code={`<Field
  id="email"
  label="Email address"
  isError
  errorMessage="Enter a valid email address"
  inputProps={{ defaultValue: 'not-an-email', type: 'email' }}
/>`}
      />
      <DocCodeBlock
        label="With icons"
        code={`<Field
  id="search"
  label="Search"
  inputProps={{
    placeholder: 'Search…',
    leftIcon: <SearchIcon />,
    rightIcon: <ClearIcon />,
  }}
/>`}
      />
      <DocCodeBlock
        label="Standalone Input"
        code={`<Input
  id="amount"
  placeholder="0.00"
  size="lg"
  variant="filled"
/>`}
      />
    </div>
  )
}
