'use client'

import * as React from 'react'
import ReactDOM from 'react-dom'

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Size map ─────────────────────────────────────────────────────────────────

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

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectItem {
  value: string
  label: string
  disabled?: boolean
  leadingIcon?: React.ReactNode
}

interface SelectContextValue {
  value: string
  onValueChange: (v: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
  listboxId: string
  triggerId: string
  placeholder: string
  disabled: boolean
  items: SelectItem[]
  registerItem: (item: SelectItem) => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error('Select components must be used within <Select>')
  return ctx
}

// ─── Select root ──────────────────────────────────────────────────────────────

export interface SelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  children: React.ReactNode
}

export function Select({
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  children,
}: SelectProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const currentValue = value !== undefined ? value : internalValue
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const listboxId = React.useId()
  const triggerId = React.useId()
  const [items, setItems] = React.useState<SelectItem[]>([])

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
      setOpen(false)
    },
    [value, onValueChange]
  )

  const registerItem = React.useCallback((item: SelectItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.value === item.value)) return prev
      return [...prev, item]
    })
  }, [])

  return (
    <SelectContext.Provider
      value={{
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: setOpen,
        triggerRef,
        listboxId,
        triggerId,
        placeholder: '',
        disabled,
        items,
        registerItem,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

// ─── SelectValue (display selected label) ────────────────────────────────────

export function SelectValue({ placeholder = '' }: { placeholder?: string }) {
  const { value, items } = useSelectContext()
  const found = items.find((i) => i.value === value)
  if (!value || !found) {
    return <span className="text-[hsl(var(--muted-foreground))]">{placeholder}</span>
  }
  return (
    <span className="flex items-center gap-2 truncate">
      {found.leadingIcon && <span aria-hidden="true" className="shrink-0">{found.leadingIcon}</span>}
      {found.label}
    </span>
  )
}

// ─── SelectTrigger ────────────────────────────────────────────────────────────

export interface SelectTriggerProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  size?: SelectSize
  isError?: boolean
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ size = 'md', isError, className, children, id, ...props }, ref) => {
    const { open, onOpenChange, triggerRef, listboxId, triggerId, disabled } = useSelectContext()

    const setRef = (el: HTMLButtonElement | null) => {
      triggerRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el
    }

    return (
      <button
        ref={setRef}
        id={id ?? triggerId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-invalid={isError ? 'true' : undefined}
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpenChange(!open)
          } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && !open) {
            e.preventDefault()
            onOpenChange(true)
          }
        }}
        className={[
          'flex w-full items-center justify-between gap-2',
          'rounded-[var(--radius)] border',
          'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
          'cursor-pointer outline-none transition-colors',
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
        <ChevronDownIcon
          className={[
            'shrink-0 text-[hsl(var(--muted-foreground))]',
            chevronSizeClasses[size],
          ].join(' ')}
        />
      </button>
    )
  }
)
SelectTrigger.displayName = 'SelectTrigger'

// ─── SelectGroup ──────────────────────────────────────────────────────────────

export function SelectGroup({ children }: { children: React.ReactNode }) {
  return <div role="group">{children}</div>
}

// ─── SelectLabel ──────────────────────────────────────────────────────────────

export const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'px-2 py-1.5 text-xs font-semibold text-[hsl(var(--muted-foreground))]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
SelectLabel.displayName = 'SelectLabel'

// ─── SelectItem ───────────────────────────────────────────────────────────────

export interface SelectItemProps extends React.HTMLAttributes<HTMLLIElement> {
  value: string
  disabled?: boolean
  leadingIcon?: React.ReactNode
  children?: React.ReactNode
}

export const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, disabled = false, leadingIcon, ...props }, ref) => {
    const { value: selectedValue, onValueChange, registerItem } = useSelectContext()
    const isSelected = selectedValue === value
    const label = typeof children === 'string' ? children : ''

    React.useEffect(() => {
      registerItem({ value, label, disabled, leadingIcon })
    }, [value, label, disabled, leadingIcon, registerItem])

    return (
      <li
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        data-disabled={disabled || undefined}
        onClick={() => { if (!disabled) onValueChange(value) }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault()
            onValueChange(value)
          }
        }}
        tabIndex={disabled ? -1 : 0}
        className={[
          'relative flex w-full cursor-default select-none items-center',
          'rounded-sm pl-8 pr-2 py-1.5 text-sm outline-none',
          'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
          'focus:bg-[hsl(var(--accent))] focus:text-[hsl(var(--accent-foreground))]',
          'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
          {isSelected && <CheckIcon className="h-3 w-3" />}
        </span>

        {leadingIcon && (
          <span
            aria-hidden="true"
            className="mr-2 flex shrink-0 items-center text-[hsl(var(--muted-foreground))] [&>svg]:h-4 [&>svg]:w-4"
          >
            {leadingIcon}
          </span>
        )}

        {children}
      </li>
    )
  }
)
SelectItem.displayName = 'SelectItem'

