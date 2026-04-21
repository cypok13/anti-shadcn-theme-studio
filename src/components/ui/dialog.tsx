'use client'

import * as React from 'react'
import ReactDOM from 'react-dom'

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  titleId: string
  descId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialogContext() {
  const ctx = React.useContext(DialogContext)
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>')
  return ctx
}

// ─── Dialog root ──────────────────────────────────────────────────────────────

export interface DialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

export function Dialog({ open, defaultOpen = false, onOpenChange, children }: DialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isOpen = open !== undefined ? open : internalOpen
  const titleId = React.useId()
  const descId = React.useId()

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [open, onOpenChange]
  )

  return (
    <DialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange, titleId, descId }}>
      {children}
    </DialogContext.Provider>
  )
}

// ─── DialogTrigger ────────────────────────────────────────────────────────────

export interface DialogTriggerProps {
  asChild?: boolean
  children: React.ReactNode
}

export function DialogTrigger({ asChild, children }: DialogTriggerProps) {
  const { onOpenChange } = useDialogContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      onClick: (e: React.MouseEvent) => {
        const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
        child.props.onClick?.(e as React.MouseEvent<HTMLElement>)
        onOpenChange(true)
      },
    })
  }

  return (
    <button type="button" onClick={() => onOpenChange(true)}>
      {children}
    </button>
  )
}

// ─── DialogClose ──────────────────────────────────────────────────────────────

export interface DialogCloseProps {
  asChild?: boolean
  children: React.ReactNode
}

export function DialogClose({ asChild, children }: DialogCloseProps) {
  const { onOpenChange } = useDialogContext()

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
      onClick: (e: React.MouseEvent) => {
        const child = children as React.ReactElement<React.HTMLAttributes<HTMLElement>>
        child.props.onClick?.(e as React.MouseEvent<HTMLElement>)
        onOpenChange(false)
      },
    })
  }

  return (
    <button type="button" onClick={() => onOpenChange(false)}>
      {children}
    </button>
  )
}

// ─── DialogPortal ─────────────────────────────────────────────────────────────

export function DialogPortal({ children }: { children: React.ReactNode }) {
  const { open } = useDialogContext()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => { setMounted(true) }, [])
  if (!mounted || !open) return null
  return ReactDOM.createPortal(children, document.body)
}

// ─── DialogOverlay ────────────────────────────────────────────────────────────

export const DialogOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, onClick, ...props }, ref) => {
    const { onOpenChange } = useDialogContext()
    return (
      <div
        ref={ref}
        aria-hidden="true"
        onClick={(e) => {
          onOpenChange(false)
          onClick?.(e)
        }}
        className={[
          'fixed inset-0 z-50',
          'bg-[hsl(var(--overlay)/0.8)]',
          'animate-in fade-in-0 duration-200',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  }
)
DialogOverlay.displayName = 'DialogOverlay'

// ─── Size map ─────────────────────────────────────────────────────────────────

type DialogSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
}

// ─── Close button icon ────────────────────────────────────────────────────────

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

// ─── DialogContent ────────────────────────────────────────────────────────────

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: DialogSize
  scrollable?: boolean
  showCloseButton?: boolean
  closeOnOutsideClick?: boolean
}

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    {
      className,
      children,
      size = 'md',
      scrollable = false,
      showCloseButton = true,
      closeOnOutsideClick = true,
      ...props
    },
    ref
  ) => {
    const { onOpenChange, titleId, descId } = useDialogContext()
    const innerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const el = innerRef.current
      if (!el) return

      const getFocusable = () => Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
      const first = getFocusable()[0]
      first?.focus()

      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { onOpenChange(false); return }
        if (e.key !== 'Tab') return
        const focusable = getFocusable()
        if (focusable.length === 0) return
        const firstEl = focusable[0]
        const lastEl = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        } else {
          if (document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
        }
      }
      document.addEventListener('keydown', handleKey)
      return () => document.removeEventListener('keydown', handleKey)
    }, [onOpenChange])

    const mergedRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ;(innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
      },
      [ref]
    )

    const closeButtonClasses = [
      'absolute right-4 top-4 min-h-[44px] min-w-[44px]',
      'flex items-center justify-center rounded-[var(--radius)]',
      'text-[hsl(var(--muted-foreground))]',
      'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
      'focus-visible:ring-offset-[hsl(var(--card))]',
      'transition-colors cursor-pointer',
    ].join(' ')

    const baseClasses = [
      'fixed left-[50%] top-[50%] z-50',
      'translate-x-[-50%] translate-y-[-50%]',
      'w-full border border-[hsl(var(--border))]',
      'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]',
      'rounded-[var(--radius)] shadow-xl',
      'focus:outline-none',
      'animate-in fade-in-0 zoom-in-95 duration-200',
      sizeClasses[size],
    ]

    return (
      <div
        ref={mergedRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={[
          ...baseClasses,
          scrollable ? 'flex flex-col max-h-[80vh]' : 'p-6',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {showCloseButton && (
          <button
            type="button"
            className={closeButtonClasses}
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
          >
            <XIcon />
          </button>
        )}
        {children}
      </div>
    )
  }
)
DialogContent.displayName = 'DialogContent'

// ─── DialogBody ───────────────────────────────────────────────────────────────

export const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'flex-1 min-h-0 overflow-y-auto px-6 py-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
DialogBody.displayName = 'DialogBody'

// ─── DialogHeader ─────────────────────────────────────────────────────────────

export const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={['flex flex-col gap-1', className].filter(Boolean).join(' ')}
      {...props}
    />
  )
)
DialogHeader.displayName = 'DialogHeader'

// ─── DialogFooter ─────────────────────────────────────────────────────────────

export const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
DialogFooter.displayName = 'DialogFooter'

// ─── DialogTitle ──────────────────────────────────────────────────────────────

export const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    const { titleId } = useDialogContext()
    return (
      <h2
        ref={ref}
        id={titleId}
        className={[
          'text-lg font-semibold text-[hsl(var(--foreground))] leading-none tracking-tight',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  }
)
DialogTitle.displayName = 'DialogTitle'

// ─── DialogDescription ────────────────────────────────────────────────────────

export const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { descId } = useDialogContext()
    return (
      <p
        ref={ref}
        id={descId}
        className={[
          'text-sm text-[hsl(var(--muted-foreground))]',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  }
)
DialogDescription.displayName = 'DialogDescription'
