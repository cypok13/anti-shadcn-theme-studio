'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement(children)) return <>{children}</>
  return React.cloneElement(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>, {
    ...props,
    ...(children as React.ReactElement<React.HTMLAttributes<HTMLElement>>).props,
    className: [
      (props as { className?: string }).className,
      ((children as React.ReactElement<{ className?: string }>).props as { className?: string }).className,
    ]
      .filter(Boolean)
      .join(' '),
  })
}

// ─── Variants ────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  [
    // base
    'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] font-medium select-none',
    // transitions
    'transition-[opacity,background-color,border-color,transform] [transition-duration:var(--duration-fast)] ease-in-out',
    // focus ring
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]',
    // disabled (native) — убирает из tab order; cursor + opacity
    'disabled:cursor-not-allowed disabled:opacity-50',
    // aria-disabled — остаётся в tab order; cursor + opacity (click guard в JS)
    '[&[aria-disabled=true]]:cursor-not-allowed [&[aria-disabled=true]]:opacity-50',
    // active scale (respects prefers-reduced-motion)
    'motion-safe:enabled:active:scale-[0.98]',
    // icon children
    '[&>svg]:shrink-0 [&>svg]:aria-hidden:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] enabled:hover:opacity-90',
        secondary:
          'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] enabled:hover:opacity-90',
        outline:
          'border border-[hsl(var(--border))] bg-transparent text-[hsl(var(--foreground))] enabled:hover:bg-[hsl(var(--primary))] enabled:hover:text-[hsl(var(--primary-foreground))] enabled:hover:border-[hsl(var(--primary))]',
        ghost:
          'bg-transparent text-[hsl(var(--foreground))] enabled:hover:bg-[hsl(var(--accent))] enabled:hover:text-[hsl(var(--accent-foreground))]',
        destructive:
          'bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] enabled:hover:opacity-90',
        link: 'text-[hsl(var(--primary))] underline-offset-4 enabled:hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 text-sm',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin motion-reduce:animate-none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      type = 'button',
      'aria-label': ariaLabel,
      'aria-disabled': ariaDisabled,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    const isDisabled = isLoading || ariaDisabled === 'true' || ariaDisabled === true

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Guard: prevent action when aria-disabled or loading
      if (isDisabled && !props.disabled) {
        e.preventDefault()
        return
      }
      onClick?.(e)
    }

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        aria-label={isLoading ? 'Loading' : ariaLabel}
        aria-disabled={isDisabled ? 'true' : ariaDisabled}
        onClick={handleClick}
        className={buttonVariants({ variant, size, className })}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { buttonVariants }
