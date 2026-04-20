'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Search, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Switch } from '../ui/switch'
import { RadioGroup, RadioItem } from '../ui/radio-group'
import { CalendarCard } from './cards/CalendarCard'
import { Field, Input } from '../ui/input'
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectField,
} from '../ui/select'

const StatsCard = dynamic(() => import('./cards/StatsCard').then(m => ({ default: m.StatsCard })), { ssr: false })
const ActivityGoalCard = dynamic(() => import('./cards/ActivityGoalCard').then(m => ({ default: m.ActivityGoalCard })), { ssr: false })
const ExerciseMinutesCard = dynamic(() => import('./cards/ExerciseMinutesCard').then(m => ({ default: m.ExerciseMinutesCard })), { ssr: false })
const CreateAccountCard = dynamic(() => import('./cards/CreateAccountCard').then(m => ({ default: m.CreateAccountCard })), { ssr: false })
const DatePickerCard = dynamic(() => import('./cards/DatePickerCard').then(m => ({ default: m.DatePickerCard })), { ssr: false })

interface ComponentGalleryProps {
  activeTab?: string
}

export function ComponentGallery({ activeTab = 'components' }: ComponentGalleryProps) {
  return (
    <div className="h-full overflow-y-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {activeTab === 'components' && <ComponentsTab />}
      {activeTab === 'cards' && <CardsTab />}
      {activeTab === 'typography' && <TypographyTab />}
    </div>
  )
}


const sectionHeading =
  'text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3'

function CheckboxDemo() {
  const [checked, setChecked] = useState({ a: true, b: false })
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Checkbox</h4>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox checked={checked.a} onChange={() => setChecked(p => ({ ...p, a: !p.a }))} />
          <span className="text-sm text-[hsl(var(--foreground))]">Checked</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox checked={checked.b} onChange={() => setChecked(p => ({ ...p, b: !p.b }))} />
          <span className="text-sm text-[hsl(var(--foreground))]">Unchecked</span>
        </label>
        <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-50">
          <Checkbox checked disabled />
          <span className="text-sm text-[hsl(var(--foreground))]">Disabled checked</span>
        </label>
        <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-50">
          <Checkbox checked={false} disabled />
          <span className="text-sm text-[hsl(var(--foreground))]">Disabled unchecked</span>
        </label>
      </div>
    </section>
  )
}

function SwitchDemo() {
  const [unchecked, setUnchecked] = useState(false)
  const [checked, setChecked] = useState(true)
  const [sm, setSm] = useState(false)
  const [lg, setLg] = useState(false)
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Switch</h4>
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch checked={unchecked} onCheckedChange={setUnchecked} />
          <span className="text-sm text-[hsl(var(--foreground))]">Unchecked</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch checked={checked} onCheckedChange={setChecked} />
          <span className="text-sm text-[hsl(var(--foreground))]">Checked</span>
        </label>
        <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-50">
          <Switch disabled />
          <span className="text-sm text-[hsl(var(--foreground))]">Disabled (off)</span>
        </label>
        <label className="flex items-center gap-2 cursor-not-allowed select-none opacity-50">
          <Switch disabled defaultChecked />
          <span className="text-sm text-[hsl(var(--foreground))]">Disabled (on)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch size="sm" checked={sm} onCheckedChange={setSm} />
          <span className="text-sm text-[hsl(var(--foreground))]">Small</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Switch size="lg" checked={lg} onCheckedChange={setLg} />
          <span className="text-sm text-[hsl(var(--foreground))]">Large</span>
        </label>
      </div>
    </section>
  )
}

