import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StageIndicator({ stage }: { stage: number }) {
  const filled = Math.min(5, Math.max(0, stage))
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <ChevronRight
          key={i}
          className={cn(
            'h-3.5 w-3.5 -ml-1 first:ml-0',
            i < filled
              ? 'fill-sky-500 text-sky-500'
              : 'fill-neutral-200 text-neutral-200',
          )}
          strokeWidth={2}
          aria-hidden
        />
      ))}
    </div>
  )
}
