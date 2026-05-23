import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { CandidatesInsights } from '@/components/data/EntityInsightsPanel'
import { EntityPageShell } from '@/components/data/EntityPageShell'
import { RecordDrawer } from '@/components/layout/RecordDrawer'
import { PaginationBar } from '@/components/table/PaginationBar'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { useRecordDrawerStack } from '@/hooks/useRecordDrawerStack'
import { CandidatesTable } from './CandidatesTable'
import { CandidatesTableToolbar } from './CandidatesTableToolbar'
import { CandidateCreateModal } from './CandidateCreateModal'
import { CandidatesOverview } from './CandidatesOverview'
import { useCandidatesQuery, useCandidateStatsQuery } from './hooks'

export function CandidatesPage() {
  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [createOpen, setCreateOpen] = useState(false)
  const drawer = useRecordDrawerStack('candidate')

  const { data, isLoading } = useCandidatesQuery(
    page,
    DEFAULT_PAGE_SIZE,
    tableSearch,
  )
  const { data: stats, isLoading: statsLoading } = useCandidateStatsQuery()

  const selectedCount = Object.keys(rowSelection).length

  const handleSearchChange = (value: string) => {
    setTableSearch(value)
    setPage(1)
    setRowSelection({})
  }

  return (
    <>
      <EntityPageShell
        title="Candidates"
        description="Manage and evaluate your talent pipeline with AI-assisted matching."
        searchPlaceholder="Search candidates by skills, name, or role..."
        addLabel="Add Candidate"
        count={data?.total}
        overview={
          <CandidatesOverview stats={stats} isLoading={statsLoading} />
        }
        onAdd={() => setCreateOpen(true)}
        footer={
          <CandidatesInsights stats={stats} isLoading={statsLoading} />
        }
        panel={
          <RecordDrawer
            sectionLabel="Candidates"
            open={drawer.open}
            stack={drawer.stack}
            onOpenChange={drawer.handleOpenChange}
            onNavigateRecord={drawer.navigateRecord}
            onPop={drawer.pop}
            onPopToIndex={drawer.popToIndex}
          />
        }
      >
        <CandidatesTableToolbar
          search={tableSearch}
          onSearchChange={handleSearchChange}
          selectedCount={selectedCount}
        />
        <CandidatesTable
          candidates={data?.data ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onCandidateNameClick={(candidate) =>
            drawer.openRecord({ type: 'candidate', id: candidate.id })
          }
          page={data?.page ?? page}
          pageSize={data?.pageSize ?? DEFAULT_PAGE_SIZE}
        />
        {data && (
          <PaginationBar
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            pageSize={data.pageSize}
            onPageChange={(p) => {
              setPage(p)
              setRowSelection({})
            }}
          />
        )}
      </EntityPageShell>

      <CandidateCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
