'use client'

import { useState, useEffect } from 'react'
import { Check, Copy } from 'lucide-react'

interface DocCodeBlockProps {
  code: string
  label?: string
  language?: string
}

export function DocCodeBlock({ code, label, language = 'tsx' }: DocCodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    import('shiki').then(({ codeToHtml }) =>
      codeToHtml(code, {
        lang: language ?? 'tsx',
        themes: { light: 'github-light', dark: 'github-dark-dimmed' },
        defaultColor: false,
      })
    ).then((result) => {
      if (!cancelled) setHighlightedHtml(result)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [code, language])

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg overflow-hidden text-sm border border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.6)]">
        <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
          {label ?? language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
          style={copied ? { color: 'hsl(var(--primary))' } : undefined}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      {/* shiki output is from hardcoded strings only — not user input, XSS-safe */}
      {highlightedHtml ? (
        <div
          className="[&_.shiki]:bg-transparent [&_.shiki]:m-0 [&_.shiki]:p-4 [&_.shiki]:overflow-x-auto [&_.shiki]:leading-relaxed [&_code]:font-[inherit] [&_pre]:font-[inherit]"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 leading-relaxed">
          <code className="text-[hsl(var(--foreground))]" style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            {code}
          </code>
        </pre>
      )}
    </div>
  )
}
