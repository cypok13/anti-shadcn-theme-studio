'use client'

import * as React from 'react'

type RadioSize = 'sm' | 'md'

interface RadioContextValue {
  value: string | undefined
  onChange: (value: string) => void
  disabled: boolean
  size: RadioSize
  registerRef: (itemValue: string, ref: HTMLButtonElement | null) => void
  getItemRefs: () => Map<string, HTMLButtonElement>
  getValues: () => string[]
  registerValue: (itemValue: string) => void
  unregisterValue: (itemValue: string) => void
}

const RadioContext = React.createContext<RadioContextValue | null>(null)

function useRadioContext() {
  const ctx = React.useContext(RadioContext)
  if (!ctx) throw new Error('RadioItem must be used inside RadioGroup')
  return ctx
}

export interface RadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  label: string
  size?: RadioSize
  children: React.ReactNode
  className?: string
}

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required,
  label,
  size = 'md',
  children,
  className,
}: RadioGroupProps) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue)
  const currentValue = isControlled ? value : internalValue

  const labelId = React.useId()

  const itemRefsMap = React.useRef<Map<string, HTMLButtonElement>>(new Map())
  const orderedValues = React.useRef<string[]>([])

  const registerRef = React.useCallback((itemValue: string, ref: HTMLButtonElement | null) => {
    if (ref) {
      itemRefsMap.current.set(itemValue, ref)
    } else {
      itemRefsMap.current.delete(itemValue)
    }
  }, [])

  const registerValue = React.useCallback((itemValue: string) => {
    if (!orderedValues.current.includes(itemValue)) {
      orderedValues.current = [...orderedValues.current, itemValue]
    }
  }, [])

  const unregisterValue = React.useCallback((itemValue: string) => {
    orderedValues.current = orderedValues.current.filter(v => v !== itemValue)
    itemRefsMap.current.delete(itemValue)
  }, [])

  const getItemRefs = React.useCallback(() => itemRefsMap.current, [])
  const getValues = React.useCallback(() => orderedValues.current, [])

  const handleChange = React.useCallback((newValue: string) => {
    if (!isControlled) setInternalValue(newValue)
    onValueChange?.(newValue)
  }, [isControlled, onValueChange])

  return (
    <RadioContext.Provider
      value={{
        value: currentValue,
        onChange: handleChange,
        disabled,
        size,
        registerRef,
        getItemRefs,
        getValues,
        registerValue,
        unregisterValue,
      }}
    >
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        className={[className ?? ''].filter(Boolean).join(' ')}
      >
        <span id={labelId} className="sr-only">{label}</span>
        {children}
      </div>
    </RadioContext.Provider>
  )
}

export interface RadioItemProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function RadioItem({ value, disabled = false, children, className }: RadioItemProps) {
  const ctx = useRadioContext()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const textId = React.useId()

  const isSelected = ctx.value === value
  const isDisabled = disabled || ctx.disabled

  const { registerValue, unregisterValue, registerRef } = ctx

  React.useEffect(() => {
    registerValue(value)
    return () => unregisterValue(value)
  }, [value, registerValue, unregisterValue])

  React.useEffect(() => {
    registerRef(value, buttonRef.current)
    return () => registerRef(value, null)
  }, [value, registerRef])

  const values = ctx.getValues()
  const hasSelection = ctx.value !== undefined
  const isFirst = values[0] === value
  const tabIndex = isSelected || (!hasSelection && isFirst) ? 0 : -1

  const handleClick = () => {
    if (!isDisabled) ctx.onChange(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const allValues = ctx.getValues()
    const refs = ctx.getItemRefs()
    const currentIndex = allValues.indexOf(value)

    if (e.key === ' ') {
      e.preventDefault()
      if (!isDisabled) ctx.onChange(value)
      return
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      let nextIndex = (currentIndex + 1) % allValues.length
      for (let attempts = 0; attempts < allValues.length; attempts++) {
        const nextValue = allValues[nextIndex]
        const nextBtn = refs.get(nextValue)
        if (nextBtn && !nextBtn.disabled) {
          ctx.onChange(nextValue)
          nextBtn.focus()
          break
        }
        nextIndex = (nextIndex + 1) % allValues.length
      }
      return
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      let prevIndex = (currentIndex - 1 + allValues.length) % allValues.length
      for (let attempts = 0; attempts < allValues.length; attempts++) {
        const prevValue = allValues[prevIndex]
        const prevBtn = refs.get(prevValue)
        if (prevBtn && !prevBtn.disabled) {
          ctx.onChange(prevValue)
          prevBtn.focus()
          break
        }
        prevIndex = (prevIndex - 1 + allValues.length) % allValues.length
      }
    }
  }

  const state = isSelected ? 'checked' : 'unchecked'
  const outerSize = ctx.size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const innerSize = ctx.size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2'

  return (
    <label
      className={[
        'flex items-center gap-2 select-none min-h-[44px]',
        isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <button
        ref={buttonRef}
        type="button"
        role="radio"
        aria-checked={isSelected}
        aria-disabled={isDisabled || undefined}
        aria-labelledby={textId}
        tabIndex={tabIndex}
        disabled={isDisabled}
        data-state={state}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={[
          'shrink-0 flex items-center justify-center rounded-full border-2',
          'transition-colors duration-150',
          'outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-[hsl(var(--ring))]',
          'focus-visible:ring-offset-2',
          'focus-visible:ring-offset-[hsl(var(--background))]',
          isSelected ? 'border-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]',
          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
          outerSize,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {isSelected && (
          <span
            className={[
              'rounded-full bg-[hsl(var(--primary))]',
              innerSize,
            ].join(' ')}
          />
        )}
      </button>
      <span id={textId} className="text-sm text-[hsl(var(--foreground))]">{children}</span>
    </label>
  )
}
