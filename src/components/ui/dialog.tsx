'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

// --- Overlay ---

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={[
      'fixed inset-0 z-50',
      'bg-[hsl(var(--overlay)/0.8)]',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      'duration-200',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

// --- Size map ---

type DialogSize = 'sm' | 'md' | 'lg'

const sizeClasses: Record<DialogSize, string> = {
  sm: 'max-w-[400px]',
  md: 'max-w-[560px]',
  lg: 'max-w-[720px]',
}

// --- Close button icon ---

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

// --- Content ---

export interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: DialogSize
  scrollable?: boolean
  showCloseButton?: boolean
  closeOnOutsideClick?: boolean
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      className,
      children,
      size = 'md',
      scrollable = false,
      showCloseButton = true,
      closeOnOutsideClick = true,
      onPointerDownOutside,
      onInteractOutside,
      ...props
    },
    ref,
  ) => {
    const handlePointerDownOutside: React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Content
    >['onPointerDownOutside'] = (e) => {
      if (!closeOnOutsideClick) {
        e.preventDefault()
      }
      onPointerDownOutside?.(e)
    }

    const handleInteractOutside: React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Content
    >['onInteractOutside'] = (e) => {
      if (!closeOnOutsideClick) {
        e.preventDefault()
      }
      onInteractOutside?.(e)
    }

    const baseClasses = [
      'fixed left-[50%] top-[50%] z-50',
      'translate-x-[-50%] translate-y-[-50%]',
      'w-full border border-[hsl(var(--border))]',
      'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]',
      'rounded-[var(--radius)] shadow-xl',
      'focus:outline-none',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'duration-200',
      sizeClasses[size],
    ]

    const closeButtonClasses = [
      'absolute right-4 top-4 min-h-[44px] min-w-[44px]',
      'flex items-center justify-center rounded-[var(--radius)]',
      'text-[hsl(var(--muted-foreground))]',
      'hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2',
      'focus-visible:ring-offset-[hsl(var(--card))]',
      'transition-colors cursor-pointer',
      'disabled:pointer-events-none',
    ].join(' ')

    if (scrollable) {
      return (
        <DialogPrimitive.Content
          ref={ref}
          onPointerDownOutside={handlePointerDownOutside}
          onInteractOutside={handleInteractOutside}
          className={[
            ...baseClasses,
            'flex flex-col max-h-[80vh]',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        >
          {showCloseButton && (
            <DialogPrimitive.Close className={closeButtonClasses} aria-label="Close dialog">
              <XIcon />
            </DialogPrimitive.Close>
          )}
          {children}
        </DialogPrimitive.Content>
      )
    }

    return (
      <DialogPrimitive.Content
        ref={ref}
        onPointerDownOutside={handlePointerDownOutside}
        onInteractOutside={handleInteractOutside}
        className={[
          ...baseClasses,
          'p-6',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {showCloseButton && (
          <DialogPrimitive.Close className={closeButtonClasses} aria-label="Close dialog">
            <XIcon />
          </DialogPrimitive.Close>
        )}
        {children}
      </DialogPrimitive.Content>
    )
  },
)
DialogContent.displayName = 'DialogContent'

// --- Body (for scrollable dialogs) ---

export const DialogBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
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
))
DialogBody.displayName = 'DialogBody'

// --- Header ---

export const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={[
      'flex flex-col gap-1',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
DialogHeader.displayName = 'DialogHeader'

// --- Footer ---

export const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
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
))
DialogFooter.displayName = 'DialogFooter'

// --- Title ---

export const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={[
      'text-lg font-semibold text-[hsl(var(--foreground))] leading-none tracking-tight',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

// --- Description ---

export const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={[
      'text-sm text-[hsl(var(--muted-foreground))]',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'
