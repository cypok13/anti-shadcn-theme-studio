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

export function InputUsageTab() {
  return (
    <div className="space-y-8 max-w-sm">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Login form</p>
        <div className="space-y-3">
          <Field id="usage-email" label="Email" inputProps={{ placeholder: 'you@example.com', type: 'email' }} />
          <Field id="usage-pass"  label="Password" inputProps={{ placeholder: '••••••••', type: 'password' }} />
        </div>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Search bar</p>
        <Field
          id="usage-search"
          label="Search"
          inputProps={{ placeholder: 'Search components…', leftIcon: <SearchIcon /> }}
        />
      </div>
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Validation error</p>
        <Field
          id="usage-err"
          label="Username"
          isError
          errorMessage="Username must be at least 3 characters"
          inputProps={{ defaultValue: 'ab' }}
        />
      </div>
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
