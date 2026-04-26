'use client'

import * as React from 'react'
import ReactDOM from 'react-dom'
import {
  useFloating,
  autoUpdate,
  flip,
  shift,
  offset,
  arrow,
  type Placement,
} from '@floating-ui/react-dom'

// ─── Context ──────────────────────────────────────────────────────────────────

interface TooltipContextValue {
  open: boolean
  setOpen: (v: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
  tooltipId: string
  delayDuration: number
}

const TooltipContext = React.createContext<TooltipContextValue | null>(null)

function useTooltipContext() {
  const ctx = React.useContext(TooltipContext)
  if (!ctx) throw new Error('Tooltip components must be used within <Tooltip>')
  return ctx
}

// ─── TooltipProvider (passthrough) ────────────────────────────────────────────

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

// ─── Tooltip root ─────────────────────────────────────────────────────────────

export interface TooltipProps {
  delayDuration?: number
  children: React.ReactNode
}

export function Tooltip({ delayDuration = 300, children }: TooltipProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLElement | null>(null)
  const tooltipId = React.useId()

  return (
    <TooltipContext.Provider value={{ open, setOpen, triggerRef, tooltipId, delayDuration }}>
      {children}
    </TooltipContext.Provider>
  )
}

// ─── TooltipTrigger ───────────────────────────────────────────────────────────

export interface TooltipTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export function TooltipTrigger({ asChild, children }: TooltipTriggerProps) {
  const { setOpen, triggerRef, tooltipId, delayDuration } = useTooltipContext()
  const showTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const hideTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current)
    showTimer.current = setTimeout(() => setOpen(true), delayDuration)
  }
  const hide = () => {
    if (showTimer.current) clearTimeout(showTimer.current)
    hideTimer.current = setTimeout(() => setOpen(false), 150)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (showTimer.current) clearTimeout(showTimer.current)
      setOpen(false)
    }
  }

  const eventProps = {
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown,
    'aria-describedby': tooltipId,
  }

  const setRef = (el: HTMLElement | null) => {
    triggerRef.current = el
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      ...eventProps,
      ref: setRef,
    } as React.HTMLAttributes<HTMLElement> & { ref: (el: HTMLElement | null) => void })
  }

  return (
    <span ref={setRef} {...eventProps} style={{ display: 'contents' }}>
      {children}
    </span>
  )
}

// ─── TooltipContent ───────────────────────────────────────────────────────────

export interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  showArrow?: boolean
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = 'top', sideOffset = 6, showArrow = true, children, ...props }, _ref) => {
    const { open, triggerRef, tooltipId } = useTooltipContext()
    const arrowRef = React.useRef<HTMLDivElement>(null)

    const placement: Placement = side

    const { refs, floatingStyles, isPositioned } = useFloating({
      strategy: 'fixed',
      placement,
      middleware: [offset(sideOffset), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
      whileElementsMounted: autoUpdate,
      elements: { reference: triggerRef.current ?? undefined },
    })

    if (typeof document === 'undefined' || !open) return null

    return ReactDOM.createPortal(
      <div
        ref={refs.setFloating}
        id={tooltipId}
        role="tooltip"
        style={{ ...floatingStyles, visibility: isPositioned ? 'visible' : 'hidden' }}
        className={[
          'z-[var(--z-tooltip)] max-w-[240px] rounded-[var(--radius)]',
          'border border-[hsl(var(--border))]',
          'bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))]',
          'py-1.5 px-3 text-xs font-medium',
          '[box-shadow:var(--shadow-md)]',
          'animate-in fade-in-0 zoom-in-95 [transition-duration:var(--duration-fast)]',
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
TooltipContent.displayName = 'TooltipContent'
