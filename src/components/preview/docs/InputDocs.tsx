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
    <section className="space-y-4">
      <div className="space-y-4 max-w-sm">
        <Field
          id="input-default"
          label="Default"
          inputProps={{ placeholder: 'Type something…' }}
        />

        <Field
          id="input-placeholder"
          label="With placeholder"
          inputProps={{ placeholder: 'you@company.com', type: 'email' }}
        />

        <Field
          id="input-value"
          label="With value"
          inputProps={{ defaultValue: 'Alex Krasnov' }}
        />

        <Field
          id="input-disabled"
          label="Disabled"
          inputProps={{ defaultValue: 'Free plan', disabled: true }}
        />

        <Field
          id="input-readonly"
          label="Read only"
          inputProps={{ defaultValue: 'read-only@example.com', readOnly: true }}
        />

        <Field
          id="input-error"
          label="Error state"
          isError
          errorMessage="Enter a valid email address"
          inputProps={{ defaultValue: 'not-an-email', type: 'email' }}
        />

        <Field
          id="input-helper"
          label="Helper text"
          helperText="As it appears on your passport"
          inputProps={{ placeholder: 'Full name' }}
        />

        <Field
          id="input-sm"
          label="Small"
          inputProps={{ placeholder: 'Small input', size: 'sm' }}
        />

        <Field
          id="input-lg"
          label="Large"
          inputProps={{ placeholder: 'Large input', size: 'lg' }}
        />

        <Field
          id="input-left-icon"
          label="With left icon"
          inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon /> }}
        />

        <Field
          id="input-right-icon"
          label="With right icon"
          inputProps={{ placeholder: 'Pick a date', rightIcon: <CalendarIcon /> }}
        />

        <Field
          id="input-both-icons"
          label="Both icons"
          inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon />, rightIcon: <XIcon /> }}
        />

        <Field
          id="input-filled"
          label="Filled variant"
          inputProps={{ placeholder: 'Filled input', variant: 'filled' }}
        />

        <Field
          id="input-filled-icon"
          label="Filled with icon"
          inputProps={{ placeholder: 'Search…', variant: 'filled', leftIcon: <SearchIcon /> }}
        />

        <Field
          id="input-error-icon"
          label="Error with icon"
          isError
          errorMessage="This field is required"
          inputProps={{ leftIcon: <SearchIcon />, defaultValue: 'invalid input' }}
        />
      </div>
    </section>
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
