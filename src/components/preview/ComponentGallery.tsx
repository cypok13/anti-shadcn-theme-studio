'use client'

import { useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Search, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import { Switch } from '../ui/switch'
import { RadioGroup, RadioItem } from '../ui/radio-group'
import { CalendarCard } from './cards/CalendarCard'
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectField,
} from '../ui/select'
import { TooltipProvider } from '../ui/tooltip'
import { ComponentSection } from './ComponentSection'
import { LeftNav } from '@/components/layout/LeftNav'
import { EmailCTA } from '@/components/layout/EmailCTA'
import { ButtonOverviewTab, ButtonApiTab, ButtonUsageTab, ButtonCodeTab, ButtonStatesTab } from './docs/ButtonDocs'
import {
  CheckboxOverviewTab,
  CheckboxApiTab,
  CheckboxUsageTab,
  CheckboxCodeTab,
  CheckboxStatesTab,
} from './docs/CheckboxDocs'
import {
  SwitchOverviewTab,
  SwitchApiTab,
  SwitchUsageTab,
  SwitchCodeTab,
  SwitchStatesTab,
} from './docs/SwitchDocs'
import {
  RadioOverviewTab,
  RadioApiTab,
  RadioUsageTab,
  RadioCodeTab,
  RadioStatesTab,
} from './docs/RadioDocs'
import { SliderSection } from './SliderSection'
import { SelectSection } from './SelectSection'
import { TabsSection } from './TabsSection'
import {
  ComboboxOverviewTab,
  ComboboxApiTab,
  ComboboxUsageTab,
  ComboboxCodeTab,
  ComboboxStatesTab,
} from './docs/ComboboxDocs'
import { InputOverviewTab, InputApiTab, InputCodeTab, InputStatesTab, InputUsageTab } from './docs/InputDocs'
import { BadgeOverviewTab, BadgeApiTab, BadgeCodeTab, BadgeUsageTab, BadgeStatesTab } from './docs/BadgeDocs'
import { SeparatorOverviewTab, SeparatorApiTab, SeparatorUsageTab, SeparatorCodeTab } from './docs/SeparatorDocs'
import { DemoRow } from './DemoRow'
import { ThemeSidebar } from './ThemeSidebar'
import { SiteHeader } from '@/components/layout/SiteHeader'

const StatsCard = dynamic(() => import('./cards/StatsCard').then(m => ({ default: m.StatsCard })), { ssr: false })
const ActivityGoalCard = dynamic(() => import('./cards/ActivityGoalCard').then(m => ({ default: m.ActivityGoalCard })), { ssr: false })
const ExerciseMinutesCard = dynamic(() => import('./cards/ExerciseMinutesCard').then(m => ({ default: m.ExerciseMinutesCard })), { ssr: false })
const CreateAccountCard = dynamic(() => import('./cards/CreateAccountCard').then(m => ({ default: m.CreateAccountCard })), { ssr: false })
const DatePickerCard = dynamic(() => import('./cards/DatePickerCard').then(m => ({ default: m.DatePickerCard })), { ssr: false })

