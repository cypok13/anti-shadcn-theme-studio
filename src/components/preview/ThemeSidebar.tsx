'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { PRESETS } from '@/lib/themes/registry'
import { Separator } from '../ui/separator'

const RADIUS_OPTIONS = [
  { label: 'None', value: '0rem' },
  { label: 'Small', value: '0.3rem' },
  { label: 'Medium', value: '0.5rem' },
  { label: 'Large', value: '0.75rem' },
  { label: 'Full', value: '1rem' },
]

const labelClass =
  'text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-widest mb-3'

const activeClass =
  'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'

const inactiveClass =
  'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:bg-[hsl(var(--accent))]'

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
            <button
              key={preset.id}
              onClick={() => setParam('theme', preset.id)}
              className={[
                'cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                currentTheme === preset.id ? activeClass : inactiveClass,
              ].join(' ')}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Appearance */}
      <section>
        <p className={labelClass}>Appearance</p>
        <div className="flex gap-2">
          {(['light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setParam('mode', mode)}
              className={[
                'cursor-pointer flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                currentMode === mode ? activeClass : inactiveClass,
              ].join(' ')}
            >
              {mode}
            </button>
          ))}
        </div>
      </section>

      <Separator />

      {/* Radius */}
      <section>
        <p className={labelClass}>Radius</p>
        <div className="flex flex-col gap-1">
          {RADIUS_OPTIONS.map((opt) => {
            const isActive = currentRadius
              ? currentRadius === opt.value
              : opt.value === '0.5rem'
            return (
              <button
                key={opt.value}
                onClick={() => setParam('radius', opt.value)}
                className={[
                  'cursor-pointer flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? activeClass : inactiveClass,
                ].join(' ')}
              >
                <span
                  className="shrink-0 w-5 h-4 border-2 border-current"
                  style={{ borderRadius: opt.value === '1rem' ? '8px' : opt.value }}
                  aria-hidden="true"
                />
                <span>{opt.label}</span>
                <span className="ml-auto text-xs opacity-60">{opt.value}</span>
              </button>
            )
          })}
        </div>
      </section>

      <Separator />

      {/* Copy Theme */}
      <button
        onClick={handleCopy}
        className={[
          'cursor-pointer w-full py-2 rounded-lg text-sm font-medium transition-colors',
          inactiveClass,
        ].join(' ')}
      >
        Copy Theme URL
      </button>
    </div>
  )
}
