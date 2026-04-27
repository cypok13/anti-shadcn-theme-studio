'use client'

import { useState } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxField,
} from '../../ui/combobox'
import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'angular', label: 'Angular' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
]

const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
]

// ─── Props ────────────────────────────────────────────────────────────────────

const COMBOBOX_PROPS = [
  {
    name: 'value',
    type: 'string | undefined',
    default: 'undefined',
    description:
      'Controlled value. Omit (or pass undefined) to use uncontrolled mode with defaultValue.',
  },
  {
    name: 'defaultValue',
    type: 'string | undefined',
    default: '""',
    description: 'Initial value for uncontrolled mode. Ignored when value is provided.',
  },
  {
    name: 'onValueChange',
    type: '(value: string) => void',
    default: 'undefined',
    description: 'Fires when the user selects an option. Receives the selected item value.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: '"Select…"',
    description: 'Input placeholder shown when no value is selected.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description:
      'Disables the input, blocks keyboard and pointer interaction, applies 50% opacity.',
  },
  {
    name: 'size',
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: 'Visual size of the input. sm=h-8, md=h-9, lg=h-10.',
  },
  {
    name: 'id',
    type: 'string',
    default: 'auto',
    description:
      'ID wired to the input element. Generated automatically if omitted. Required when using an external label.',
  },
]

const COMBOBOX_ITEM_PROPS = [
  {
    name: 'value',
    type: 'string',
    default: '— (required)',
    description:
      'Unique value for this option. Passed to onValueChange when selected. Also used to build the option element ID.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Makes this option unselectable. Pointer events are removed and opacity is reduced.',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    default: '— (required)',
    description: 'Label content rendered inside the option. When a plain string, it is also used as the filter target.',
  },
]

// ─── DoDontCard ───────────────────────────────────────────────────────────────

