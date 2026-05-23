import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeaturePlaceholderPanelProps {
  title: string
  description: string
  icon: LucideIcon
  items?: string[]
  className?: string
}

export function FeaturePlaceholderPanel({
  title,
  description,
  icon: Icon,
  items = [],
  className,
}: FeaturePlaceholderPanelProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border border-border bg-card p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted/60">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {items.length > 0 && (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
              {item}
            </li>
          ))}
        </ul>
      )}

      <Button
        variant="outline"
        size="sm"
        disabled
        className="mt-4 w-full justify-between opacity-60"
      >
        Configure
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
