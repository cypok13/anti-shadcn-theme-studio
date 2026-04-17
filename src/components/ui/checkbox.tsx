'use client'

import * as React from 'react'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <div
      className={[
        'group relative h-4 w-4 shrink-0',
        props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <input
        ref={ref}
        type="checkbox"
        className={[
          'peer absolute inset-0 h-full w-full opacity-0',
          props.disabled ? 'cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        {...props}
      />
      <div
        className={[
          // base
          'pointer-events-none h-4 w-4 rounded-[2px]',
          'border border-[hsl(var(--border))]',
          'flex items-center justify-center',
          'transition-colors duration-150',
          // checked
          'peer-checked:bg-[hsl(var(--primary))] peer-checked:border-[hsl(var(--primary))]',
          // focus ring
          'peer-focus-visible:ring-2',
          'peer-focus-visible:ring-[hsl(var(--ring))]',
          'peer-focus-visible:ring-offset-2',
          'peer-focus-visible:ring-offset-[hsl(var(--background))]',
        ].join(' ')}
      >
        <svg
          className="hidden h-3 w-3 text-[hsl(var(--primary-foreground))] group-has-[input:checked]:block"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 8"
        >
          <path
            d="M1 4L3.5 6.5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
)

Checkbox.displayName = 'Checkbox'
