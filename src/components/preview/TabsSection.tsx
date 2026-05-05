'use client'

import { ComponentSection } from './ComponentSection'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs'

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

export function TabsSection() {
  return (
    <ComponentSection
      id="tabs"
      title="Tabs"
      tabs={[
        { key: 'overview', label: 'Overview', content: <TabsOverviewTab /> },
      ]}
    />
  )
}
