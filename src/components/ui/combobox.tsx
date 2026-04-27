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

// ─── Size map ─────────────────────────────────────────────────────────────────

type ComboboxSize = 'sm' | 'md' | 'lg'

const inputSizeClasses: Record<ComboboxSize, string> = {
  sm: 'h-8 px-2 text-xs',
  md: 'h-9 px-3 text-sm',
  lg: 'h-10 px-4 text-sm',
}

const chevronSizeClasses: Record<ComboboxSize, string> = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-4 w-4',
}

// ─── Item registry ────────────────────────────────────────────────────────────

interface ComboboxItemDef {
  value: string
  label: string
  disabled?: boolean
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
  inputValue: string
  setInputValue: (v: string) => void
  confirmedValue: string
  onValueChange: (v: string) => void
  open: boolean
  setOpen: (v: boolean) => void
  activeIndex: number
  setActiveIndex: (v: number) => void
  listboxId: string
  inputId: string
  ariaLabel: string | undefined
  inputRef: React.RefObject<HTMLInputElement | null>
  disabled: boolean
  size: ComboboxSize
  placeholder: string
  items: ComboboxItemDef[]
  registerItem: (item: ComboboxItemDef) => void
  filteredItems: ComboboxItemDef[]
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null)

function useComboboxContext() {
  const ctx = React.useContext(ComboboxContext)
  if (!ctx) throw new Error('Combobox components must be used within <Combobox>')
  return ctx
}

// ─── Combobox root ────────────────────────────────────────────────────────────

export interface ComboboxProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  size?: ComboboxSize
  id?: string
  'aria-label'?: string
  children: React.ReactNode
}

export function Combobox({
  value,
  defaultValue = '',
  onValueChange,
  disabled = false,
  placeholder = 'Select…',
  size = 'md',
  id,
  'aria-label': ariaLabel,
  children,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const confirmedValue = value !== undefined ? value : internalValue

  const [inputValue, setInputValue] = React.useState(confirmedValue)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [items, setItems] = React.useState<ComboboxItemDef[]>([])

  const listboxId = React.useId()
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const itemsRef = React.useRef(items)
  itemsRef.current = items

  React.useEffect(() => {
    const item = itemsRef.current.find(i => i.value === confirmedValue)
    setInputValue(item?.label ?? confirmedValue)
  }, [confirmedValue])

  const filteredItems = React.useMemo(() => {
    const q = inputValue.toLowerCase()
    return items.filter(
      (item) =>
        item.value.toLowerCase().includes(q) ||
        item.label.toLowerCase().includes(q)
    )
  }, [items, inputValue])

  const handleValueChange = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )

  const registerItem = React.useCallback((item: ComboboxItemDef) => {
    setItems((prev) => {
      if (prev.some((i) => i.value === item.value)) return prev
      return [...prev, item]
    })
  }, [])

  return (
    <ComboboxContext.Provider
      value={{
        inputValue,
        setInputValue,
        confirmedValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
        activeIndex,
        setActiveIndex,
        listboxId,
        inputId,
        ariaLabel,
        inputRef,
        disabled,
        size,
        placeholder,
        items,
        registerItem,
        filteredItems,
      }}
    >
      <div className="relative w-full">
        <ComboboxInputField />
        {children}
      </div>
    </ComboboxContext.Provider>
  )
}

// ─── ComboboxInput (internal) ─────────────────────────────────────────────────

