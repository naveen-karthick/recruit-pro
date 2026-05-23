import { NavLink } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  Contact,
  UserSearch,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/contacts', label: 'Contacts', icon: Contact },
  { to: '/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/candidates', label: 'Candidates', icon: UserSearch },
]

export function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col border-r border-border bg-background py-6">
      <div className="mb-8 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-foreground">
            <Briefcase className="h-4 w-4 text-background" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-foreground">
              RecruitPro
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              Enterprise Edition
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 custom-scrollbar">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent font-medium text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        <div className="px-0 pb-2 pt-6">
          <Button variant="outline" className="w-full justify-center gap-2">
            <Plus className="h-4 w-4" />
            Post a Job
          </Button>
        </div>
      </nav>

      <div className="mt-auto space-y-0.5 px-3">
        <a
          href="#analytics"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <BarChart3 className="h-4 w-4" />
          Analytics
        </a>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent font-medium text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
