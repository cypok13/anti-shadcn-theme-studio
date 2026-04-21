'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

interface DocCodeBlockProps {
  code: string
  label?: string
  language?: string
}

export function DocCodeBlock({ code, label, language = 'tsx' }: DocCodeBlockProps) {
  const [copied, setCopied] = useState(false)

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
      <pre className="overflow-x-auto p-4 leading-relaxed">
        <code className="text-[hsl(var(--foreground))]" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '13px' }}>
          {code}
        </code>
      </pre>
    </div>
  )
}
