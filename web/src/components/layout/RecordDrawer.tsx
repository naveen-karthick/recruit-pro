import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { MainPanelDrawer } from '@/components/layout/MainPanelDrawer'
import { CompanyRecordPanel } from '@/features/companies/CompanyRecordPanel'
import { ContactRecordPanel } from '@/features/contacts/ContactRecordPanel'
import { useCompanyQuery } from '@/features/companies/hooks'
import { useContactQuery } from '@/features/contacts/hooks'
import { JobRecordPanel } from '@/features/jobs/JobRecordPanel'
import { useJobQuery } from '@/features/jobs/hooks'
import { CandidateRecordPanel } from '@/features/candidates/CandidateRecordPanel'
import { useCandidateQuery } from '@/features/candidates/hooks'
import { frameKey, type RecordFrame } from '@/lib/record-drawer'
import { candidateFullName, contactFullName } from '@/types'

function StackFrameLabel({ frame }: { frame: RecordFrame }) {
  const { data: company } = useCompanyQuery(frame.type === 'company' ? frame.id : null)
  const { data: contact } = useContactQuery(frame.type === 'contact' ? frame.id : null)
  const { data: job } = useJobQuery(frame.type === 'job' ? frame.id : null)
  const { data: candidate } = useCandidateQuery(frame.type === 'candidate' ? frame.id : null)

  if (frame.type === 'company') return <>{company?.companyName ?? 'Company'}</>
  if (frame.type === 'contact') return <>{contact ? contactFullName(contact) : 'Contact'}</>
  if (frame.type === 'candidate') {
    return <>{candidate ? candidateFullName(candidate) : 'Candidate'}</>
  }
  return <>{job?.jobTitle ?? 'Job'}</>
}

interface RecordDrawerProps {
  sectionLabel: string
  open: boolean
  stack: RecordFrame[]
  onOpenChange: (open: boolean) => void
  onNavigateRecord: (frame: RecordFrame) => void
  onPop: () => void
  onPopToIndex: (index: number) => void
}

export function RecordDrawer({
  sectionLabel,
  open,
  stack,
  onOpenChange,
  onNavigateRecord,
  onPop,
  onPopToIndex,
}: RecordDrawerProps) {
  const top = stack[stack.length - 1] ?? null
  const canGoBack = stack.length > 1

  const handleBack = () => {
    if (canGoBack) onPop()
    else onOpenChange(false)
  }

  return (
    <MainPanelDrawer open={open} onOpenChange={onOpenChange} closeOnEscape className="flex h-full flex-col p-0">
      <div className="flex h-full min-h-0 flex-col bg-background">
        <div className="flex shrink-0 items-center gap-2 border-b border-border bg-muted/30 px-3 py-2">
          <button
            type="button"
            onClick={handleBack}
            className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label={canGoBack ? 'Go back' : 'Close drawer'}
          >
            <ChevronLeft className="h-4 w-4" />
            {canGoBack ? 'Back' : 'Close'}
          </button>

          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto text-sm" aria-label="Record navigation">
            <span className="shrink-0 text-muted-foreground">{sectionLabel}</span>
            {stack.map((frame, index) => {
              const isLast = index === stack.length - 1
              return (
                <span key={frameKey(frame)} className="flex shrink-0 items-center gap-1">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {isLast ? (
                    <span className="font-medium text-foreground">
                      <StackFrameLabel frame={frame} />
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onPopToIndex(index)}
                      className="cursor-pointer text-sky-600 hover:text-sky-700 hover:underline"
                    >
                      <StackFrameLabel frame={frame} />
                    </button>
                  )}
                </span>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent"
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col">
          {top?.type === 'company' && (
            <CompanyRecordPanel key={frameKey(top)} companyId={top.id} onNavigateRecord={onNavigateRecord} />
          )}
          {top?.type === 'contact' && (
            <ContactRecordPanel key={frameKey(top)} contactId={top.id} onNavigateRecord={onNavigateRecord} />
          )}
          {top?.type === 'job' && (
            <JobRecordPanel key={frameKey(top)} jobId={top.id} onNavigateRecord={onNavigateRecord} />
          )}
          {top?.type === 'candidate' && (
            <CandidateRecordPanel key={frameKey(top)} candidateId={top.id} />
          )}
        </div>
      </div>
    </MainPanelDrawer>
  )
}
