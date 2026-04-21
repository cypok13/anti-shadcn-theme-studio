import { DocPropsTable } from './DocPropsTable'
import { DocCodeBlock } from './DocCodeBlock'

const BUTTON_PROPS = [
  {
    name: 'variant',
    type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "link"',
    default: '"default"',
    description: 'Visual style. Use default for primary CTA, outline/ghost for secondary actions, destructive for irreversible actions.',
  },
  {
    name: 'size',
    type: '"default" | "sm" | "lg" | "icon"',
    default: '"default"',
    description: 'Height preset. icon = 40×40px square for icon-only buttons — must have aria-label.',
  },
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Merges props onto the child element (e.g. Next.js <Link>). Uses Radix Slot under the hood.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Replaces content with a spinner. Sets aria-disabled and aria-label="Loading" automatically.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Native disabled — removes from tab order. Use for form submit guards. For permission gates use aria-disabled instead.',
  },
  {
    name: 'aria-disabled',
    type: '"true" | boolean',
    default: undefined,
    description: 'Contextual unavailability — stays in tab order so screen reader users know the button exists. Pair with a tooltip explaining why.',
  },
]

export function ButtonApiTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[hsl(var(--muted-foreground))]">
        Extends all native <code className="text-xs font-mono bg-[hsl(var(--muted)/0.6)] px-1.5 py-0.5 rounded text-[hsl(var(--foreground))]">{'<button>'}</code> HTML attributes.
      </p>
      <DocPropsTable rows={BUTTON_PROPS} />
    </div>
  )
}

function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-lg p-4 text-sm"
      style={{
        borderLeft: `3px solid ${type === 'do' ? 'rgb(34,197,94)' : 'rgb(239,68,68)'}`,
        background: type === 'do' ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: type === 'do' ? 'rgb(34,197,94)' : 'rgb(239,68,68)' }}
        >
          {type === 'do' ? '✓ Do' : "✕ Don't"}
        </span>
        <span className="text-xs font-medium text-[hsl(var(--foreground))]">{title}</span>
      </div>
      <div className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{children}</div>
    </div>
  )
}

const VARIANT_GUIDE = [
  { variant: 'default',     when: 'Primary CTA — one per view',            badge: 'Default' },
  { variant: 'secondary',   when: 'Secondary action alongside a primary' },
  { variant: 'outline',     when: 'Tertiary, or in toolbars/filters' },
  { variant: 'ghost',       when: 'Icon buttons, sidebar items, low-emphasis' },
  { variant: 'destructive', when: 'Irreversible delete / remove action' },
  { variant: 'link',        when: 'Inline text links within prose' },
]

export function ButtonUsageTab() {
  return (
    <div className="space-y-6 text-sm">
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">Guidelines</p>
        <div className="grid grid-cols-2 gap-3">
          <DoDontCard type="do" title="Use one primary per view">
            Reserve <code className="font-mono">default</code> variant for the single most important action on screen. Competing primaries dilute hierarchy.
          </DoDontCard>
          <DoDontCard type="dont" title="Stack multiple primaries">
            Avoid placing two <code className="font-mono">default</code> buttons side-by-side — this creates ambiguity about which action matters more.
          </DoDontCard>
          <DoDontCard type="do" title="Match verb to variant">
            Use <code className="font-mono">destructive</code> for irreversible actions (Delete, Remove). It signals danger before the user clicks.
          </DoDontCard>
          <DoDontCard type="dont" title="Use ghost for main CTAs">
            <code className="font-mono">ghost</code> is low-emphasis — it disappears on plain backgrounds. Never use it as the only action in a form.
          </DoDontCard>
          <DoDontCard type="do" title="Disable with intent">
            Disable buttons when prerequisites are unmet. Pair with a tooltip explaining what&apos;s needed to enable.
          </DoDontCard>
          <DoDontCard type="dont" title="Rely on disabled alone">
            Don&apos;t hide all feedback behind a disabled state. If an action fails, show an inline error — don&apos;t just grey the button out silently.
          </DoDontCard>
        </div>
      </section>

      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))] mb-3">When to use each variant</p>
        <div className="rounded-lg border border-[hsl(var(--border))] overflow-hidden">
          {VARIANT_GUIDE.map((row, i) => (
            <div
              key={row.variant}
              className={`flex items-center gap-4 px-4 py-2.5 ${i < VARIANT_GUIDE.length - 1 ? 'border-b border-[hsl(var(--border))]' : ''}`}
            >
              <div className="flex items-center gap-2 w-36 shrink-0">
                <code className="font-mono text-xs text-[hsl(var(--primary))]">{row.variant}</code>
                {row.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] font-medium leading-none">
                    {row.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{row.when}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export function ButtonCodeTab() {
  return (
    <div className="space-y-4">
      <DocCodeBlock
        label="Primary CTA"
        code={`<Button onClick={handleSave}>Save changes</Button>`}
      />
      <DocCodeBlock
        label="Loading state"
        code={`<Button isLoading={isSubmitting} disabled={isSubmitting} type="submit">
  Create project
</Button>`}
      />
      <DocCodeBlock
        label="Icon-only"
        code={`<Button variant="ghost" size="icon" aria-label="Copy to clipboard">
  <CopyIcon aria-hidden="true" />
</Button>`}
      />
      <DocCodeBlock
        label="asChild with Next.js Link"
        code={`<Button asChild>
  <Link href="/dashboard">Go to dashboard</Link>
</Button>`}
      />
      <DocCodeBlock
        label="Permission gate (aria-disabled)"
        code={`<Button
  aria-disabled="true"
  title="Upgrade to Pro to unlock exports"
  onClick={(e) => e.preventDefault()}
>
  Export CSV
</Button>`}
      />
      <DocCodeBlock
        label="Destructive with confirmation"
        code={`<Button variant="destructive" onClick={() => setConfirmOpen(true)}>
  Delete account
</Button>`}
      />
    </div>
  )
}
