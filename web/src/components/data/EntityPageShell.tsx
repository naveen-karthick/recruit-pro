import { Plus } from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Button } from '@/components/ui/button'

interface EntityPageShellProps {
  title: string
  description: string
  searchPlaceholder: string
  addLabel: string
  count?: number
  overview?: React.ReactNode
  footer?: React.ReactNode
  onAdd: () => void
  children: React.ReactNode
  /** Drawer overlay scoped to main content (below header) */
  panel?: React.ReactNode
}

export function EntityPageShell({
  title,
  description,
  searchPlaceholder,
  addLabel,
  count,
  overview,
  footer,
  onAdd,
  children,
  panel,
}: EntityPageShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <TopBar searchPlaceholder={searchPlaceholder} />
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto custom-scrollbar p-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <Button onClick={onAdd} className="shrink-0">
              <Plus className="h-4 w-4" />
              {addLabel}
            </Button>
          </div>

          {overview && <div className="mb-6">{overview}</div>}

          {footer && <div className="mb-6">{footer}</div>}

          {count !== undefined && !overview && (
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              {count} records
            </p>
          )}

          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {children}
          </div>
        </div>
        {panel}
      </div>
    </div>
  )
}
