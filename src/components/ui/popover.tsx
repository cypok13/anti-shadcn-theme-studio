'use client'

import * as React from 'react'
import ReactDOM from 'react-dom'
import {
  useFloating,
  flip,
  shift,
  offset,
  arrow,
  type Placement,
} from '@floating-ui/react-dom'

// ─── Context ──────────────────────────────────────────────────────────────────

interface PopoverContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentId: string
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopoverContext() {
  const ctx = React.useContext(PopoverContext)
  if (!ctx) throw new Error('Popover components must be used within <Popover>')
  return ctx
}

// ─── Popover root ─────────────────────────────────────────────────────────────

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const contentId = React.useId()

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )

  return (
    <PopoverContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange, triggerRef, contentId }}>
      {children}
    </PopoverContext.Provider>
  )
}

// ─── PopoverTrigger ───────────────────────────────────────────────────────────

export interface PopoverTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export function PopoverTrigger({ asChild, children }: PopoverTriggerProps) {
  const { open, onOpenChange, triggerRef, contentId } = usePopoverContext()

  const setRef = (el: HTMLElement | null) => {
    triggerRef.current = el
  }

  const triggerProps = {
    'aria-expanded': open,
    'aria-haspopup': 'true' as const,
    'aria-controls': contentId,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation()
      onOpenChange(!open)
    },
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      ...triggerProps,
      ref: setRef,
    } as React.HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void })
  }

  return (
    <button type="button" ref={setRef} {...triggerProps}>
      {children}
    </button>
  )
}

// ─── PopoverAnchor (passthrough for API compat) ───────────────────────────────

export function PopoverAnchor({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

// ─── PopoverContent ───────────────────────────────────────────────────────────

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  showArrow?: boolean
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    {
      className,
      side = 'bottom',
      align = 'center',
      sideOffset = 4,
      showArrow = false,
      children,
      ...props
    },
    _ref
  ) => {
    const { open, onOpenChange, triggerRef, contentId } = usePopoverContext()
    const arrowRef = React.useRef<HTMLDivElement>(null)

    const placementMap: Record<string, Record<string, Placement>> = {
      bottom: { start: 'bottom-start', center: 'bottom', end: 'bottom-end' },
      top: { start: 'top-start', center: 'top', end: 'top-end' },
      left: { start: 'left-start', center: 'left', end: 'left-end' },
      right: { start: 'right-start', center: 'right', end: 'right-end' },
    }
    const placement: Placement = placementMap[side]?.[align] ?? 'bottom'

    const { refs, floatingStyles } = useFloating({
      placement,
      middleware: [offset(sideOffset), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
      elements: { reference: triggerRef.current },
    })

    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => { setMounted(true) }, [])

    React.useEffect(() => {
      if (!open) return

      const handleMouseDown = (e: MouseEvent) => {
        const floating = refs.floating.current
        const trigger = triggerRef.current
        if (
          floating && !floating.contains(e.target as Node) &&
          trigger && !trigger.contains(e.target as Node)
        ) {
          onOpenChange(false)
        }
      }

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }

      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('keydown', handleKey)
      return () => {
        document.removeEventListener('mousedown', handleMouseDown)
        document.removeEventListener('keydown', handleKey)
      }
    }, [open, onOpenChange, refs.floating, triggerRef])

    if (!mounted || !open) return null

    return ReactDOM.createPortal(
      <div
        ref={refs.setFloating}
        id={contentId}
        role="dialog"
        style={floatingStyles}
        className={[
          'z-[var(--z-dropdown)] max-w-[320px] w-max',
          'rounded-[var(--radius)] border border-[hsl(var(--border))]',
          'bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
          'p-4 shadow-md',
          'outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
          'animate-in fade-in-0 zoom-in-95 duration-150',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
        {showArrow && (
          <div
            ref={arrowRef}
            className="absolute h-2 w-2 rotate-45 bg-[hsl(var(--popover))] border border-[hsl(var(--border))]"
          />
        )}
      </div>,
      document.body
    )
  }
)
PopoverContent.displayName = 'PopoverContent'
