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

function ComponentsTab() {
  return (
    <div className="p-6 space-y-8">
      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Buttons
        </h4>
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 text-sm font-medium">
            Primary
          </button>
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-4 py-2 text-sm font-medium">
            Secondary
          </button>
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] px-4 py-2 text-sm font-medium">
            Outline
          </button>
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-transparent text-[hsl(var(--foreground))] px-4 py-2 text-sm font-medium hover:bg-[hsl(var(--accent))]">
            Ghost
          </button>
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] px-4 py-2 text-sm font-medium">
            Destructive
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Cards
        </h4>
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 shadow-sm max-w-sm">
          <h3 className="font-semibold text-lg">Card Title</h3>
          <p className="text-[hsl(var(--muted-foreground))] text-sm mt-1">
            Card description goes here.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 text-sm font-medium">
              Action
            </button>
            <button className="inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] px-4 py-2 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Inputs
        </h4>
        <div className="space-y-2 max-w-sm">
          <input
            className="flex h-9 w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-1 text-sm shadow-sm text-[hsl(var(--foreground))]"
            placeholder="Enter value..."
          />
          <textarea
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm shadow-sm min-h-[80px] text-[hsl(var(--foreground))]"
            placeholder="Your message..."
          />
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Badges
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-2.5 py-0.5 text-xs font-medium">
            Primary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] px-2.5 py-0.5 text-xs font-medium">
            Secondary
          </span>
          <span className="inline-flex items-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] px-2.5 py-0.5 text-xs font-medium">
            Outline
          </span>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Table
        </h4>
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
                <th className="text-left py-2 px-3 text-[hsl(var(--muted-foreground))] font-medium">Name</th>
                <th className="text-left py-2 px-3 text-[hsl(var(--muted-foreground))] font-medium">Status</th>
                <th className="text-left py-2 px-3 text-[hsl(var(--muted-foreground))] font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[hsl(var(--border))]">
                <td className="py-2 px-3">Alice</td>
                <td className="py-2 px-3">Active</td>
                <td className="py-2 px-3">$240</td>
              </tr>
              <tr className="border-b border-[hsl(var(--border))]">
                <td className="py-2 px-3">Bob</td>
                <td className="py-2 px-3">Pending</td>
                <td className="py-2 px-3">$180</td>
              </tr>
              <tr>
                <td className="py-2 px-3">Carol</td>
                <td className="py-2 px-3">Inactive</td>
                <td className="py-2 px-3">$320</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
          Alert
        </h4>
        <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 max-w-sm">
          <p className="text-sm font-medium">Info: Your changes have been saved.</p>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Last updated 2 minutes ago.
          </p>
        </div>
      </section>
    </div>
  )
}

function CardsTab() {
  return (
    <div className="p-6 grid grid-cols-2 gap-4">
      {/* Feature card */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
        <div className="w-10 h-10 rounded-[var(--radius)] bg-[hsl(var(--accent))] mb-4" />
        <h3 className="font-semibold text-base mb-1">Feature Title</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
          A short description of what this feature does and why it matters to users.
        </p>
        <button className="inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 text-sm font-medium">
          Learn more
        </button>
      </div>

      {/* Stats card */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">Revenue</p>
        <p className="text-4xl font-bold mb-1">$48,290</p>
        <span className="inline-flex items-center rounded-[var(--radius)] bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] px-2 py-0.5 text-xs font-medium">
          +12.4%
        </span>
      </div>

      {/* Pricing card */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6">
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Pro Plan</p>
        <p className="text-3xl font-bold mb-1">$29<span className="text-base font-normal text-[hsl(var(--muted-foreground))]">/mo</span></p>
        <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))] mb-4 mt-3">
          <li>Unlimited projects</li>
          <li>Priority support</li>
          <li>Custom domains</li>
          <li>Advanced analytics</li>
        </ul>
        <button className="w-full inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2 text-sm font-medium">
          Get started
        </button>
      </div>

      {/* Profile card */}
      <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-[hsl(var(--muted))] mb-3" />
        <p className="font-semibold text-base">Alex Krasnov</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">Design Engineer</p>
        <div className="flex gap-2">
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] px-3 py-1 text-xs font-medium">
            Twitter
          </button>
          <button className="inline-flex items-center justify-center rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] px-3 py-1 text-xs font-medium">
            GitHub
          </button>
        </div>
      </div>
    </div>
  )
}

function TypographyTab() {
  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Display</p>
        <p className="text-3xl font-bold">The quick brown fox</p>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">H1</p>
        <h1 className="text-2xl font-bold">Building better interfaces</h1>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">H2</p>
        <h2 className="text-xl font-semibold">Design systems at scale</h2>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">H3</p>
        <h3 className="text-lg font-semibold">Component architecture</h3>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Body</p>
        <p className="text-base leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Small</p>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Caption text — supplemental information</p>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Code</p>
        <code className="font-mono text-sm bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] px-2 py-1 rounded-[var(--radius)]">
          const theme = useTheme()
        </code>
      </div>
      <div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Blockquote</p>
        <blockquote className="border-l-4 border-[hsl(var(--primary))] pl-4 text-base italic text-[hsl(var(--muted-foreground))]">
          Design is not just what it looks like and feels like. Design is how it works.
        </blockquote>
      </div>
    </div>
  )
}
