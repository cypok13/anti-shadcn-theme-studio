'use client'

import * as React from 'react'

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  checked?: boolean | 'indeterminate'
  error?: boolean
  errorMessage?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, error, errorMessage, required, ...props }, ref) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)
    const errorId = React.useId()

    React.useImperativeHandle(ref, () => innerRef.current as HTMLInputElement)

    const isIndeterminate = checked === 'indeterminate'
    const isChecked = checked === true

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = isIndeterminate
      }
    }, [isIndeterminate])

    const dataState: 'checked' | 'unchecked' | 'indeterminate' = isIndeterminate
      ? 'indeterminate'
      : isChecked
        ? 'checked'
        : 'unchecked'

    const describedBy = errorMessage
      ? [props['aria-describedby'], errorId].filter(Boolean).join(' ')
      : props['aria-describedby']

    const box = (
      <div
        data-state={dataState}
        data-error={error ? 'true' : undefined}
        className={[
          'group relative h-4 w-4 shrink-0',
          props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={innerRef}
          type="checkbox"
          checked={isChecked}
          required={required}
          aria-required={required ? true : undefined}
          aria-invalid={error ? true : undefined}
          aria-checked={isIndeterminate ? 'mixed' : isChecked}
          aria-describedby={describedBy}
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
            'transition-colors [transition-duration:var(--duration-fast)]',
            // checked
            'peer-checked:bg-[hsl(var(--primary))] peer-checked:border-[hsl(var(--primary))]',
            // indeterminate (peer-checked won't match; use group data-state)
            'group-data-[state=indeterminate]:bg-[hsl(var(--primary))]',
            'group-data-[state=indeterminate]:border-[hsl(var(--primary))]',
            // focus ring
            'peer-focus-visible:ring-2',
            'peer-focus-visible:ring-[hsl(var(--ring))]',
            'peer-focus-visible:ring-offset-2',
            'peer-focus-visible:ring-offset-[hsl(var(--background))]',
            // error — MUST come last and use !important to beat peer-checked/indeterminate border
            'group-data-[error=true]:!border-[hsl(var(--destructive))]',
            // error focus ring override
            'group-data-[error=true]:peer-focus-visible:!ring-[hsl(var(--destructive))]',
          ].join(' ')}
        >
          <svg
            className="hidden h-3 w-3 text-[hsl(var(--primary-foreground))] group-data-[state=checked]:block"
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
          <svg
            className="hidden h-3 w-3 text-[hsl(var(--primary-foreground))] group-data-[state=indeterminate]:block"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M2 6H10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    )

    if (!errorMessage) {
      return box
    }

    // Judgment call: when errorMessage is provided, wrap in inline-flex column so
    // the box still baseline-aligns inside a label row, with message stacked below.
    return (
      <span className="inline-flex flex-col gap-1">
        {box}
        <p
          id={errorId}
          className="text-xs text-[hsl(var(--destructive))]"
        >
          {errorMessage}
        </p>
      </span>
    )
  }
)

Checkbox.displayName = 'Checkbox'
