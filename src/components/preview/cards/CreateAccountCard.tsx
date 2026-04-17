import { Github, Mail } from 'lucide-react'

export function CreateAccountCard() {
  return (
    <div className="rounded-[var(--radius)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] p-6 [box-shadow:var(--shadow-preset,none)]">
      <h3 className="font-semibold text-base mb-1">Create an account</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">
        Enter your email below to create your account
      </p>

      <div className="space-y-2 mb-4">
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
          <Github size={16} />
          GitHub
        </button>
        <button className="w-full inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-[hsl(var(--border))] bg-transparent px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]">
          <Mail size={16} />
          Google
        </button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[hsl(var(--border))]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[hsl(var(--card))] px-2 text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label htmlFor="create-account-email" className="text-sm font-medium text-[hsl(var(--foreground))]">Email</label>
          <input
            id="create-account-email"
            type="email"
            placeholder="m@example.com"
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="create-account-password" className="text-sm font-medium text-[hsl(var(--foreground))]">Password</label>
          <input
            id="create-account-password"
            type="password"
            className="flex w-full rounded-[var(--radius)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm text-[hsl(var(--foreground))] shadow-sm placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]"
          />
        </div>
      </div>

      <button className="mt-4 w-full inline-flex items-center justify-center rounded-[var(--radius)] bg-[hsl(var(--primary))] px-4 py-2 text-sm font-medium text-[hsl(var(--primary-foreground))] transition-opacity hover:opacity-90">
        Create account
      </button>

      <p className="mt-4 text-center text-xs text-[hsl(var(--muted-foreground))]">
        Already have an account?{' '}
        <a href="#" className="text-[hsl(var(--foreground))] underline underline-offset-2 hover:opacity-80">
          Sign in
        </a>
      </p>
    </div>
  )
}