function RadioDemo() {
  const [plan, setPlan] = useState('free')
  const [planSm, setPlanSm] = useState('monthly')

  return (
    <section className="space-y-4">
      <h4 className={sectionHeading}>Radio</h4>

      {/* Group 1: md size, "Pro" pre-selected, one disabled item */}
      <RadioGroup value={plan} onValueChange={setPlan} label="Choose a plan">
        <RadioItem value="free">Free</RadioItem>
        <RadioItem value="pro">Pro</RadioItem>
        <RadioItem value="enterprise" disabled>Enterprise (contact sales)</RadioItem>
      </RadioGroup>

      {/* Group 2: entire group disabled */}
      <RadioGroup value="basic" onValueChange={() => {}} label="Disabled group" disabled>
        <RadioItem value="basic">Basic</RadioItem>
        <RadioItem value="premium">Premium</RadioItem>
      </RadioGroup>

      {/* Group 3: size sm */}
      <RadioGroup value={planSm} onValueChange={setPlanSm} label="Billing cycle" size="sm">
        <RadioItem value="monthly">Monthly</RadioItem>
        <RadioItem value="yearly">Yearly</RadioItem>
      </RadioGroup>
    </section>
  )
}

function TabsDemo() {
  const [active, setActive] = useState('account')
  const tabs = ['account', 'password', 'notifications']
  const content: Record<string, string> = {
    account: 'Manage your account settings and preferences.',
    password: 'Change your password and security settings.',
    notifications: 'Configure how you receive notifications.',
  }
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Tabs</h4>
      <div className="max-w-sm">
        <div className="flex rounded-[var(--radius)] bg-[hsl(var(--muted))] p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={[
                'cursor-pointer flex-1 px-2 py-1 text-xs rounded-[calc(var(--radius)-2px)] transition-colors capitalize',
                active === tab
                  ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm font-medium'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              ].join(' ')}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-3 p-3 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{content[active]}</p>
        </div>
      </div>
    </section>
  )
}

const CircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8" />
  </svg>
)

const DotIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
)

const SquareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
)

function SelectDemo() {
  return (
    <section className="space-y-6">
      <h4 className={sectionHeading}>Select</h4>

      {/* 1. Sizes */}
      <div className="space-y-2">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Sizes</p>
        <div className="flex flex-col gap-3 max-w-xs">
          <SelectField id="select-sm" label="Small" placeholder="Select option…" size="sm">
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectField>
          <SelectField id="select-md" label="Medium" placeholder="Select option…" size="md">
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectField>
          <SelectField id="select-lg" label="Large" placeholder="Select option…" size="lg">
            <SelectItem value="a">Option A</SelectItem>
            <SelectItem value="b">Option B</SelectItem>
            <SelectItem value="c">Option C</SelectItem>
          </SelectField>
        </div>
      </div>

      {/* 2. With value */}
      <div className="max-w-xs">
        <SelectField id="select-value" label="With value" defaultValue="frontend" size="md">
          <SelectItem value="design">Design Engineer</SelectItem>
          <SelectItem value="frontend">Frontend Developer</SelectItem>
          <SelectItem value="fullstack">Full Stack Developer</SelectItem>
        </SelectField>
      </div>

      {/* 3. Disabled */}
      <div className="max-w-xs">
        <SelectField id="select-disabled" label="Disabled" placeholder="Not available" size="md" disabled>
          <SelectItem value="a">Option A</SelectItem>
        </SelectField>
      </div>

      {/* 4. Error */}
      <div className="max-w-xs">
        <SelectField
          id="select-error"
          label="Error"
          placeholder="Select an option…"
          size="md"
          isError
          errorMessage="Please select an option"
        >
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
        </SelectField>
      </div>

      {/* 5. With helper text */}
      <div className="max-w-xs">
        <SelectField
          id="select-helper"
          label="With helper text"
          placeholder="Select option…"
          size="md"
          helperText="Choose your preferred option"
        >
          <SelectItem value="a">Option A</SelectItem>
          <SelectItem value="b">Option B</SelectItem>
          <SelectItem value="c">Option C</SelectItem>
        </SelectField>
      </div>

      {/* 6. Grouped options */}
      <div className="max-w-xs">
        <SelectField id="select-grouped" label="Grouped" placeholder="Choose…" size="md">
          <SelectGroup>
            <SelectLabel>Colors</SelectLabel>
            <SelectItem value="red">Red</SelectItem>
            <SelectItem value="blue">Blue</SelectItem>
            <SelectItem value="green">Green</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Sizes</SelectLabel>
            <SelectItem value="xs">Extra Small</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="md">Medium</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
          </SelectGroup>
        </SelectField>
      </div>

      {/* 7. Items with icons */}
      <div className="max-w-xs">
        <SelectField id="select-icons" label="Items with icons" placeholder="Choose shape…" size="md">
          <SelectItem value="circle" leadingIcon={<CircleIcon />}>Circle</SelectItem>
          <SelectItem value="dot" leadingIcon={<DotIcon />}>Dot</SelectItem>
          <SelectItem value="square" leadingIcon={<SquareIcon />}>Square</SelectItem>
        </SelectField>
      </div>

      {/* 8. Long list (scroll) */}
      <div className="max-w-xs">
        <SelectField id="select-long" label="Long list" placeholder="Pick a country…" size="md">
          <SelectItem value="ar">Argentina</SelectItem>
          <SelectItem value="au">Australia</SelectItem>
          <SelectItem value="br">Brazil</SelectItem>
          <SelectItem value="ca">Canada</SelectItem>
          <SelectItem value="cn">China</SelectItem>
          <SelectItem value="fr">France</SelectItem>
          <SelectItem value="de">Germany</SelectItem>
          <SelectItem value="in">India</SelectItem>
          <SelectItem value="it">Italy</SelectItem>
          <SelectItem value="jp">Japan</SelectItem>
          <SelectItem value="mx">Mexico</SelectItem>
          <SelectItem value="us">United States</SelectItem>
        </SelectField>
      </div>
    </section>
  )
}

function ButtonsDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadingClick = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Buttons</h4>

      {/* Sizes */}
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-wrap gap-2 items-center">
          {(['default', 'secondary', 'outline', 'ghost', 'destructive'] as const).map((variant) => (
            <Button key={variant} variant={variant} size={size}>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </Button>
          ))}
        </div>
      ))}

      {/* Extra variants */}
      <div className="flex flex-wrap gap-2 items-center pt-1">
        <Button variant="link">Link variant</Button>
        <Button size="icon" aria-label="Search">
          <Search size={16} aria-hidden="true" />
        </Button>
        <Button variant="destructive" size="icon" aria-label="Delete">
          <Trash2 size={16} aria-hidden="true" />
        </Button>
      </div>

      {/* States */}
      <div className="flex flex-wrap gap-2 items-center pt-1">
        {/* native disabled — убирает из tab order */}
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
        {/* aria-disabled — остаётся в tab order, объясним почему */}
        <Button aria-disabled="true" title="Заполните форму">
          aria-disabled
        </Button>
        {/* loading */}
        <Button isLoading={isLoading} onClick={handleLoadingClick}>
          {isLoading ? null : 'Click to load'}
        </Button>
        <Button variant="outline" isLoading>
          Loading…
        </Button>
      </div>

      {/* Icon + text */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button>
          <Search size={16} aria-hidden="true" />
          Search
        </Button>
        <Button variant="destructive">
          <Trash2 size={16} aria-hidden="true" />
          Delete
        </Button>
        <Button variant="outline">
          <Loader2 size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Processing
        </Button>
      </div>
    </section>
  )
}

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

