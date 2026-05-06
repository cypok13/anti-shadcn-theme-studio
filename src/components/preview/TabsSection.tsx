'use client'

import { ComponentSection } from './ComponentSection'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'
import { DocCodeBlock } from './docs/DocCodeBlock'
import { DocPropsTable } from './docs/DocPropsTable'

const TABS_PROPS = [
  { name: 'defaultValue',         type: 'string',                          description: 'Initially selected tab (uncontrolled)' },
  { name: 'value',                type: 'string',                          description: 'Controlled selected tab' },
  { name: 'onValueChange',        type: '(value: string) => void',         description: 'Called when selected tab changes' },
  { name: 'TabsList.variant',     type: '"default" | "line"',              default: '"default"', description: 'Pill style or underline indicator style' },
  { name: 'TabsTrigger.value',    type: 'string',                          required: true, description: 'Unique identifier for this tab' },
  { name: 'TabsTrigger.disabled', type: 'boolean',                         default: 'false', description: 'Prevents selection and interaction' },
  { name: 'TabsContent.value',    type: 'string',                          required: true, description: 'Shown when its value matches selected tab' },
]

function TabsApiTab() {
  return <DocPropsTable rows={TABS_PROPS} />
}

function TabsCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Default (pill) style"
        code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>`}
      />
      <DocCodeBlock
        label="Underline style"
        code={`<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
</Tabs>`}
      />
      <DocCodeBlock
        label="Controlled"
        code={`const [tab, setTab] = useState('account')

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>`}
      />
      <DocCodeBlock
        label="With count badge"
        code={`<TabsTrigger value="inbox">
  Inbox
  <span className="ml-1.5 inline-flex items-center justify-center rounded-full
    bg-primary text-primary-foreground text-[10px] font-semibold h-4 min-w-4 px-1">
    12
  </span>
</TabsTrigger>`}
      />
    </div>
  )
}

function PlaceholderPanel({ label }: { label: string }) {
  return (
    <div className="mt-3 rounded-lg bg-[hsl(var(--muted)/0.4)] border border-[hsl(var(--border))] px-4 py-3">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">{label}</p>
    </div>
  )
}

function TabsOverviewTab() {
  return (
    <div className="space-y-8">

      {/* Pill style */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Default — pill</p>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account"><PlaceholderPanel label="Account content" /></TabsContent>
          <TabsContent value="security"><PlaceholderPanel label="Security content" /></TabsContent>
          <TabsContent value="notifications"><PlaceholderPanel label="Notifications content" /></TabsContent>
          <TabsContent value="billing"><PlaceholderPanel label="Billing content" /></TabsContent>
        </Tabs>
      </div>

      {/* Underline style */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Underline</p>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview"><PlaceholderPanel label="Overview content" /></TabsContent>
          <TabsContent value="analytics"><PlaceholderPanel label="Analytics content" /></TabsContent>
          <TabsContent value="reports"><PlaceholderPanel label="Reports content" /></TabsContent>
          <TabsContent value="exports"><PlaceholderPanel label="Exports content" /></TabsContent>
        </Tabs>
      </div>

      {/* Count badges */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">With count badge</p>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox">
              Inbox
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">12</span>
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">3</span>
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">5</span>
            </TabsTrigger>
            <TabsTrigger value="spam">
              Spam
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">2</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox"><PlaceholderPanel label="Inbox — 12 unread" /></TabsContent>
          <TabsContent value="sent"><PlaceholderPanel label="Sent — 3 items" /></TabsContent>
          <TabsContent value="drafts"><PlaceholderPanel label="Drafts — 5 saved" /></TabsContent>
          <TabsContent value="spam"><PlaceholderPanel label="Spam — 2 flagged" /></TabsContent>
        </Tabs>
      </div>

      {/* Disabled */}
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">With disabled tabs</p>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="integrations" disabled>Integrations</TabsTrigger>
            <TabsTrigger value="danger" disabled>Danger zone</TabsTrigger>
          </TabsList>
          <TabsContent value="general"><PlaceholderPanel label="General settings" /></TabsContent>
          <TabsContent value="advanced"><PlaceholderPanel label="Advanced settings" /></TabsContent>
        </Tabs>
      </div>

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

const VARIANT_GUIDE = [
  { variant: 'default (pill)', when: 'Sub-tabs inside a section — compact, contained style' },
  { variant: 'line',           when: 'Page-level or section-level navigation — underline indicator' },
]

function TabsUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use for related content panels">
            Tabs switch between multiple views of related content within the same context — settings sections, data views, component demos.
          </DoDontCard>
          <DoDontCard type="dont" title="Use for page navigation">
            Tabs do not navigate between pages. For routing, use <code className="font-mono">{'<Link>'}</code>. Tabs stay on the same URL.
          </DoDontCard>
          <DoDontCard type="do" title="Keep at least 2 tabs">
            A single tab is meaningless — it implies no choice. If there is only one panel, remove the tabs and show the content directly.
          </DoDontCard>
          <DoDontCard type="dont" title="Nest tabs inside tabs">
            A tablist inside a tabpanel creates a nested tablist — this is an ARIA violation and confuses keyboard navigation. Use a different layout pattern instead.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">When to use each variant</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {VARIANT_GUIDE.map((row, i) => (
            <div key={row.variant} className={`flex items-center gap-4 px-4 py-2 ${i < VARIANT_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}>
              <code className="font-mono text-xs text-[hsl(var(--primary))] w-36 shrink-0">{row.variant}</code>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function TabsStatesTab() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Default — all tabs enabled</p>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a">First</TabsTrigger>
            <TabsTrigger value="b">Second</TabsTrigger>
            <TabsTrigger value="c">Third</TabsTrigger>
          </TabsList>
          <TabsContent value="a" className="mt-4"><p className="text-sm text-[hsl(var(--muted-foreground))]">First tab content.</p></TabsContent>
          <TabsContent value="b" className="mt-4"><p className="text-sm text-[hsl(var(--muted-foreground))]">Second tab content.</p></TabsContent>
          <TabsContent value="c" className="mt-4"><p className="text-sm text-[hsl(var(--muted-foreground))]">Third tab content.</p></TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">With disabled tabs</p>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="locked" disabled>Locked</TabsTrigger>
            <TabsTrigger value="plan" disabled>Pro only</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">This tab is accessible. The others are disabled.</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Underline — with disabled</p>
        <Tabs defaultValue="open">
          <TabsList variant="line">
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="archived" disabled>Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="open" className="mt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">12 open issues.</p>
          </TabsContent>
          <TabsContent value="closed" className="mt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">48 closed issues.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export function TabsSection() {
  return (
    <ComponentSection
      id="tabs"
      title="Tabs"
      tabs={[
        { key: 'overview', label: 'Overview', content: <TabsOverviewTab /> },
        { key: 'api',      label: 'API',      content: <TabsApiTab /> },
        { key: 'usage',    label: 'Usage',    content: <TabsUsageTab /> },
        { key: 'code',     label: 'Code',     content: <TabsCodeTab /> },
        { key: 'states',   label: 'States',   content: <TabsStatesTab /> },
      ]}
    />
  )
}
