import { Bell, HelpCircle } from 'lucide-react'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Button } from '@/components/ui/button'
import { ProfileMenu } from '@/components/layout/ProfileMenu'
import { QuickSearch } from '@/components/layout/QuickSearch'

interface TopBarProps {
  searchPlaceholder?: string
}

export function TopBar({
  searchPlaceholder = 'Quick search all records...',
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/80 px-8 backdrop-blur-md">
      <QuickSearch placeholder={searchPlaceholder} />
      <div className="flex shrink-0 items-center gap-1">
        <ThemeToggle />
        <Button type="button" variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-destructive" />
        </Button>
        <Button type="button" variant="ghost" size="icon">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <ProfileMenu />
      </div>
    </header>
  )
}
