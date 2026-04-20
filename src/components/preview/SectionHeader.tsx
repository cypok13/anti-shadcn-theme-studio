import { ExternalLink } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  docsHref?: string
}

export function SectionHeader({ title, docsHref }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-3 mb-6">
      <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">{title}</h2>
      {docsHref && (
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          View in docs
          <ExternalLink className="size-3" />
        </a>
      )}
    </div>
  )
}
