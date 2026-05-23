import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border text-[11px] font-medium uppercase tracking-tight transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-secondary text-secondary-foreground',
        active:
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        prospect:
          'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400',
        former:
          'border-border bg-muted text-muted-foreground',
        open:
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
        interviewing:
          'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400',
        closed:
          'border-border bg-muted text-muted-foreground',
        screening:
          'border-blue-500/25 bg-blue-500/10 text-blue-700 dark:text-blue-400',
        placed:
          'border-foreground/20 bg-foreground text-background',
        rejected:
          'border-destructive/30 bg-destructive/10 text-destructive',
      },
      size: {
        default: 'px-2 py-0.5',
        status: 'w-[5.5rem] justify-center px-1 py-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
