'use client'

import React from 'react'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outlined' | 'filled'
  isError?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const sizeClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'h-8 px-2 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const leftPaddingClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'pl-9',
  md: 'pl-10',
  lg: 'pl-11',
}

const rightPaddingClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: 'pr-9',
  md: 'pr-10',
  lg: 'pr-11',
}

const iconSizeClasses: Record<NonNullable<InputProps['size']>, string> = {
  sm: '[&>svg]:h-4 [&>svg]:w-4',
  md: '[&>svg]:h-4 [&>svg]:w-4',
  lg: '[&>svg]:h-5 [&>svg]:w-5',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = 'md', variant = 'outlined', isError = false, leftIcon, rightIcon, className, ...props }, ref) => {
    const isOutlined = variant === 'outlined'
    const isFilled = variant === 'filled'

    const base = [
      'w-full rounded-[var(--radius)]',
      'text-[hsl(var(--foreground))]',
      'transition-colors [transition-duration:var(--duration-fast)] outline-none',
      'placeholder:text-[hsl(var(--muted-foreground))]',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'read-only:bg-[hsl(var(--muted))] read-only:cursor-default',
      // outlined variant
      isOutlined && 'border bg-[hsl(var(--background))]',
      isOutlined && 'hover:border-[hsl(var(--ring))]',
      isOutlined && 'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(var(--background))]',
      isOutlined && (isError ? 'border-[hsl(var(--destructive))]' : 'border-[hsl(var(--border))]'),
      // filled variant
      isFilled && 'bg-[hsl(var(--muted))] border-0 border-b-2 rounded-b-none',
      isFilled && 'hover:border-b-[hsl(var(--ring))]',
      isFilled && 'focus-visible:outline-none focus-visible:border-b-[hsl(var(--ring))]',
      isFilled && (isError ? 'border-b-[hsl(var(--destructive))]' : 'border-b-[hsl(var(--border))]'),
      // size (base px, may be overridden by icon padding below)
      sizeClasses[size],
      // icon padding overrides
      leftIcon && leftPaddingClasses[size],
      rightIcon && rightPaddingClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(' ')

    const iconColorClass = isError
      ? 'text-[hsl(var(--destructive))]'
      : 'text-[hsl(var(--muted-foreground))]'

    const hasIcon = leftIcon || rightIcon

    const inputEl = (
      <input
        ref={ref}
        aria-invalid={isError || undefined}
        className={base}
        {...props}
      />
    )

    if (!hasIcon) return inputEl

    return (
      <div className="relative">
        {leftIcon && (
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
              iconColorClass,
              iconSizeClasses[size],
            ].join(' ')}
          >
            {leftIcon}
          </span>
        )}
        {inputEl}
        {rightIcon && (
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
              iconColorClass,
              iconSizeClasses[size],
            ].join(' ')}
          >
            {rightIcon}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export interface FieldProps {
  id: string
  label: string
  helperText?: string
  errorMessage?: string
  isError?: boolean
  required?: boolean
  inputProps?: InputProps & { type?: string }
  className?: string
}

export function Field({
  id,
  label,
  helperText,
  errorMessage,
  isError,
  required,
  inputProps,
  className,
}: FieldProps) {
  const describedBy = [
    helperText && `${id}-helper`,
    isError && errorMessage && `${id}-error`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      <label htmlFor={id} className="text-sm font-medium text-[hsl(var(--foreground))]">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-[hsl(var(--destructive))]">
            *
          </span>
        )}
      </label>
      <Input
        id={id}
        isError={isError}
        aria-required={required || undefined}
        aria-describedby={describedBy || undefined}
        {...inputProps}
      />
      {helperText && (
        <span id={`${id}-helper`} className="text-xs text-[hsl(var(--muted-foreground))]">
          {helperText}
        </span>
      )}
      {isError && errorMessage && (
        <span id={`${id}-error`} role="alert" className="text-xs text-[hsl(var(--destructive))]">
          {errorMessage}
        </span>
      )}
    </div>
  )
}
