import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { JobsInsights } from '@/components/data/EntityInsightsPanel'
import { EntityPageShell } from '@/components/data/EntityPageShell'
import { RecordDrawer } from '@/components/layout/RecordDrawer'
import { PaginationBar } from '@/components/table/PaginationBar'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { useRecordDrawerStack } from '@/hooks/useRecordDrawerStack'
import { JobsTable } from './JobsTable'
import { JobsTableToolbar } from './JobsTableToolbar'
import { JobCreateModal } from './JobCreateModal'
import { JobsOverview } from './JobsOverview'
import { useJobsQuery, useJobStatsQuery } from './hooks'

export function JobsPage() {
  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [createOpen, setCreateOpen] = useState(false)
  const drawer = useRecordDrawerStack('job')

  const { data, isLoading } = useJobsQuery(page, DEFAULT_PAGE_SIZE, tableSearch)
  const { data: stats, isLoading: statsLoading } = useJobStatsQuery()

  const selectedCount = Object.keys(rowSelection).length

  const handleSearchChange = (value: string) => {
    setTableSearch(value)
    setPage(1)
    setRowSelection({})
  }

  return (
    <>
      <EntityPageShell
        title="Jobs"
        description="Manage active vacancies and track recruitment pipelines."
        searchPlaceholder="Search requisitions..."
        addLabel="Post a Job"
        count={data?.total}
        overview={<JobsOverview stats={stats} isLoading={statsLoading} />}
        onAdd={() => setCreateOpen(true)}
        footer={<JobsInsights stats={stats} isLoading={statsLoading} />}
        panel={
          <RecordDrawer
            sectionLabel="Jobs"
            open={drawer.open}
            stack={drawer.stack}
            onOpenChange={drawer.handleOpenChange}
            onNavigateRecord={drawer.navigateRecord}
            onPop={drawer.pop}
            onPopToIndex={drawer.popToIndex}
          />
        }
      >
        <JobsTableToolbar
          search={tableSearch}
          onSearchChange={handleSearchChange}
          selectedCount={selectedCount}
        />
        <JobsTable
          jobs={data?.data ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onJobTitleClick={(job) => drawer.openRecord({ type: 'job', id: job.id })}
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

      <JobCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
