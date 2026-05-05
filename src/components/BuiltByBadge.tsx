'use client'

type Props = {
  href?: string
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center'
}

export function BuiltByBadge({ href = 'https://notjustsasha.com', position = 'bottom-right' }: Props) {
  const positionClass =
    position === 'bottom-right' ? 'right-5' :
    position === 'bottom-left'  ? 'left-5'  :
    'left-1/2 -translate-x-1/2'

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 ${positionClass} z-40 p-[3px] rounded-2xl overflow-hidden group`}
    >
      <div className="badge-spin-ring absolute inset-[-100%]" />
      <div className="relative flex items-center gap-2 px-5 py-3 rounded-[calc(1rem-3px)] bg-[var(--surface-badge)]">
        <div>
          <div
            className="leading-none mb-0.5"
            style={{ color: 'var(--text-badge-label)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            built by
          </div>
          <div
            className="font-semibold leading-none"
            style={{ color: 'var(--text-badge-name)', fontSize: 13, letterSpacing: '-0.01em' }}
          >
            Alexander
          </div>
        </div>
        <span
          className="group-hover:opacity-100 transition-colors text-xs ml-1"
          style={{ color: 'var(--text-badge-arrow)' }}
        >
          ↗
        </span>
      </div>
    </a>
  )
}
