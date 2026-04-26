'use client'

import * as React from 'react'

type SwitchSize = 'sm' | 'md' | 'lg'

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  size?: SwitchSize
  required?: boolean
}

const trackSizeMap: Record<SwitchSize, string> = {
  sm: 'w-7 h-4',
  md: 'w-11 h-6',
  lg: 'w-14 h-8',
}

const thumbSizeMap: Record<SwitchSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
}

const thumbCheckedTranslateMap: Record<SwitchSize, string> = {
  sm: 'data-[state=checked]:translate-x-3',
  md: 'data-[state=checked]:translate-x-5',
  lg: 'data-[state=checked]:translate-x-7',
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      disabled,
      required,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isControlled = checked !== undefined
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked)
    const isChecked = isControlled ? checked : internalChecked

    const state = isChecked ? 'checked' : 'unchecked'

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return
      const next = !isChecked
      if (!isControlled) setInternalChecked(next)
      onCheckedChange?.(next)
      onClick?.(e)
    }

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isChecked}
        aria-required={required}
        data-state={state}
        disabled={disabled}
        onClick={handleClick}
        className={[
          'relative inline-flex shrink-0 items-center rounded-full p-0.5',
          'cursor-pointer',
          'transition-colors [transition-duration:var(--duration-normal)]',
          'bg-[hsl(var(--input))]',
          'data-[state=checked]:bg-[hsl(var(--primary))]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[hsl(var(--ring))]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[hsl(var(--background))]',
          trackSizeMap[size],
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span
          data-state={state}
          className={[
            'rounded-full bg-[hsl(var(--primary-foreground))] [box-shadow:var(--shadow-sm)]',
            'transition-transform [transition-duration:var(--duration-normal)]',
            'data-[state=unchecked]:translate-x-0',
            thumbCheckedTranslateMap[size],
            thumbSizeMap[size],
          ].join(' ')}
        />
      </button>
    )
  }
)

Switch.displayName = 'Switch'
