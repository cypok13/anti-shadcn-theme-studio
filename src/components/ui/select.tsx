'use client'

import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

// --- Icons ---

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

// --- Size map ---

type SelectSize = 'sm' | 'md' | 'lg'

const triggerSizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-sm',
}

const chevronSizeClasses: Record<SelectSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
}

// --- SelectTrigger ---

export interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  size?: SelectSize
  isError?: boolean
}

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ size = 'md', isError, className, children, id, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      ref={ref}
      id={id}
      aria-invalid={isError ? 'true' : undefined}
      aria-haspopup="listbox"
      className={[
        'flex w-full items-center justify-between gap-2',
        'rounded-[var(--radius)] border',
        'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
        'cursor-pointer outline-none transition-colors',
        'data-[placeholder]:text-[hsl(var(--muted-foreground))]',
        'hover:bg-[hsl(var(--accent)/0.5)]',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isError
          ? 'border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]'
          : 'border-[hsl(var(--input))] focus-visible:ring-[hsl(var(--ring))]',
        triggerSizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={[
            'shrink-0 text-[hsl(var(--muted-foreground))]',
            chevronSizeClasses[size],
          ].join(' ')}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = 'SelectTrigger'

// --- SelectScrollUpButton ---

export const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={[
      'flex cursor-default items-center justify-center py-1',
      'text-[hsl(var(--muted-foreground))]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    <ChevronUpIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = 'SelectScrollUpButton'

// --- SelectScrollDownButton ---

export const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={[
      'flex cursor-default items-center justify-center py-1',
      'text-[hsl(var(--muted-foreground))]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    <ChevronDownIcon className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = 'SelectScrollDownButton'

// --- SelectContent ---

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      className={[
        'relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden',
        'rounded-[var(--radius)] border border-[hsl(var(--border))]',
        'bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
        'shadow-md',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2',
        'data-[side=top]:slide-in-from-bottom-2',
        'data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

// --- SelectLabel ---

export const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={[
      'px-2 py-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
SelectLabel.displayName = 'SelectLabel'

// --- SelectItem ---

export interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  leadingIcon?: React.ReactNode
  children?: React.ReactNode
}

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ className, children, leadingIcon, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={[
      'relative flex w-full cursor-default select-none items-center',
      'rounded-sm pl-8 pr-2 py-1.5 text-sm outline-none',
      'data-[highlighted]:bg-[hsl(var(--accent))] data-[highlighted]:text-[hsl(var(--accent-foreground))]',
      'data-[highlighted]:outline-none',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="h-3 w-3" />
      </SelectPrimitive.ItemIndicator>
    </span>

    {leadingIcon && (
      <span
        aria-hidden="true"
        className="mr-2 flex shrink-0 items-center text-[hsl(var(--muted-foreground))] [&>svg]:h-4 [&>svg]:w-4"
      >
        {leadingIcon}
      </span>
    )}

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

// --- SelectSeparator ---

export const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={[
      '-mx-1 my-1 h-px bg-[hsl(var(--muted))]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
SelectSeparator.displayName = 'SelectSeparator'

// --- SelectField ---

export interface SelectFieldProps {
  id: string
  label?: string
  placeholder?: string
  helperText?: string
  errorMessage?: string
  isError?: boolean
  required?: boolean
  disabled?: boolean
  size?: SelectSize
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function SelectField({
  id,
  label,
  placeholder,
  helperText,
  errorMessage,
  isError,
  required,
  disabled,
  size = 'md',
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: SelectFieldProps) {
  const labelId = `${id}-label`
  const describedBy = [
    helperText && `${id}-helper`,
    isError && errorMessage && `${id}-error`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      {label && (
        <label
          id={labelId}
          htmlFor={id}
          className="text-sm font-medium text-[hsl(var(--foreground))]"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-[hsl(var(--destructive))]">
              *
            </span>
          )}
        </label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          size={size}
          isError={isError}
          aria-required={required ? 'true' : undefined}
          aria-describedby={describedBy || undefined}
          aria-labelledby={label ? labelId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
      {helperText && (
        <span
          id={`${id}-helper`}
          className="text-xs text-[hsl(var(--muted-foreground))]"
        >
          {helperText}
        </span>
      )}
      {isError && errorMessage && (
        <span
          id={`${id}-error`}
          role="alert"
          className="text-xs text-[hsl(var(--destructive))]"
        >
          {errorMessage}
        </span>
      )}
    </div>
  )
}