function InputDemo() {
  return (
    <section className="space-y-4">
      <h4 className={sectionHeading}>Input</h4>
      <div className="space-y-4 max-w-sm">
        {/* Default — interactive */}
        <Field
          id="input-default"
          label="Default"
          inputProps={{ placeholder: 'Type something…' }}
        />

        {/* With placeholder */}
        <Field
          id="input-placeholder"
          label="With placeholder"
          inputProps={{ placeholder: 'you@company.com', type: 'email' }}
        />

        {/* With pre-filled value */}
        <Field
          id="input-value"
          label="With value"
          inputProps={{ defaultValue: 'Alex Krasnov' }}
        />

        {/* Disabled */}
        <Field
          id="input-disabled"
          label="Disabled"
          inputProps={{ defaultValue: 'Free plan', disabled: true }}
        />

        {/* Read only */}
        <Field
          id="input-readonly"
          label="Read only"
          inputProps={{ defaultValue: 'read-only@example.com', readOnly: true }}
        />

        {/* Error state */}
        <Field
          id="input-error"
          label="Error state"
          isError
          errorMessage="Enter a valid email address"
          inputProps={{ defaultValue: 'not-an-email', type: 'email' }}
        />

        {/* With helper text */}
        <Field
          id="input-helper"
          label="Helper text"
          helperText="As it appears on your passport"
          inputProps={{ placeholder: 'Full name' }}
        />

        {/* Size sm */}
        <Field
          id="input-sm"
          label="Small"
          inputProps={{ placeholder: 'Small input', size: 'sm' }}
        />

        {/* Size lg */}
        <Field
          id="input-lg"
          label="Large"
          inputProps={{ placeholder: 'Large input', size: 'lg' }}
        />

        {/* With left icon */}
        <Field
          id="input-left-icon"
          label="With left icon"
          inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon /> }}
        />

        {/* With right icon */}
        <Field
          id="input-right-icon"
          label="With right icon"
          inputProps={{ placeholder: 'Pick a date', rightIcon: <CalendarIcon /> }}
        />

        {/* Both icons */}
        <Field
          id="input-both-icons"
          label="Both icons"
          inputProps={{ placeholder: 'Search…', leftIcon: <SearchIcon />, rightIcon: <XIcon /> }}
        />

        {/* Filled variant */}
        <Field
          id="input-filled"
          label="Filled variant"
          inputProps={{ placeholder: 'Filled input', variant: 'filled' }}
        />

        {/* Filled with icon */}
        <Field
          id="input-filled-icon"
          label="Filled with icon"
          inputProps={{ placeholder: 'Search…', variant: 'filled', leftIcon: <SearchIcon /> }}
        />

        {/* Error with icon */}
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

function ComponentsTab() {
  return (
    <div className="p-6 space-y-8">
      {/* Section 1 — Buttons */}
      <ButtonsDemo />

      {/* Section 2 — Inputs */}
      <InputDemo />

      {/* Section 3 — Badges */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Badges</h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2.5 py-0.5 text-xs font-medium cursor-pointer select-none">
            Primary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-2.5 py-0.5 text-xs font-medium cursor-pointer select-none">
            Secondary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-transparent px-2.5 py-0.5 text-xs font-medium cursor-pointer select-none">
            Outline
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))] px-2.5 py-0.5 text-xs font-medium border border-[hsl(var(--success)/0.3)] cursor-pointer select-none">Success</span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning))] px-2.5 py-0.5 text-xs font-medium border border-[hsl(var(--warning)/0.3)] cursor-pointer select-none">Warning</span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] px-2.5 py-0.5 text-xs font-medium border border-[hsl(var(--destructive)/0.3)] cursor-pointer select-none">Destructive</span>
        </div>
      </section>

      {/* Section 4 — Alerts */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Alerts</h4>
        <div className="space-y-3 max-w-sm">
          <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3">
            <p className="text-sm font-bold text-[hsl(var(--foreground))]">Heads up</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              You can change your email address in account settings.
            </p>
          </div>
          <div className="rounded-[var(--radius)] border border-[hsl(var(--destructive))] bg-[hsl(var(--destructive)/0.1)] px-4 py-3">
            <p className="text-sm font-bold text-[hsl(var(--destructive))]">Error</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Your session has expired. Please sign in again.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5 — Table */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Table</h4>
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] overflow-hidden max-w-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="text-left py-2 px-3 font-medium text-[hsl(var(--muted-foreground))]">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                <td className="py-2 px-3">Alice</td>
                <td className="py-2 px-3 text-[hsl(var(--accent-foreground))]">Active</td>
                <td className="py-2 px-3">$240</td>
              </tr>
              <tr className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                <td className="py-2 px-3">Bob</td>
                <td className="py-2 px-3 text-[hsl(var(--muted-foreground))]">Pending</td>
                <td className="py-2 px-3">$180</td>
              </tr>
              <tr className="hover:bg-[hsl(var(--muted)/0.5)] transition-colors">
                <td className="py-2 px-3">Carol</td>
                <td className="py-2 px-3 text-[hsl(var(--muted-foreground))]">Inactive</td>
                <td className="py-2 px-3">$320</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 6 — Separator */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Separator</h4>
        <div className="space-y-3 max-w-sm">
          <div className="h-px w-full bg-[hsl(var(--border))]" />
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
            <span className="text-xs text-[hsl(var(--muted-foreground))]">or continue with</span>
            <div className="h-px flex-1 bg-[hsl(var(--border))]" />
          </div>
        </div>
      </section>

      {/* Section 7 — Avatar */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Avatar</h4>
        <div className="flex items-end gap-3">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--muted-foreground))]">AK</div>
          <div className="w-10 h-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-sm font-semibold text-[hsl(var(--primary-foreground))]">JD</div>
          <div className="w-14 h-14 rounded-full bg-[hsl(var(--accent))] flex items-center justify-center text-lg font-semibold text-[hsl(var(--accent-foreground))]">MR</div>
          <div className="flex -space-x-2 ml-2">
            {['AK', 'JD', 'MR', '+4'].map((label, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[hsl(var(--background))] bg-[hsl(var(--muted))] flex items-center justify-center text-xs font-medium text-[hsl(var(--foreground))]">
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Progress */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Progress</h4>
        <div className="space-y-3 max-w-sm">
          {[25, 60, 85].map((pct) => (
            <div key={pct}>
              <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))] mb-1">
                <span>Progress</span><span>{pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))]">
                <div className="h-2 rounded-full bg-[hsl(var(--primary))] transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 9 — Checkbox */}
      <CheckboxDemo />

      {/* Section 10 — Switch */}
      <SwitchDemo />

      {/* Section 11 — Radio */}
      <RadioDemo />

      {/* Section 12 — Tabs */}
      <TabsDemo />

      {/* Section 13 — Select */}
      <SelectDemo />
    </div>
  )
}

