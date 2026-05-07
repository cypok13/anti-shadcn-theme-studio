'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function EmailCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) setStatus('success')
      else if (res.status === 409) setStatus('duplicate')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ position: 'relative', marginTop: 32 }}>
      {/* Skeleton block — suggests more content exists */}
      <div style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 4px' }}>
          <div style={{ height: 16, width: '75%', borderRadius: 6, background: 'hsl(var(--muted))' }} />
          <div style={{ height: 16, width: '55%', borderRadius: 6, background: 'hsl(var(--muted))' }} />
          <div style={{ height: 16, width: '65%', borderRadius: 6, background: 'hsl(var(--muted))' }} />
          <div style={{ height: 16, width: '40%', borderRadius: 6, background: 'hsl(var(--muted))' }} />
        </div>

        {/* Gradient overlay over skeleton — bottom-up fade */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          background: 'linear-gradient(to top, hsl(var(--background)), transparent)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* CTA content */}
      <div style={{
        padding: '32px 24px',
        textAlign: 'center',
        borderTop: '1px solid hsl(var(--border))',
      }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'hsl(var(--foreground))', marginBottom: 8 }}>
          Want the full component library?
        </div>
        <div style={{ fontSize: 14, color: 'hsl(var(--muted-foreground))', marginBottom: 20 }}>
          Leave your email — we'll notify you when it's ready.
        </div>

        {status === 'success' ? (
          <div style={{ color: 'hsl(var(--primary))', fontWeight: 500 }}>
            You're on the list!
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', maxWidth: 460, margin: '0 auto' }}>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{ flex: '1 1 0', minWidth: 160, maxWidth: 280 }}
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Notify me'}
            </Button>
          </form>
        )}

        {status === 'duplicate' && (
          <div style={{ marginTop: 8, fontSize: 13, color: 'hsl(var(--muted-foreground))' }}>
            You're already on the list!
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 8, fontSize: 13, color: 'hsl(var(--destructive))' }}>
            Something went wrong. Try again.
          </div>
        )}
      </div>
    </div>
  )
}
