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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../ui/tooltip'
import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogBody,
} from '../ui/dialog'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ComponentSection } from './ComponentSection'
import { ButtonApiTab, ButtonUsageTab, ButtonCodeTab } from './docs/ButtonDocs'
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
import { TooltipSection } from './TooltipSection'
import {
  ComboboxOverviewTab,
  ComboboxApiTab,
  ComboboxUsageTab,
  ComboboxCodeTab,
  ComboboxStatesTab,
} from './docs/ComboboxDocs'
import { DemoRow } from './DemoRow'
import { ThemeSidebar } from './ThemeSidebar'

const StatsCard = dynamic(() => import('./cards/StatsCard').then(m => ({ default: m.StatsCard })), { ssr: false })
const ActivityGoalCard = dynamic(() => import('./cards/ActivityGoalCard').then(m => ({ default: m.ActivityGoalCard })), { ssr: false })
const ExerciseMinutesCard = dynamic(() => import('./cards/ExerciseMinutesCard').then(m => ({ default: m.ExerciseMinutesCard })), { ssr: false })
const CreateAccountCard = dynamic(() => import('./cards/CreateAccountCard').then(m => ({ default: m.CreateAccountCard })), { ssr: false })
const DatePickerCard = dynamic(() => import('./cards/DatePickerCard').then(m => ({ default: m.DatePickerCard })), { ssr: false })