function CookieSettingsCard() {
  const [prefs, setPrefs] = useState({ functional: true, analytics: false })
  const toggle = (key: keyof typeof prefs) => setPrefs(p => ({ ...p, [key]: !p[key] }))
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
      <h3 className="font-semibold text-base mb-1">Cookie Settings</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
        Manage your cookie preferences.
      </p>
      <div className="space-y-3">
        {(Object.entries(prefs) as [keyof typeof prefs, boolean][]).map(([key, val]) => (
          <button
            key={key}
            onClick={() => toggle(key)}
            className="flex items-center justify-between w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]"
            role="switch"
            aria-checked={val}
          >
            <span className="flex flex-col items-start text-left">
              <span className="text-sm font-medium capitalize select-none">{key}</span>
              <span className="text-xs text-[hsl(var(--muted-foreground))] select-none">
                {key === 'functional' ? 'Required for core features' : 'Help us improve the product'}
              </span>
            </span>
            <span className={[
              'relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ml-4',
              val ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]',
            ].join(' ')}>
              <span className={[
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[hsl(var(--primary-foreground))] transition-transform duration-200',
                val ? 'translate-x-4' : 'translate-x-0',
              ].join(' ')} />
            </span>
          </button>
        ))}
      </div>
      <Button className="mt-4 w-full">Save preferences</Button>
    </div>
  )
}

