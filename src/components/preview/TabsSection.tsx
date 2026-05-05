'use client'

import { ComponentSection } from './ComponentSection'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'

function TabsApiTab() {
  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[hsl(var(--border))]">
              <th className="text-left py-2 pr-4 font-medium text-[hsl(var(--foreground))]">Prop</th>
              <th className="text-left py-2 pr-4 font-medium text-[hsl(var(--foreground))]">Type</th>
              <th className="text-left py-2 pr-4 font-medium text-[hsl(var(--foreground))]">Default</th>
              <th className="text-left py-2 font-medium text-[hsl(var(--foreground))]">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['defaultValue', 'string', '—', 'Initially selected tab (uncontrolled)'],
              ['value', 'string', '—', 'Controlled selected tab'],
              ['onValueChange', '(value: string) => void', '—', 'Called when selected tab changes'],
              ['TabsList.variant', '"default" | "line"', '"default"', 'Pill style or underline indicator style'],
              ['TabsTrigger.value', 'string', 'required', 'Unique identifier for this tab'],
              ['TabsTrigger.disabled', 'boolean', 'false', 'Prevents selection and interaction'],
              ['TabsContent.value', 'string', 'required', 'Shown when its value matches selected tab'],
            ].map(([prop, type, def, desc]) => (
              <tr key={prop} className="border-b border-[hsl(var(--border)/0.5)]">
                <td className="py-2 pr-4 font-mono text-xs text-[hsl(var(--primary))]">{prop}</td>
                <td className="py-2 pr-4 text-[hsl(var(--muted-foreground))]">{type}</td>
                <td className="py-2 pr-4 text-[hsl(var(--muted-foreground))]">{def}</td>
                <td className="py-2 text-[hsl(var(--muted-foreground))]">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TabsCodeTab() {
  return (
    <pre className="bg-[hsl(var(--muted))] rounded-[var(--radius)] p-4 text-sm font-mono text-[hsl(var(--foreground))] overflow-x-auto">
      <code>{`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Default (pill) style
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account content</TabsContent>
  <TabsContent value="settings">Settings content</TabsContent>
</Tabs>

// Underline style
<Tabs defaultValue="overview">
  <TabsList variant="line">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
    <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview content</TabsContent>
</Tabs>`}</code>
    </pre>
  )
}

function TabsOverviewTab() {
  return (
    <div className="space-y-8">

      {/* Variant 1: Default (pill/card style) */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Default — pill style
        </p>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Account settings</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Manage your account name, email address, and connected services.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="security" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Security settings</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Change your password, enable two-factor authentication, and manage active sessions.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Notification preferences</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Choose which events trigger email or push notifications.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="billing" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Billing &amp; plan</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                View invoices, update payment method, and manage your subscription plan.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Variant 2: Underline style */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          Underline style
        </p>
        <Tabs defaultValue="overview">
          <TabsList variant="line">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="exports">Exports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Overview</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                A summary of your project&apos;s activity over the last 30 days.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Analytics</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Detailed metrics: pageviews, unique visitors, session duration.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="reports" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Reports</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Scheduled and on-demand reports delivered to your inbox.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="exports" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Exports</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Download raw data as CSV or JSON for offline analysis.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Variant 3: With count badge */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          With count badge
        </p>
        <Tabs defaultValue="inbox">
          <TabsList>
            <TabsTrigger value="inbox">
              Inbox
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">
                12
              </span>
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">
                3
              </span>
            </TabsTrigger>
            <TabsTrigger value="drafts">
              Drafts
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">
                5
              </span>
            </TabsTrigger>
            <TabsTrigger value="spam">
              Spam
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-[hsl(var(--destructive)/0.15)] text-[hsl(var(--destructive))] text-[10px] font-semibold h-4 min-w-4 px-1 leading-none">
                2
              </span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="inbox" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Inbox — 12 unread</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Your incoming messages. Bold items are unread.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="sent" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Sent — 3 items</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Messages you have sent to other users.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="drafts" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Drafts — 5 saved</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Unfinished messages saved automatically.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="spam" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Spam — 2 flagged</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Messages filtered as spam. Review before permanent deletion.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Variant 4: Disabled tab */}
      <div className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
          With disabled tab
        </p>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="integrations" disabled>
              Integrations
            </TabsTrigger>
            <TabsTrigger value="danger" disabled>
              Danger zone
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">General settings</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Name, description, and visibility settings for your workspace.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="advanced" className="mt-4">
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-1">Advanced settings</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Developer options, custom domains, and experimental features.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="integrations" className="mt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Integrations content.</p>
          </TabsContent>
          <TabsContent value="danger" className="mt-4">
            <p className="text-sm text-[hsl(var(--muted-foreground))]">Danger zone content.</p>
          </TabsContent>
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
        <div className="grid grid-cols-2 gap-3">
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
