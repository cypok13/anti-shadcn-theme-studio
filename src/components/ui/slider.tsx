'use client'

import * as React from 'react'

type SliderSize = 'sm' | 'md'

export interface SliderProps {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: SliderSize
  label?: string
  showValue?: boolean
  formatValue?: (value: number) => string
  onValueChange?: (value: number) => void
  onValueCommit?: (value: number) => void
  className?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

const trackHeightMap: Record<SliderSize, string> = {
  sm: 'h-1',
  md: 'h-1.5',
}

const thumbSizeMap: Record<SliderSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max)
}

function snap(v: number, min: number, step: number): number {
  const steps = Math.round((v - min) / step)
  return min + steps * step
}

function roundToStepPrecision(v: number, step: number): number {
  // Avoid float drift like 0.1 + 0.2 = 0.30000000000000004
  const decimals = (step.toString().split('.')[1] ?? '').length
  return Number(v.toFixed(decimals))
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      size = 'md',
      label,
      showValue = false,
      formatValue,
      onValueChange,
      onValueCommit,
      className,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const initial = clamp(
      snap(value ?? defaultValue ?? min, min, step),
      min,
      max
    )
    const [internalValue, setInternalValue] = React.useState<number>(initial)
    const currentValue = isControlled
      ? clamp(snap(value as number, min, step), min, max)
      : internalValue

    const trackRef = React.useRef<HTMLSpanElement | null>(null)
    const thumbRef = React.useRef<HTMLSpanElement | null>(null)
    const [isDragging, setIsDragging] = React.useState(false)
    const lastEmittedRef = React.useRef<number>(currentValue)

    React.useImperativeHandle(ref, () => thumbRef.current as HTMLSpanElement)

    const range = max - min
    const percent = range === 0 ? 0 : ((currentValue - min) / range) * 100
    const largeStep = Math.max(step * 10, range / 10)

    const commitValue = React.useCallback(
      (next: number, fireCommit: boolean) => {
        const snapped = clamp(
          roundToStepPrecision(snap(next, min, step), step),
          min,
          max
        )
        if (snapped !== lastEmittedRef.current) {
          lastEmittedRef.current = snapped
          if (!isControlled) setInternalValue(snapped)
          onValueChange?.(snapped)
        }
        if (fireCommit) onValueCommit?.(snapped)
      },
      [isControlled, max, min, onValueChange, onValueCommit, step]
    )

    const valueFromClientX = React.useCallback(
      (clientX: number): number => {
        const trackEl = trackRef.current
        if (!trackEl) return currentValue
        const rect = trackEl.getBoundingClientRect()
        if (rect.width === 0) return currentValue
        const ratio = clamp((clientX - rect.left) / rect.width, 0, 1)
        return min + ratio * range
      },
      [currentValue, min, range]
    )

    const handleTrackPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (disabled) return
      e.preventDefault()
      const next = valueFromClientX(e.clientX)
      commitValue(next, false)
      thumbRef.current?.focus()

      const thumb = thumbRef.current
      if (thumb) {
        thumb.setPointerCapture(e.pointerId)
        setIsDragging(true)
      }
    }

    const handleThumbPointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()
      const thumb = thumbRef.current
      if (thumb) {
        thumb.setPointerCapture(e.pointerId)
        setIsDragging(true)
      }
    }

    const handleThumbPointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!isDragging || disabled) return
      const next = valueFromClientX(e.clientX)
      commitValue(next, false)
    }

    const handleThumbPointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
      if (!isDragging) return
      const thumb = thumbRef.current
      if (thumb && thumb.hasPointerCapture(e.pointerId)) {
        thumb.releasePointerCapture(e.pointerId)
      }
      setIsDragging(false)
      onValueCommit?.(lastEmittedRef.current)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return
      let next = currentValue
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = currentValue + step
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          next = currentValue - step
          break
        case 'PageUp':
          next = currentValue + largeStep
          break
        case 'PageDown':
          next = currentValue - largeStep
          break
        case 'Home':
          next = min
          break
        case 'End':
          next = max
          break
        default:
          return
      }
      e.preventDefault()
      commitValue(next, false)
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return
      const navKeys = [
        'ArrowRight',
        'ArrowLeft',
        'ArrowUp',
        'ArrowDown',
        'PageUp',
        'PageDown',
        'Home',
        'End',
      ]
      if (navKeys.includes(e.key)) {
        onValueCommit?.(lastEmittedRef.current)
      }
    }

    const valueText = formatValue ? formatValue(currentValue) : undefined
    const accessibleLabel = ariaLabel ?? label

    return (
      <span
        className={[
          'inline-flex items-center gap-3 select-none w-full',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        data-dragging={isDragging ? 'true' : 'false'}
      >
        {label && !ariaLabel && !ariaLabelledby ? (
          <span className="sr-only">{label}</span>
        ) : null}

        {/* Track */}
        <span
          ref={trackRef}
          onPointerDown={handleTrackPointerDown}
          className={[
            'relative flex-1 rounded-full bg-[hsl(var(--muted))]',
            disabled ? '' : 'cursor-pointer',
            'touch-none',
            trackHeightMap[size],
          ].join(' ')}
        >
          {/* Range fill */}
          <span
            aria-hidden="true"
            className={[
              'absolute left-0 top-0 h-full rounded-full bg-[hsl(var(--primary))]',
              isDragging
                ? ''
                : 'motion-safe:transition-[width] motion-safe:duration-100',
            ].join(' ')}
            style={{ width: `${percent}%` }}
          />
          {/* Thumb */}
          <span
            ref={thumbRef}
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-label={accessibleLabel}
            aria-labelledby={ariaLabelledby}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-valuetext={valueText}
            aria-orientation="horizontal"
            aria-disabled={disabled || undefined}
            data-state={isDragging ? 'dragging' : 'idle'}
            data-dragging={isDragging ? 'true' : 'false'}
            onPointerDown={handleThumbPointerDown}
            onPointerMove={handleThumbPointerMove}
            onPointerUp={handleThumbPointerUp}
            onPointerCancel={handleThumbPointerUp}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            style={{ left: `${percent}%` }}
            className={[
              'absolute top-1/2 -translate-x-1/2 -translate-y-1/2',
              'rounded-full border-2 border-[hsl(var(--primary))] bg-[hsl(var(--background))]',
              disabled ? 'cursor-not-allowed' : isDragging ? 'cursor-grabbing' : 'cursor-grab',
              'outline-none',
              'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
              'hover:ring-4 hover:ring-[hsl(var(--primary)/0.15)]',
              'motion-safe:transition-shadow motion-safe:duration-150',
              isDragging ? '' : 'motion-safe:transition-[left] motion-safe:duration-100',
              // 44px touch hit zone (invisible)
              'before:absolute before:inset-y-[-12px] before:inset-x-[-12px] before:content-[""]',
              thumbSizeMap[size],
            ]
              .filter(Boolean)
              .join(' ')}
          />
        </span>

        {showValue ? (
          <span className="font-medium tabular-nums text-sm text-[hsl(var(--foreground))] min-w-[3ch] text-right">
            {valueText ?? currentValue}
          </span>
        ) : null}
      </span>
    )
  }
)

Slider.displayName = 'Slider'
