'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { PRESETS } from '@/lib/themes/registry'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

const RADIUS_OPTIONS = [
  { label: 'None', value: '0rem' },
  { label: 'Small', value: '0.3rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large', value: '0.75rem' },
  { label: 'Full', value: '1rem' },
]

const labelClass =
  'text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3'

export function ThemeSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentTheme = searchParams.get('theme') ?? PRESETS[0].id
  const currentMode = searchParams.get('mode') ?? 'light'
  const currentRadius = searchParams.get('radius') ?? null

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, value)
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href)
  }, [])

  return (
    <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] shadow-md p-5 space-y-6">
      {/* Theme preset */}
      <section>
        <p className={labelClass}>Theme</p>
        <div className="flex flex-col gap-1">
          {PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={currentTheme === preset.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setParam('theme', preset.id)}
              className="w-full justify-start"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Appearance */}
      <section>
        <p className={labelClass}>Appearance</p>
        <div className="flex gap-2">
          {(['light', 'dark'] as const).map((mode) => (
            <Button
              key={mode}
              variant={currentMode === mode ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setParam('mode', mode)}
              className="flex-1 capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Radius */}
      <section>
        <p className={labelClass}>Radius</p>
        <div className="flex flex-col gap-1">
          {RADIUS_OPTIONS.map((opt) => {
            const isActive = currentRadius ? currentRadius === opt.value : opt.value === '0.5rem'
            return (
              <Button
                key={opt.value}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setParam('radius', opt.value)}
                className="w-full justify-start gap-3"
              >
                <span
                  className="shrink-0 w-5 h-4 border-2 border-current"
                  style={{ borderRadius: opt.value === '1rem' ? '8px' : opt.value }}
                  aria-hidden="true"
                />
                <span>{opt.label}</span>
                <span className={cn('ml-auto text-xs', isActive ? 'opacity-80' : 'opacity-50')}>{opt.value}</span>
              </Button>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* Copy Theme */}
      <Button variant="secondary" className="w-full" onClick={handleCopy}>
        Copy Theme URL
      </Button>
    </div>
  )
}
