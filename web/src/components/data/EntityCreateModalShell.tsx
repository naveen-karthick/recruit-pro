import type { FormEventHandler, ReactNode } from 'react'
import { Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogCloseButton } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import '@/styles/entity-create-modal.css'

interface EntityCreateModalShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  icon: ReactNode
  title: string
  subtitle: string
  submitLabel: string
  pendingLabel?: string
  isSubmitting?: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  children: ReactNode
}

export function EntityCreateModalShell({
  open,
  onOpenChange,
  icon,
  title,
  subtitle,
  submitLabel,
  pendingLabel,
  isSubmitting,
  onSubmit,
  children,
}: EntityCreateModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0">
        <div className="modal-accent-bar h-1 shrink-0" />

        <div className="flex shrink-0 items-start justify-between border-b border-border px-6 py-5">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/10">
              {icon}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <DialogCloseButton />
        </div>

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
            <div className="space-y-4">{children}</div>
          </div>

          <div className="shrink-0 border-t border-border bg-muted/20 px-6 py-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full gap-1.5 bg-gradient-to-r from-sky-600 to-sky-500 shadow-md shadow-sky-500/20"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? (pendingLabel ?? 'Creating...') : submitLabel}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
