'use client'

import { useState } from 'react'

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

const btnBase =
  'rounded-[var(--radius)] font-medium inline-flex items-center justify-center transition-[opacity,background-color,border-color] duration-150 ease-in-out hover:opacity-90 active:opacity-80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]'

const btnVariants = {
  primary: `${btnBase} bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]`,
  secondary: `${btnBase} bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]`,
  outline: `${btnBase} border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`,
  ghost: `${btnBase} bg-transparent text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]`,
  destructive: `${btnBase} bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]`,
}

const btnSizes = {
  sm: 'px-3 py-1.5 text-xs',
  default: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-base',
}

const sectionHeading =
  'text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3'

function CheckboxDemo() {
  const [checked, setChecked] = useState<Record<string, boolean>>({
    notifications: true,
    updates: false,
    marketing: false,
  })
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Checkbox</h4>
      <div className="space-y-2">
        {Object.entries(checked).map(([key, val]) => (
          <label key={key} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setChecked(prev => ({ ...prev, [key]: !prev[key] }))}
              className={[
                'w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors cursor-pointer',
                val
                  ? 'bg-[hsl(var(--primary))] border-[hsl(var(--primary))]'
                  : 'bg-transparent border-[hsl(var(--border))]',
              ].join(' ')}
            >
              {val && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm capitalize text-[hsl(var(--foreground))]">{key}</span>
          </label>
        ))}
      </div>
    </section>
  )
}

function SwitchDemo() {
  const [states, setStates] = useState({ darkMode: true, notifications: false, autoSave: true })
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Switch</h4>
      <div className="space-y-3">
        {(Object.entries(states) as [keyof typeof states, boolean][]).map(([key, val]) => (
          <div key={key} className="flex items-center justify-between max-w-xs">
            <span className="text-sm capitalize text-[hsl(var(--foreground))]">{key.replace(/([A-Z])/g, ' $1')}</span>
            <button
              onClick={() => setStates(prev => ({ ...prev, [key]: !prev[key] }))}
              className={[
                'relative w-9 h-5 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]',
                val ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]',
              ].join(' ')}
              role="switch" aria-checked={val}
            >
              <span className={[
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200',
                val ? 'translate-x-4' : 'translate-x-0',
              ].join(' ')} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

function RadioDemo() {
  const [selected, setSelected] = useState('option-a')
  const options = ['option-a', 'option-b', 'option-c']
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Radio</h4>
      <div className="space-y-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2 cursor-pointer">
            <div
              onClick={() => setSelected(opt)}
              className={[
                'w-4 h-4 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors',
                selected === opt
                  ? 'border-[hsl(var(--primary))]'
                  : 'border-[hsl(var(--border))]',
              ].join(' ')}
            >
              {selected === opt && (
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
              )}
            </div>
            <span className="text-sm capitalize text-[hsl(var(--foreground))]">{opt.replace('-', ' ')}</span>
          </label>
        ))}
      </div>
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
                'flex-1 px-2 py-1 text-xs rounded-[calc(var(--radius)-2px)] transition-colors capitalize',
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

function SelectDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const options = ['Design Engineer', 'Frontend Developer', 'Product Designer', 'Full Stack Developer']
  return (
    <section className="space-y-3">
      <h4 className={sectionHeading}>Select</h4>
      <div className="relative max-w-xs">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="flex w-full items-center justify-between rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-1.5 text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
        >
          <span className={selected ? '' : 'text-[hsl(var(--muted-foreground))]'}>
            {selected ?? 'Select a role...'}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--popover))] shadow-lg z-10 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { setSelected(opt); setIsOpen(false) }}
                className={[
                  'w-full text-left px-3 py-2 text-sm transition-colors',
                  selected === opt
                    ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
                    : 'text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/0.5)] hover:text-[hsl(var(--accent-foreground))]',
                ].join(' ')}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function ComponentsTab() {
  const variantLabels: Array<keyof typeof btnVariants> = [
    'primary',
    'secondary',
    'outline',
    'ghost',
    'destructive',
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Section 1 — Buttons */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Buttons</h4>
        {(['sm', 'default', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-wrap gap-2 items-center">
            {variantLabels.map((variant) => (
              <button
                key={variant}
                className={`${btnVariants[variant]} ${btnSizes[size]}`}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </button>
            ))}
          </div>
        ))}
        <div className="flex flex-wrap gap-2 items-center pt-1">
          <button
            disabled
            className={`${btnVariants.primary} ${btnSizes.default} opacity-50 cursor-not-allowed pointer-events-none`}
          >
            Disabled
          </button>
          <button
            disabled
            className={`${btnVariants.outline} ${btnSizes.default} opacity-50 cursor-not-allowed pointer-events-none`}
          >
            Disabled
          </button>
        </div>
      </section>

      {/* Section 2 — Inputs */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Inputs</h4>
        <div className="space-y-2 max-w-sm">
          <input
            type="text"
            placeholder="Email address"
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-1.5 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <input
            type="text"
            placeholder="Disabled"
            disabled
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-1.5 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <textarea
            placeholder="Write your message..."
            rows={3}
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-1.5 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </section>

      {/* Section 3 — Badges */}
      <section className="space-y-3">
        <h4 className={sectionHeading}>Badges</h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2.5 py-0.5 text-xs font-medium">
            Primary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-2.5 py-0.5 text-xs font-medium">
            Secondary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] bg-transparent px-2.5 py-0.5 text-xs font-medium">
            Outline
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-medium border border-green-200">Success</span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-medium border border-yellow-200">Warning</span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))] px-2.5 py-0.5 text-xs font-medium border border-[hsl(var(--destructive)/0.3)]">Destructive</span>
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
          <div key={key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium capitalize">{key}</p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {key === 'functional' ? 'Required for core features' : 'Help us improve the product'}
              </p>
            </div>
            <button
              onClick={() => toggle(key)}
              className={[
                'relative w-9 h-5 rounded-full transition-colors duration-200',
                val ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]',
              ].join(' ')}
              role="switch" aria-checked={val}
            >
              <span className={[
                'absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200',
                val ? 'translate-x-4' : 'translate-x-0',
              ].join(' ')} />
            </button>
          </div>
        ))}
      </div>
      <button className={`mt-4 w-full ${btnVariants.primary} ${btnSizes.default}`}>
        Save preferences
      </button>
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
      <button className={`mt-4 w-full ${btnVariants.outline} ${btnSizes.sm}`}>
        Invite member
      </button>
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
        <button className={`${btnVariants.primary} ${btnSizes.default}`}>
          Learn more
        </button>
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
        <button className={`w-full ${btnVariants.primary} ${btnSizes.default}`}>
          Get started
        </button>
      </div>

      {/* Card 4 — Profile */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 flex flex-col items-center text-center">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-3">
          <span className="text-xl font-semibold text-[hsl(var(--muted-foreground))]">A</span>
        </div>
        <p className="font-semibold text-base">Alex Krasnov</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Design Engineer</p>
        <div className="flex gap-2">
          <button className={`${btnVariants.outline} ${btnSizes.sm}`}>Follow</button>
          <button className={`${btnVariants.outline} ${btnSizes.sm}`}>Message</button>
        </div>
      </div>

      {/* Card 5 — Cookie Settings */}
      <CookieSettingsCard />

      {/* Card 6 — Team Members */}
      <TeamMembersCard />
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