export function ComponentGallery() {
  return (
    <TooltipProvider>
      <div className="h-full overflow-y-auto bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <div className="mx-auto max-w-[1120px] flex items-start gap-12 px-8 pt-8 pb-16">
          <div className="flex-1 min-w-0 space-y-6">
            <ComponentSection
              title="Button"
              tabs={[
                { key: 'variants', label: 'Variants', content: <ButtonVariantsGrid /> },
                { key: 'sizes',    label: 'Sizes',    content: <ButtonSizesGrid /> },
                { key: 'api',      label: 'API',      content: <ButtonApiTab /> },
                { key: 'usage',    label: 'Usage',    content: <ButtonUsageTab /> },
                { key: 'code',     label: 'Code',     content: <ButtonCodeTab /> },
              ]}
            />

            <ComponentSection
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
              title="Dialog"
            >
              <DialogDemo />
            </ComponentSection>

            <ComponentSection
              title="Input"
            >
              <InputDemo />
            </ComponentSection>

            <SelectSection />

            <TooltipSection />

            <ComponentSection
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
              title="Badge"
            >
              <BadgeDemo />
            </ComponentSection>

            <ComponentSection
              title="Separator"
            >
              <SeparatorDemo />
            </ComponentSection>

            <ComponentSection
              title="Popover"
            >
              <PopoverDemo />
            </ComponentSection>

            {/* Playwright test fixtures */}
            <TabsDemo />
            <TabsPrimitiveDemo />
          </div>
          <div className="w-[280px] shrink-0 sticky top-8">
            <ThemeSidebar />
          </div>
        </div>
      </div>
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

function TabsDemo() {
  const [active, setActive] = useState('account')
  const tabs = ['account', 'password', 'notifications']
  const content: Record<string, string> = {
    account: 'Manage your account settings and preferences.',
    password: 'Change your password and security settings.',
    notifications: 'Configure how you receive notifications.',
  }
  return (
    <section className="space-y-3" data-section="tabs-original">
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
                  ? 'bg-[hsl(var(--background))] text-[hsl(var(--foreground))] [box-shadow:var(--shadow-sm)] font-medium'
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

function SeparatorDemo() {
  return (
    <section className="space-y-4" data-section="separator">
      <h4 className={sectionHeading}>Separator</h4>
      <div className="space-y-4">
        <Separator />
        <div className="flex items-center gap-3 text-sm text-[hsl(var(--muted-foreground))]">
          <span>Item A</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Item B</span>
          <Separator orientation="vertical" className="h-4" />
          <span>Item C</span>
        </div>
      </div>
    </section>
  )
}

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

function TabsPrimitiveDemo() {
  return (
    <section className="space-y-3" data-section="tabs-component">
      <h4 className={sectionHeading}>Tabs</h4>
      <div className="space-y-4">
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3" disabled>Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="text-sm text-[hsl(var(--muted-foreground))] pt-2">Content for Tab 1</p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="text-sm text-[hsl(var(--muted-foreground))] pt-2">Content for Tab 2</p>
          </TabsContent>
          <TabsContent value="tab3">
            <p className="text-sm text-[hsl(var(--muted-foreground))] pt-2">Content for Tab 3</p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

const SettingsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

function TooltipDemo() {
  const triggerClass = [
    'cursor-pointer rounded-[var(--radius)] border border-[hsl(var(--border))]',
    'bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))]',
    'min-h-[44px] hover:bg-[hsl(var(--accent)/0.5)] focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[hsl(var(--background))]',
  ].join(' ')

  return (
    <section className="space-y-4 pb-24" data-section="tooltip">
      <h4 className={sectionHeading}>Tooltip</h4>
      <div className="space-y-4">

        {/* 1. Default (top) */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>Hover me</button>
            </TooltipTrigger>
            <TooltipContent>This is a tooltip</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Default (top)</span>
        </div>

        {/* 2. Right placement */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>Hover me (right)</button>
            </TooltipTrigger>
            <TooltipContent side="right">Opens to the right</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Right</span>
        </div>

        {/* 3. Bottom placement */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>Hover me (bottom)</button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Opens below</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Bottom</span>
        </div>

        {/* 4. Left placement */}
        <div className="flex items-center gap-2 pl-40">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>Hover me (left)</button>
            </TooltipTrigger>
            <TooltipContent side="left">Opens to the left</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Left</span>
        </div>

        {/* 5. No arrow */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>No arrow</button>
            </TooltipTrigger>
            <TooltipContent showArrow={false}>No arrow tooltip</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">No arrow</span>
        </div>

        {/* 6. Long text */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className={triggerClass}>Long text</button>
            </TooltipTrigger>
            <TooltipContent>This is a longer tooltip that tests the max-width constraint of 240 pixels</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Long text (max-width 240px)</span>
        </div>

        {/* 7. Icon button */}
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={[
                  'cursor-pointer rounded-[var(--radius)]',
                  'min-h-[44px] min-w-[44px] bg-transparent p-2 text-[hsl(var(--foreground))]',
                  'hover:bg-[hsl(var(--accent)/0.5)] focus-visible:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
                  'focus-visible:ring-offset-[hsl(var(--background))]',
                ].join(' ')}
                aria-label="Settings"
              >
                <SettingsIcon />
              </button>
            </TooltipTrigger>
            <TooltipContent>Settings</TooltipContent>
          </Tooltip>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Icon button</span>
        </div>

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

function DialogDemo() {
  return (
    <section className="space-y-4" data-section="dialog">
      <h4 className={sectionHeading}>Dialog</h4>
      <div className="flex flex-wrap gap-3">

        {/* Demo 1 — Default */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Default dialog</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when done.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Profile settings would go here.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Demo 2 — Small */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Small (sm)</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Delete item</DialogTitle>
                <DialogDescription>This cannot be undone.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Are you sure you want to delete this item?
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Demo 3 — Large */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Large (lg)</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent size="lg">
              <DialogHeader>
                <DialogTitle>Team settings</DialogTitle>
                <DialogDescription>Configure your team preferences.</DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-3">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Use this space to manage your team&apos;s workspace, permissions, and
                  notification settings. Changes take effect immediately.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  You can invite up to 50 team members on the current plan. Upgrade to
                  Enterprise for unlimited members.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <Button>Save settings</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Demo 4 — No close button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">No close button</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Confirm action</DialogTitle>
                <DialogDescription>
                  Please confirm or cancel using the buttons below.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  No X button — dismiss via footer only.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Demo 5 — Scrollable */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Scrollable</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent scrollable>
              <DialogHeader className="bg-[hsl(var(--card))] px-6 pt-6 pb-4">
                <DialogTitle>Terms of service</DialogTitle>
                <DialogDescription>Please read carefully before accepting.</DialogDescription>
              </DialogHeader>
              <DialogBody>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                  nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed
                  quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                  adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et
                  dolore magnam aliquam quaerat voluptatem.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                  praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                  excepturi sint occaecati cupiditate non provident.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum
                  et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
                </p>
                <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit
                  quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.
                </p>
              </DialogBody>
              <DialogFooter className="bg-[hsl(var(--card))] px-6 py-4 border-t border-[hsl(var(--border))]">
                <DialogClose asChild>
                  <Button variant="ghost">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button>Accept</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

        {/* Demo 6 — Destructive */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Destructive dialog</Button>
          </DialogTrigger>
          <DialogPortal>
            <DialogOverlay />
            <DialogContent closeOnOutsideClick={false}>
              <DialogHeader>
                <DialogTitle>Delete account</DialogTitle>
                <DialogDescription>
                  All data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  This action cannot be undone. Your account and all associated data will be
                  permanently deleted.
                </p>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                  <Button variant="ghost" autoFocus>Cancel</Button>
                </DialogClose>
                <Button variant="destructive">Delete account</Button>
              </DialogFooter>
            </DialogContent>
          </DialogPortal>
        </Dialog>

      </div>
    </section>
  )
}

function PopoverDemo() {
  const [controlled, setControlled] = useState(false)

  const triggerClass = [
    'cursor-pointer rounded-[var(--radius)] border border-[hsl(var(--border))]',
    'bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))]',
    'min-h-[44px] hover:bg-[hsl(var(--accent)/0.5)] focus-visible:outline-none',
    'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
    'focus-visible:ring-offset-[hsl(var(--background))]',
  ].join(' ')

  return (
    <section className="space-y-4 pb-24" data-section="popover">
      <h4 className={sectionHeading}>Popover</h4>
      <div className="space-y-4">

        {/* 1. Default (bottom, with arrow) */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className={triggerClass}>Default (bottom)</button>
            </PopoverTrigger>
            <PopoverContent showArrow>
              <p className="text-sm text-[hsl(var(--popover-foreground))]">
                This is a popover. It opens below the trigger by default.
              </p>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Default (bottom) with arrow</span>
        </div>

        {/* 2. Top placement */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className={triggerClass}>Top placement</button>
            </PopoverTrigger>
            <PopoverContent side="top" showArrow>
              <p className="text-sm text-[hsl(var(--popover-foreground))]">
                Opens above the trigger.
              </p>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">side=&quot;top&quot;</span>
        </div>

        {/* 3. With form fields */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className={triggerClass}>With form</button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px]">
              <div className="space-y-3">
                <p className="text-sm font-medium text-[hsl(var(--popover-foreground))]">Edit username</p>
                <Field
                  id="popover-username"
                  label="Username"
                  inputProps={{ placeholder: 'Enter username', defaultValue: 'alex_k' }}
                />
                <button
                  className={[
                    'w-full min-h-[36px] px-3 rounded-[var(--radius)] text-sm font-medium',
                    'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]',
                    'hover:bg-[hsl(var(--primary)/0.9)] cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2',
                    'focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
                  ].join(' ')}
                >
                  Save changes
                </button>
              </div>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">With form fields</span>
        </div>

        {/* 4. No arrow */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className={triggerClass}>No arrow</button>
            </PopoverTrigger>
            <PopoverContent showArrow={false}>
              <p className="text-sm text-[hsl(var(--popover-foreground))]">
                Popover without the arrow indicator.
              </p>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">showArrow=&#123;false&#125;</span>
        </div>

        {/* 5. Controlled */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            className={[
              'cursor-pointer rounded-[var(--radius)] border border-[hsl(var(--border))]',
              'bg-[hsl(var(--background))] px-3 text-sm text-[hsl(var(--foreground))]',
              'min-h-[44px] hover:bg-[hsl(var(--accent)/0.5)] focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
            ].join(' ')}
            onClick={() => setControlled((v) => !v)}
          >
            {controlled ? 'Close popover' : 'Open popover'}
          </button>
          <Popover open={controlled} onOpenChange={setControlled}>
            <PopoverTrigger asChild>
              <button className={triggerClass}>Trigger</button>
            </PopoverTrigger>
            <PopoverContent showArrow>
              <p className="text-sm text-[hsl(var(--popover-foreground))]">
                This popover is controlled externally.
              </p>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">Controlled — open/close via external button</span>
        </div>

        {/* 6. Right placement */}
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <button className={triggerClass}>Right placement</button>
            </PopoverTrigger>
            <PopoverContent side="right" showArrow>
              <p className="text-sm text-[hsl(var(--popover-foreground))]">
                Opens to the right of the trigger.
              </p>
            </PopoverContent>
          </Popover>
          <span className="text-xs text-[hsl(var(--muted-foreground))]">side=&quot;right&quot;</span>
        </div>

      </div>
    </section>
  )
}

function BadgeDemo() {
  return (
    <section className="space-y-3" data-section="badge">
      <h4 className={sectionHeading}>Badge</h4>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="default" size="sm">sm</Badge>
          <Badge variant="default" size="md">md</Badge>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge variant="success" dot aria-label="Online" />
          <Badge variant="destructive" dot aria-label="Offline" />
          <Badge variant="warning" dot aria-label="Away" />
        </div>
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

      {/* Section 3 — Badge */}
      <BadgeDemo />

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

      {/* Section 6 — Separator (placeholder) */}

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

      {/* Section 12 — Separator */}
      <SeparatorDemo />

      {/* Section 13 — Tabs */}
      <TabsDemo />

      {/* Section 14 — Select */}
      <SelectDemo />

      {/* Section 14b — Tabs (primitive) */}
      <TabsPrimitiveDemo />

      {/* Section 15 — Tooltip */}
      <TooltipDemo />

      {/* Section 16 — Dialog */}
      <DialogDemo />

      {/* Section 17 — Popover */}
      <PopoverDemo />
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

