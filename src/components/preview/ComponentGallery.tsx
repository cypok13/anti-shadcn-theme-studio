interface ComponentGalleryProps {
  activeTab?: string
}

export function ComponentGallery({ activeTab = 'components' }: ComponentGalleryProps) {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
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
    </div>
  )
}

function CardsTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
      {/* Card 1 — Feature */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
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
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
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
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
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
