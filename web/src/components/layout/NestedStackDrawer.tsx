import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface NestedStackDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  panelClassName?: string
  closeOnEscape?: boolean
}

const slideEase = 'cubic-bezier(0.22, 1, 0.36, 1)'

/**
 * Secondary drawer stacked inside a parent panel (e.g. email view inside company drawer).
 * Slides in from the right with transform animation.
 */
export function NestedStackDrawer({
  open,
  onOpenChange,
  children,
  panelClassName,
  closeOnEscape = true,
}: NestedStackDrawerProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open || !closeOnEscape) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, closeOnEscape, onOpenChange])

  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => {
        setVisible(true)
      })
      return () => cancelAnimationFrame(frame)
    }
    setVisible(false)
  }, [open])

  return (
    <div
      className={cn('absolute inset-0 z-20', !open && 'pointer-events-none')}
      aria-hidden={!open}
    >
      <div
        className={cn(
          'absolute inset-0 bg-black/25 transition-opacity duration-300 ease-out',
          visible ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        style={{ transitionTimingFunction: slideEase }}
        onClick={() => onOpenChange(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal={open}
        className={cn(
          'absolute inset-y-0 right-0 flex flex-col border-l border-border bg-background shadow-2xl',
          'transition-transform duration-300 will-change-transform',
          panelClassName ?? 'w-[min(68%,920px)] min-w-[400px]',
          visible ? 'translate-x-0' : 'translate-x-full',
          !open && 'pointer-events-none',
        )}
        style={{ transitionTimingFunction: slideEase }}
      >
        {children}
      </div>
    </div>
  )
}