function DoDontCard({
  type,
  title,
  children,
}: {
  type: 'do' | 'dont'
  title: string
  children: React.ReactNode
}) {
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
        <span className="text-xs font-medium text-[hsl(var(--foreground))] leading-snug">
          {title}
        </span>
      </div>
      <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{children}</div>
    </div>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export function ComboboxOverviewTab() {
  const [framework, setFramework] = useState('')
  const [country, setCountry] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          Basic (no label)
        </p>
        <div className="max-w-xs">
          <Combobox value={framework} onValueChange={setFramework} placeholder="Search framework…" aria-label="Search framework">
            <ComboboxContent>
              {FRAMEWORKS.map((f) => (
                <ComboboxItem key={f.value} value={f.value}>
                  {f.label}
                </ComboboxItem>
              ))}
              <ComboboxEmpty />
            </ComboboxContent>
          </Combobox>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          With label
        </p>
        <div className="max-w-xs">
          <ComboboxField
            id="country-overview"
            label="Country"
            placeholder="Search country…"
            value={country}
            onValueChange={setCountry}
            helpText="Select the country where you are located."
          >
            {COUNTRIES.map((c) => (
              <ComboboxItem key={c.value} value={c.value}>
                {c.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxField>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          Disabled
        </p>
        <div className="max-w-xs">
          <ComboboxField
            id="framework-disabled-overview"
            label="Framework"
            placeholder="Search framework…"
            defaultValue="react"
            disabled
          >
            {FRAMEWORKS.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxField>
        </div>
      </div>
    </div>
  )
}

export function ComboboxApiTab() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          Combobox
        </p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-3">
          Searchable single-select with client-side filtering. Input keeps DOM focus at all
          times — keyboard navigation uses aria-activedescendant, not roving tabindex.
        </p>
        <DocPropsTable rows={COMBOBOX_PROPS} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          ComboboxItem
        </p>
        <DocPropsTable rows={COMBOBOX_ITEM_PROPS} />
      </div>
    </div>
  )
}

export function ComboboxUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">
          Guidelines
        </p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use Combobox for 5 or more options">
            When the list is long enough that users benefit from typing to filter, a Combobox
            reduces cognitive load versus scrolling a long Select.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Combobox for binary choices">
            Yes / No, On / Off, Enabled / Disabled — use a Switch or two RadioItems instead.
            Combobox overhead is wasted on two-option sets.
          </DoDontCard>
          <DoDontCard type="do" title="Always provide a meaningful placeholder">
            &quot;Search country…&quot; tells users what they are filtering. Generic
            &quot;Select…&quot; is acceptable only when the label already provides full context.
          </DoDontCard>
          <DoDontCard type="dont" title="Don't use Combobox when options are unknown to the user">
            If users must invent a value (free text entry), use a plain Input. Combobox
            implies a bounded, searchable set of known options.
          </DoDontCard>
        </div>
      </section>
    </div>
  )
}

export function ComboboxCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Controlled"
        code={`const [value, setValue] = useState('')

<Combobox value={value} onValueChange={setValue} placeholder="Search framework…">
  <ComboboxContent>
    <ComboboxItem value="react">React</ComboboxItem>
    <ComboboxItem value="vue">Vue</ComboboxItem>
    <ComboboxItem value="svelte">Svelte</ComboboxItem>
    <ComboboxEmpty />
  </ComboboxContent>
</Combobox>`}
      />
      <DocCodeBlock
        label="With label and help text (ComboboxField)"
        code={`<ComboboxField
  id="country"
  label="Country"
  placeholder="Search country…"
  helpText="Where are you located?"
  value={country}
  onValueChange={setCountry}
>
  <ComboboxItem value="us">United States</ComboboxItem>
  <ComboboxItem value="gb">United Kingdom</ComboboxItem>
  <ComboboxItem value="de">Germany</ComboboxItem>
  <ComboboxEmpty />
</ComboboxField>`}
      />
      <DocCodeBlock
        label="Disabled item"
        code={`<Combobox placeholder="Pick one…">
  <ComboboxContent>
    <ComboboxItem value="react">React</ComboboxItem>
    <ComboboxItem value="angular" disabled>Angular (deprecated)</ComboboxItem>
  </ComboboxContent>
</Combobox>`}
      />
      <DocCodeBlock
        label="Disabled combobox"
        code={`<ComboboxField
  id="locked"
  label="Framework"
  defaultValue="react"
  disabled
>
  <ComboboxItem value="react">React</ComboboxItem>
</ComboboxField>`}
      />
    </div>
  )
}

export function ComboboxStatesTab() {
  const [val, setVal] = useState('')

  return (
    <div className="space-y-5 max-w-xs">
      <div className="space-y-2">
        <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">default (md)</p>
        <Combobox value={val} onValueChange={setVal} placeholder="Search framework…">
          <ComboboxContent>
            {FRAMEWORKS.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">size sm</p>
        <Combobox placeholder="Search…" size="sm">
          <ComboboxContent>
            {FRAMEWORKS.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">size lg</p>
        <Combobox placeholder="Search…" size="lg">
          <ComboboxContent>
            {FRAMEWORKS.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">disabled</p>
        <Combobox defaultValue="react" disabled placeholder="Search framework…">
          <ComboboxContent>
            {FRAMEWORKS.map((f) => (
              <ComboboxItem key={f.value} value={f.value}>
                {f.label}
              </ComboboxItem>
            ))}
            <ComboboxEmpty />
          </ComboboxContent>
        </Combobox>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-mono text-[hsl(var(--muted-foreground))]">with label</p>
        <ComboboxField id="state-label" label="Framework" placeholder="Search framework…">
          {FRAMEWORKS.map((f) => (
            <ComboboxItem key={f.value} value={f.value}>
              {f.label}
            </ComboboxItem>
          ))}
          <ComboboxEmpty />
        </ComboboxField>
      </div>
    </div>
  )
}
