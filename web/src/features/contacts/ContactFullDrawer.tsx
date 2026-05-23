import { MainPanelDrawer } from '@/components/layout/MainPanelDrawer'
import type { RecordFrame } from '@/lib/record-drawer'
import { ContactRecordPanel } from './ContactRecordPanel'

interface ContactFullDrawerProps {
  contactId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onCompanyClick?: (companyId: string) => void
  zIndex?: number
  suppressEscapeClose?: boolean
}

/** @deprecated Prefer RecordDrawer with useRecordDrawerStack on list pages */
export function ContactFullDrawer({
  contactId,
  open,
  onOpenChange,
  onCompanyClick,
  zIndex = 40,
  suppressEscapeClose = false,
}: ContactFullDrawerProps) {
  const handleNavigate = (frame: RecordFrame) => {
    if (frame.type === 'company') onCompanyClick?.(frame.id)
  }

  return (
    <MainPanelDrawer
      open={open}
      onOpenChange={onOpenChange}
      closeOnEscape={!suppressEscapeClose}
      zIndex={zIndex}
      className="flex h-full flex-col p-0"
    >
      {contactId ? (
        <ContactRecordPanel contactId={contactId} onNavigateRecord={handleNavigate} />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No contact selected
        </div>
      )}
    </MainPanelDrawer>
  )
}
