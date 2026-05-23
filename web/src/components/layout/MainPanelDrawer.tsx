import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface MainPanelDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  /** Panel width utility classes (default: full width) */
  panelClassName?: string
  zIndex?: number
  closeOnEscape?: boolean
}

/**
 * Drawer scoped to the main content panel (below TopBar, right of Sidebar).
 * Slides in from the right without covering global chrome.
 */
export function MainPanelDrawer({
  open,
  onOpenChange,
  children,
  className,
  panelClassName,
  zIndex = 40,
  closeOnEscape = true,
}: MainPanelDrawerProps) {
  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeOnEscape, onOpenChange])

  return (
    <div
      className={cn('absolute inset-0', !open && 'pointer-events-none')}
      style={{ zIndex }}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal={open}
        className={cn(
          'absolute inset-y-0 right-0 isolate flex h-full flex-col border-l border-border bg-background shadow-2xl',
          'transition-transform duration-300 ease-out',
          panelClassName ?? 'w-full',
          open ? 'translate-x-0' : 'translate-x-full',
          !open && 'pointer-events-none',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