function ComboboxInputField() {
  const {
    inputValue,
    setInputValue,
    confirmedValue,
    onValueChange,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    listboxId,
    inputId,
    ariaLabel,
    inputRef,
    disabled,
    size,
    placeholder,
    filteredItems,
  } = useComboboxContext()

  const activeOptionId =
    activeIndex >= 0 && filteredItems[activeIndex]
      ? `option-${filteredItems[activeIndex].value.replace(/\s+/g, '-').toLowerCase()}`
      : undefined

  const blurTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleFocus = () => {
    if (!disabled) {
      setOpen(true)
      setActiveIndex(-1)
    }
  }

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => {
      setOpen(false)
      setActiveIndex(-1)
      setInputValue(confirmedValue)
    }, 200)
  }

  React.useEffect(() => {
    return () => {
      if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    if (!open) setOpen(true)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledItems = filteredItems.filter((i) => !i.disabled)

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) {
        setOpen(true)
        setActiveIndex(0)
      } else {
        setActiveIndex(Math.min(activeIndex + 1, enabledItems.length - 1))
      }
    } else if (e.key === 'ArrowUp') {
      if (!open) return
      e.preventDefault()
      if (activeIndex <= 0) {
        setOpen(false)
        setActiveIndex(-1)
      } else {
        setActiveIndex(activeIndex - 1)
      }
    } else if (e.key === 'Home' && open) {
      e.preventDefault()
      setActiveIndex(0)
    } else if (e.key === 'End' && open) {
      e.preventDefault()
      setActiveIndex(enabledItems.length - 1)
    } else if (e.key === 'Enter' && open) {
      e.preventDefault()
      const item = enabledItems[activeIndex]
      if (item) {
        const label = item.label
        onValueChange(item.value)
        setInputValue(label)
        setOpen(false)
        setActiveIndex(-1)
      }
    } else if (e.key === 'Escape' && open) {
      e.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
      setInputValue(confirmedValue)
    }
    // Tab: no preventDefault — natural tab out
  }

  return (
    <div className="relative flex w-full items-center">
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        aria-activedescendant={activeOptionId}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={[
          'w-full rounded-[var(--radius)] border outline-none transition-colors pr-8',
          'bg-[hsl(var(--background))] text-[hsl(var(--foreground))]',
          'border-[hsl(var(--input))]',
          'placeholder:text-[hsl(var(--muted-foreground))]',
          'focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputSizeClasses[size],
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2 flex items-center text-[hsl(var(--muted-foreground))]"
      >
        <ChevronDownIcon className={chevronSizeClasses[size]} />
      </span>
    </div>
  )
}

// ─── ComboboxContent ──────────────────────────────────────────────────────────

export interface ComboboxContentProps {
  children: React.ReactNode
  className?: string
}

export function ComboboxContent({ children, className }: ComboboxContentProps) {
  const { open, listboxId, inputId, inputRef } = useComboboxContext()
  const [pos, setPos] = React.useState<{
    top?: number
    bottom?: number
    left: number
    minWidth: number
    maxHeight: number
  } | null>(null)

  React.useLayoutEffect(() => {
    if (!open || !inputRef.current) {
      setPos(null)
      return
    }

    const compute = () => {
      if (!inputRef.current) return
      const r = inputRef.current.getBoundingClientRect()
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
  }, [open, inputRef])

  if (typeof document === 'undefined' || !open || !pos) return null

  return ReactDOM.createPortal(
    <ul
      id={listboxId}
      role="listbox"
      aria-labelledby={inputId}
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
    >
      {children}
    </ul>,
    document.body
  )
}

// ─── ComboboxItem ─────────────────────────────────────────────────────────────

export interface ComboboxItemProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
}

export function ComboboxItem({ value, disabled = false, children }: ComboboxItemProps) {
  const {
    confirmedValue,
    onValueChange,
    setInputValue,
    setOpen,
    setActiveIndex,
    registerItem,
    filteredItems,
    activeIndex,
    inputRef,
  } = useComboboxContext()

  const label = typeof children === 'string' ? children : value
  const isSelected = confirmedValue === value

  React.useEffect(() => {
    registerItem({ value, label, disabled })
  }, [value, label, disabled, registerItem])

  const itemIndex = filteredItems.findIndex((i) => i.value === value)
  const isActive = itemIndex !== -1 && itemIndex === activeIndex
  const isFiltered = itemIndex === -1

  if (isFiltered) return null

  const optionId = `option-${value.replace(/\s+/g, '-').toLowerCase()}`

  const handleSelect = () => {
    if (disabled) return
    onValueChange(value)
    setInputValue(label)
    setOpen(false)
    setActiveIndex(-1)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  return (
    <li
      id={optionId}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleSelect}
      className={[
        'relative flex w-full cursor-default select-none items-center',
        'rounded-sm px-3 py-1.5 text-sm outline-none',
        isActive
          ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]'
          : 'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </li>
  )
}

// ─── ComboboxEmpty ────────────────────────────────────────────────────────────

export function ComboboxEmpty({ children = 'No results found.' }: { children?: React.ReactNode }) {
  const { filteredItems } = useComboboxContext()
  if (filteredItems.length > 0) return null
  return (
    <li
      role="option"
      aria-disabled="true"
      aria-selected={false}
      className="px-3 py-2 text-sm text-[hsl(var(--muted-foreground))] select-none"
    >
      {children}
    </li>
  )
}

// ─── ComboboxField ────────────────────────────────────────────────────────────

export interface ComboboxFieldProps {
  id: string
  label?: string
  required?: boolean
  helpText?: string
  errorText?: string
  disabled?: boolean
  placeholder?: string
  size?: ComboboxSize
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function ComboboxField({
  id,
  label,
  required,
  helpText,
  errorText,
  disabled,
  placeholder,
  size,
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: ComboboxFieldProps) {
  return (
    <div className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}>
      {label && (
        <label
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
      <Combobox
        id={id}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
      >
        <ComboboxContent>{children}</ComboboxContent>
      </Combobox>
      {helpText && (
        <span className="text-xs text-[hsl(var(--muted-foreground))]">{helpText}</span>
      )}
      {errorText && (
        <span role="alert" className="text-xs text-[hsl(var(--destructive))]">
          {errorText}
        </span>
      )}
    </div>
  )
}
