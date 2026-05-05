'use client'

import { useEffect, useRef, useState } from 'react'

const COMPONENTS = [
  { id: 'button', label: 'Button' },
  { id: 'checkbox', label: 'Checkbox' },
  { id: 'input', label: 'Input' },
  { id: 'select', label: 'Select' },
  { id: 'tooltip', label: 'Tooltip' },
  { id: 'switch', label: 'Switch' },
  { id: 'radio', label: 'Radio' },
  { id: 'slider', label: 'Slider' },
  { id: 'combobox', label: 'Combobox' },
  { id: 'badge', label: 'Badge' },
  { id: 'separator', label: 'Separator' },
  { id: 'tabs', label: 'Tabs' },
]

type Props = {
  isOpen?: boolean
  onClose?: () => void
}

export function LeftNav({ isOpen = false, onClose }: Props) {
  const [activeId, setActiveId] = useState<string>('')
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const scrollContainer = document.querySelector<HTMLElement>('.gallery-scroll')
    scrollContainerRef.current = scrollContainer

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        root: scrollContainer,
        rootMargin: '-10% 0px -60% 0px',
        threshold: 0,
      },
    )

    for (const { id } of COMPONENTS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (!el) return
    const container = scrollContainerRef.current
    if (container) {
      const elTop = el.getBoundingClientRect().top
      const containerTop = container.getBoundingClientRect().top
      container.scrollBy({ top: elTop - containerTop - 32, behavior: 'smooth' })
    } else {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    onClose?.()
  }

  const navContent = (
    <>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'hsl(var(--muted-foreground))',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Components
      </div>
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {COMPONENTS.map(({ id, label }) => (
          <li key={id}>
            <button
              onClick={() => scrollTo(id)}
              style={{
                background: activeId === id ? 'hsl(var(--accent))' : 'none',
                color:
                  activeId === id
                    ? 'hsl(var(--accent-foreground))'
                    : 'hsl(var(--muted-foreground))',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 14,
                width: '100%',
                textAlign: 'left',
                fontWeight: activeId === id ? 500 : 400,
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </>
  )

  return (
    <>
      {/* Desktop nav — hidden on mobile */}
      <nav
        className="hidden lg:flex"
        style={{
          position: 'sticky',
          top: 32,
          maxHeight: 'calc(100vh - 96px)',
          overflowY: 'auto',
          height: 'fit-content',
          padding: '0 16px',
          background: 'hsl(var(--background))',
          width: 200,
          flexShrink: 0,
          flexDirection: 'column',
        }}
        aria-label="Component navigation"
      >
        {navContent}
      </nav>

      {/* Mobile drawer overlay */}
      <div
        className="lg:hidden"
        aria-hidden={!isOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        />

        {/* Drawer panel */}
        <nav
          aria-label="Component navigation"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 240,
            overflowY: 'auto',
            padding: '32px 16px',
            background: 'hsl(var(--background))',
            borderRight: '1px solid hsl(var(--border))',
            flexDirection: 'column',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
          }}
        >
          {navContent}
        </nav>
      </div>
    </>
  )
}
