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

interface DetailDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  isSubmitting?: boolean
  onSubmit: () => void
  children: React.ReactNode
}

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  description,
  isSubmitting,
  onSubmit,
  children,
}: DetailDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size="full">
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
          <SheetBody className="space-y-6">{children}</SheetBody>
          <SheetFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save changes'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
