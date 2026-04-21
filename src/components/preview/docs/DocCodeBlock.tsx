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
    <div
      className="rounded-lg overflow-hidden text-sm"
      style={{
        background: '#111113',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {label ?? language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: copied ? 'rgba(74,222,128,0.9)' : 'rgba(255,255,255,0.4)' }}
          aria-label="Copy code"
        >
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 leading-relaxed">
        <code style={{ color: '#e4e4e7', fontFamily: "'Geist Mono', 'JetBrains Mono', monospace", fontSize: '13px' }}>
          {code}
        </code>
      </pre>
    </div>
  )
}