// ─── SelectSeparator ──────────────────────────────────────────────────────────

export const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={['-mx-1 my-1 h-px bg-[hsl(var(--muted))]', className].filter(Boolean).join(' ')}
      {...props}
    />
  )
)
SelectSeparator.displayName = 'SelectSeparator'

// ─── SelectContent ────────────────────────────────────────────────────────────

export const SelectContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, children, ...props }, _ref) => {
    const { open, onOpenChange, triggerRef, listboxId, triggerId } = useSelectContext()
    const floatingRef = React.useRef<HTMLUListElement | null>(null)
    const [pos, setPos] = React.useState<{
      top?: number; bottom?: number; left: number; minWidth: number; maxHeight: number
    } | null>(null)

    React.useLayoutEffect(() => {
      if (!open || !triggerRef.current) {
        setPos(null)
        return
      }

      const compute = () => {
        if (!triggerRef.current) return
        const r = triggerRef.current.getBoundingClientRect()
        const gap = 4
        const padding = 8
        const spaceBelow = window.innerHeight - r.bottom - gap - padding
        const spaceAbove = r.top - gap - padding
        const preferAbove = spaceBelow < 120 && spaceAbove > spaceBelow
        const maxHeight = Math.max(80, preferAbove ? spaceAbove : spaceBelow)
        const left = Math.min(r.left, window.innerWidth - r.width - padding)
        if (preferAbove) {
          setPos({ bottom: window.innerHeight - r.top + gap, left, minWidth: r.width, maxHeight })
        } else {
          setPos({ top: r.bottom + gap, left, minWidth: r.width, maxHeight })
        }
      }

      compute()
      window.addEventListener('scroll', compute, true)
      window.addEventListener('resize', compute)
      return () => {
        window.removeEventListener('scroll', compute, true)
        window.removeEventListener('resize', compute)
      }
    }, [open, triggerRef])

    React.useEffect(() => {
      if (!open) return

      const handleMouseDown = (e: MouseEvent) => {
        const floating = floatingRef.current
        const trigger = triggerRef.current
        if (
          floating && !floating.contains(e.target as Node) &&
          trigger && !trigger.contains(e.target as Node)
        ) {
          onOpenChange(false)
        }
      }

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onOpenChange(false)
          triggerRef.current?.focus()
          return
        }
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          const floating = floatingRef.current
          if (!floating) return
          const options = Array.from(floating.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])'))
          if (options.length === 0) return
          const currentIdx = options.indexOf(document.activeElement as HTMLElement)
          if (currentIdx === -1) {
            options[0].focus()
          } else {
            const next = e.key === 'ArrowDown'
              ? (currentIdx + 1) % options.length
              : (currentIdx - 1 + options.length) % options.length
            options[next].focus()
          }
        }
      }

      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('keydown', handleKey)
      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('keydown', handleKey)
      }
    }, [open, onOpenChange, triggerRef])

    React.useEffect(() => {
      if (!open) return
      const timer = setTimeout(() => {
        const first = floatingRef.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
        first?.focus()
      }, 10)
      return () => clearTimeout(timer)
    }, [open])

    if (typeof document === 'undefined' || !open || !pos) return null

    return ReactDOM.createPortal(
      <ul
        ref={floatingRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={triggerId}
        style={{
          position: 'fixed',
          top: pos.top,
          bottom: pos.bottom,
          left: pos.left,
          minWidth: pos.minWidth,
          maxHeight: pos.maxHeight,
          overflowY: 'auto',
        }}
        className={[
          'z-[var(--z-dropdown)]',
          'rounded-[var(--radius)] border border-[hsl(var(--border))]',
          'bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
          'p-1 [box-shadow:var(--shadow-md)]',
          'animate-in fade-in-0 zoom-in-95 [transition-duration:var(--duration-fast)]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </ul>,
      document.body
    )
  }
)
SelectContent.displayName = 'SelectContent'

// ─── SelectField ──────────────────────────────────────────────────────────────

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