function TeamMembersCard() {
  const members = [
    { initials: 'AK', name: 'Alex Krasnov', role: 'Owner', color: 'primary' },
    { initials: 'JD', name: 'Jane Doe', role: 'Admin', color: 'accent' },
    { initials: 'MR', name: 'Mike Ross', role: 'Member', color: 'muted' },
  ]
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base">Team Members</h3>
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{members.length} members</span>
      </div>
      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-[hsl(var(--${m.color}))] text-[hsl(var(--${m.color}-foreground))]`}>
              {m.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{m.name}</p>
            </div>
            <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-2 py-0.5 text-xs font-medium">
              {m.role}
            </span>
          </div>
        ))}
      </div>
      <Button variant="outline" size="sm" className="mt-4 w-full">Invite member</Button>
    </div>
  )
}

function CardsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
      {/* Card 1 — Feature */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
        <div className="w-10 h-10 rounded-[var(--radius)] bg-[hsl(var(--accent))] mb-4" />
        <h3 className="font-semibold text-base mb-1">Automated Workflows</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
          Build and deploy complex automation pipelines without writing a single line of code.
        </p>
        <Button>Learn more</Button>
      </div>

      {/* Card 2 — Stats/Metric */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
        <p className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">
          Monthly Revenue
        </p>
        <p className="text-4xl font-bold tabular-nums mb-2">$48,290</p>
        <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 text-xs font-medium">
          +12.4%
        </span>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">vs last month</p>
      </div>

      {/* Card 3 — Pricing */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
        <p className="text-xs uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-1">Pro Plan</p>
        <p className="text-3xl font-bold mb-3">
          $29<span className="text-base font-normal text-[hsl(var(--muted-foreground))]">/mo</span>
        </p>
        <ul className="space-y-1.5 text-sm mb-4">
          {['Unlimited projects', 'Priority support', 'Custom domains', 'Advanced analytics'].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <span className="text-[hsl(var(--accent-foreground))]">·</span>
              <span className="text-[hsl(var(--foreground))]">{feature}</span>
            </li>
          ))}
        </ul>
        <Button className="w-full">Get started</Button>
      </div>

      {/* Card 4 — Profile */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
          <span className="text-xl font-semibold text-[hsl(var(--muted-foreground))]">A</span>
        </div>
        <p className="font-semibold text-base">Alex Krasnov</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Design Engineer</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Follow</Button>
          <Button variant="outline" size="sm">Message</Button>
        </div>
      </div>

      {/* Card 5 — Cookie Settings */}
      <CookieSettingsCard />

      {/* Card 6 — Team Members */}
      <TeamMembersCard />

      {/* Card 7 — Stats with charts */}
      <StatsCard />

      {/* Card 8 — Activity Goal */}
      <ActivityGoalCard />

      {/* Card 9 — Calendar */}
      <CalendarCard />

      {/* Card 10 — Exercise Minutes */}
      <ExerciseMinutesCard />

      {/* Card 11 — Create Account */}
      <CreateAccountCard />

      {/* Card 12 — Date Picker with Range */}
      <DatePickerCard />
    </div>
  )
}

function TypographyTab() {
  const label = 'text-xs uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-1'

  return (
    <div className="p-6 max-w-2xl space-y-8">
      <div>
        <p className={label}>Display</p>
        <p className="text-4xl font-black leading-none">Concrete Brutalist</p>
      </div>
      <div>
        <p className={label}>Heading 1</p>
        <h1 className="text-3xl font-bold">Building better interfaces</h1>
      </div>
      <div>
        <p className={label}>Heading 2</p>
        <h2 className="text-2xl font-semibold">Design systems at scale</h2>
      </div>
      <div>
        <p className={label}>Heading 3</p>
        <h3 className="text-xl font-semibold">Component architecture</h3>
      </div>
      <div>
        <p className={label}>Body</p>
        <p className="text-base leading-relaxed">
          Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects, and the products are not burdened with non-essentials. Back to purity, back to simplicity.
        </p>
      </div>
      <div>
        <p className={label}>Small / Caption</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          Supplemental metadata and captions
        </p>
      </div>
      <div>
        <p className={label}>Inline Code</p>
        <code className="font-mono text-sm bg-[hsl(var(--muted))] px-1.5 py-0.5 rounded-[var(--radius)]">
          const theme = useTheme()
        </code>
      </div>
      <div>
        <p className={label}>Blockquote</p>
        <blockquote className="border-l-4 border-[hsl(var(--primary))] pl-4 italic text-[hsl(var(--muted-foreground))]">
          Design is not just what it looks like and feels like. Design is how it works.
        </blockquote>
      </div>
    </div>
  )
}
