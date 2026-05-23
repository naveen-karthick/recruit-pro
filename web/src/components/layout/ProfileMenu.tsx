import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Settings } from 'lucide-react'
import { getUser, logout, type UserProfile } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function ProfileMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<UserProfile>(getUser)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setUser(getUser())
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <div ref={containerRef} className="relative ml-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full p-0"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-foreground text-xs font-medium text-background">
          {user.initials}
        </span>
      </Button>

      <div
        role="menu"
        className={cn(
          'absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-lg border border-border bg-popover p-1 shadow-lg',
          'transition-all duration-150',
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0',
        )}
      >
        <div className="border-b border-border px-3 py-2.5">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <div className="py-1">
          <Link
            to="/settings"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4 text-muted-foreground" />
            User settings
          </Link>
        </div>

        <div className="border-t border-border py-1">
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
