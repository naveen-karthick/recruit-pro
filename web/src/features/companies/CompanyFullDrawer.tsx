import { MainPanelDrawer } from '@/components/layout/MainPanelDrawer'
import type { RecordFrame } from '@/lib/record-drawer'
import { CompanyRecordPanel } from './CompanyRecordPanel'

interface CompanyFullDrawerProps {
  companyId: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onContactClick?: (contactId: string) => void
  zIndex?: number
  suppressEscapeClose?: boolean
}

/** @deprecated Prefer RecordDrawer with useRecordDrawerStack on list pages */
export function CompanyFullDrawer({
  companyId,
  open,
  onOpenChange,
  onContactClick,
  zIndex = 40,
  suppressEscapeClose = false,
}: CompanyFullDrawerProps) {
  const handleNavigate = (frame: RecordFrame) => {
    if (frame.type === 'contact') onContactClick?.(frame.id)
  }

  return (
    <MainPanelDrawer
      open={open}
      onOpenChange={onOpenChange}
      closeOnEscape={!suppressEscapeClose}
      zIndex={zIndex}
      className="flex h-full flex-col p-0"
    >
      {companyId ? (
        <CompanyRecordPanel companyId={companyId} onNavigateRecord={handleNavigate} />
      ) : (
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          No company selected
        </div>
      )}
    </MainPanelDrawer>
  )
}