export function ComponentGallery() {
  const [navOpen, setNavOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <TooltipProvider>
      <>
        <SiteHeader
          darkMode={darkMode}
          onToggleDark={() => setDarkMode((v) => !v)}
          onOpenNav={() => setNavOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <div className="gallery-scroll flex-1 overflow-y-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="mx-auto max-w-[1360px] flex items-start gap-8 px-4 lg:px-8 pt-8 pb-16">
            <LeftNav isOpen={navOpen} onClose={() => setNavOpen(false)} />
            <div className="flex-1 min-w-0 space-y-6">
            <ComponentSection
              id="button"
              title="Button"
              tabs={[
                { key: 'overview', label: 'Overview', content: <ButtonOverviewTab /> },
                { key: 'api',      label: 'API',      content: <ButtonApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <ButtonUsageTab /> },
                { key: 'code',     label: 'Code',     content: <ButtonCodeTab /> },
                { key: 'states',   label: 'States',   content: <ButtonStatesTab /> },
              ]}
            />

            <ComponentSection
              id="checkbox"
              title="Checkbox"
              tabs={[
                { key: 'overview', label: 'Overview', content: <CheckboxOverviewTab /> },
                { key: 'api',      label: 'API',      content: <CheckboxApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <CheckboxUsageTab /> },
                { key: 'code',     label: 'Code',     content: <CheckboxCodeTab /> },
                { key: 'states',   label: 'States',   content: <CheckboxStatesTab /> },
              ]}
            />

            <ComponentSection
              id="input"
              title="Input"
              tabs={[
                { key: 'overview', label: 'Overview', content: <InputOverviewTab /> },
                { key: 'api',      label: 'API',      content: <InputApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <InputUsageTab /> },
                { key: 'code',     label: 'Code',     content: <InputCodeTab /> },
                { key: 'states',   label: 'States',   content: <InputStatesTab /> },
              ]}
            />

            <SelectSection />

            <ComponentSection
              id="switch"
              title="Switch"
              tabs={[
                { key: 'overview', label: 'Overview', content: <SwitchOverviewTab /> },
                { key: 'api',      label: 'API',      content: <SwitchApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <SwitchUsageTab /> },
                { key: 'code',     label: 'Code',     content: <SwitchCodeTab /> },
                { key: 'states',   label: 'States',   content: <SwitchStatesTab /> },
              ]}
            />

            <ComponentSection
              id="radio"
              title="Radio"
              tabs={[
                { key: 'overview', label: 'Overview', content: <RadioOverviewTab /> },
                { key: 'api',      label: 'API',      content: <RadioApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <RadioUsageTab /> },
                { key: 'code',     label: 'Code',     content: <RadioCodeTab /> },
                { key: 'states',   label: 'States',   content: <RadioStatesTab /> },
              ]}
            />

            <SliderSection />

            <ComponentSection
              id="combobox"
              title="Combobox"
              tabs={[
                { key: 'overview', label: 'Overview', content: <ComboboxOverviewTab /> },
                { key: 'api',      label: 'API',      content: <ComboboxApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <ComboboxUsageTab /> },
                { key: 'code',     label: 'Code',     content: <ComboboxCodeTab /> },
                { key: 'states',   label: 'States',   content: <ComboboxStatesTab /> },
              ]}
            />

            <ComponentSection
              id="badge"
              title="Badge"
              tabs={[
                { key: 'overview', label: 'Overview', content: <BadgeOverviewTab /> },
                { key: 'api',      label: 'API',      content: <BadgeApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <BadgeUsageTab /> },
                { key: 'code',     label: 'Code',     content: <BadgeCodeTab /> },
                { key: 'states',   label: 'States',   content: <BadgeStatesTab /> },
              ]}
            />

            <ComponentSection
              id="separator"
              title="Separator"
              tabs={[
                { key: 'overview', label: 'Overview', content: <SeparatorOverviewTab /> },
                { key: 'api',      label: 'API',      content: <SeparatorApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <SeparatorUsageTab /> },
                { key: 'code',     label: 'Code',     content: <SeparatorCodeTab /> },
              ]}
            />

            <TabsSection />
            <EmailCTA />
          </div>
          <div className="hidden lg:block w-[280px] shrink-0 sticky top-8">
            <ThemeSidebar />
          </div>
        </div>
        </div>

        {/* Mobile ThemeSidebar bottom-sheet */}
        <div
          className="lg:hidden"
          aria-hidden={!sidebarOpen}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 60,
            pointerEvents: sidebarOpen ? 'auto' : 'none',
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              opacity: sidebarOpen ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          />

          {/* Bottom sheet panel */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              background: 'hsl(var(--background))',
              borderTop: '1px solid hsl(var(--border))',
              borderRadius: '16px 16px 0 0',
              transform: sidebarOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.25s ease',
            }}
          >
            {/* Sticky header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 16px 12px',
              borderBottom: '1px solid hsl(var(--border))',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'hsl(var(--foreground))' }}>Customize Theme</span>
              <button
                onClick={() => setSidebarOpen(false)}
                aria-label="Close customizer"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 18,
                  color: 'hsl(var(--muted-foreground))',
                  padding: '4px 8px',
                }}
              >
                ✕
              </button>
            </div>
            {/* Scrollable content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              <Suspense>
                <ThemeSidebar />
              </Suspense>
            </div>
          </div>
        </div>
      </>
    </TooltipProvider>
  )
}


const sectionHeading =
  'text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3'

const BTN_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive'] as const
const BTN_STATES = [
  { label: 'Normal',   props: {} },
  { label: 'Disabled', props: { disabled: true } },
  { label: 'Loading',  props: { isLoading: true } },
] as const

const BTN_SIZES = ['sm', 'default', 'lg'] as const
const BTN_SIZE_LABELS: Record<string, string> = { sm: 'Small', default: 'Medium', lg: 'Large' }
const RADIUS_COLS = [
  { label: 'None',   value: '0rem' },
  { label: 'Small',  value: '0.3rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large',  value: '0.75rem' },
  { label: 'Full',   value: '9999px' },
] as const

function ButtonVariantsGrid() {
  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-x-3 border-spacing-y-3">
        <thead>
          <tr>
            <th className="w-28" />
            {BTN_STATES.map(({ label }) => (
              <th key={label} className="text-xs font-normal text-[hsl(var(--muted-foreground))] pb-2 text-center px-2">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BTN_VARIANTS.map((variant) => (
            <tr key={variant}>
              <td className="text-xs text-[hsl(var(--muted-foreground))] pr-4 capitalize align-middle">{variant}</td>
              {BTN_STATES.map(({ label, props }) => (
                <td key={label}>
                  <Button variant={variant} {...props}>Button</Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ButtonSizesGrid() {
  return (
    <div className="flex items-end gap-6">
      {BTN_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Button size={size}>Button</Button>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">{BTN_SIZE_LABELS[size]}</span>
        </div>
      ))}
    </div>
  )
}

function CheckboxDemo() {
  const [checked, setChecked] = useState({ a: true, b: false })
  return (
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
    <div className="space-y-6">

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
    </div>
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
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled</Button>
        <Button aria-disabled="true" title="Complete the form first">
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
              'relative w-9 h-5 rounded-full transition-colors [transition-duration:var(--duration-normal)] shrink-0 ml-4',
              val ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]',
            ].join(' ')}>
              <span className={[
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-[hsl(var(--primary-foreground))] transition-transform [transition-duration:var(--duration-normal)]',
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

