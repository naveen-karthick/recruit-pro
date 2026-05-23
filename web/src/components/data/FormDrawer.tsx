import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  SheetFooter,
  SheetCloseButton,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface FormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  submitLabel?: string
  isSubmitting?: boolean
  onSubmit: () => void
  children: React.ReactNode
}

export function FormDrawer({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = 'Save',
  isSubmitting,
  onSubmit,
  children,
}: FormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="sm">
        <SheetHeader className="flex-row items-start justify-between">
          <div>
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </div>
          <SheetCloseButton />
        </SheetHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <SheetBody className="space-y-4">{children}</SheetBody>
          <SheetFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
