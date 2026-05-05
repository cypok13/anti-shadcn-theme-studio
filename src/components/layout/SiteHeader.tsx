'use client'

type Props = {
  darkMode: boolean
  onToggleDark: () => void
  onOpenNav?: () => void
  onOpenSidebar?: () => void
}

export function SiteHeader({ darkMode, onToggleDark, onOpenNav, onOpenSidebar }: Props) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
      borderBottom: '1px solid hsl(var(--border))',
      background: 'hsl(var(--background))',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        maxWidth: '100%',
        gap: '8px',
      }}>
        {/* Mobile hamburger */}
        {onOpenNav && (
          <button
            onClick={onOpenNav}
            aria-label="Open navigation"
            className="lg:hidden"
            style={{
              background: 'none',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: 16,
              color: 'hsl(var(--foreground))',
              flexShrink: 0,
            }}
          >
            ☰
          </button>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: 'hsl(var(--foreground))', lineHeight: 1 }}>
            Theme Studio
          </div>
          <div style={{ fontSize: 13, color: 'hsl(var(--muted-foreground))', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Visual design token editor. Customize your component library in real time.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {/* Mobile customize button */}
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              aria-label="Open theme customizer"
              className="lg:hidden"
              style={{
                background: 'none',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: 13,
                color: 'hsl(var(--foreground))',
              }}
            >
              Customize ⚙
            </button>
          )}

          <button
            onClick={onToggleDark}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'none',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
              fontSize: 13,
              color: 'hsl(var(--foreground))',
            }}
          >
            {darkMode ? '☀ Light' : '☾ Dark'}
          </button>
        </div>
      </div>
    </header>
  )
}
