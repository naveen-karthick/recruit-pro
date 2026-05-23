import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { CompaniesInsights } from '@/components/data/EntityInsightsPanel'
import { EntityPageShell } from '@/components/data/EntityPageShell'
import { RecordDrawer } from '@/components/layout/RecordDrawer'
import { PaginationBar } from '@/components/table/PaginationBar'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { useRecordDrawerStack } from '@/hooks/useRecordDrawerStack'
import { CompaniesTable } from './CompaniesTable'
import { CompaniesTableToolbar } from './CompaniesTableToolbar'
import { CompanyCreateModal } from './CompanyCreateModal'
import { CompaniesOverview } from './CompaniesOverview'
import { useCompaniesQuery, useCompanyStatsQuery } from './hooks'

export function CompaniesPage() {
  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [createOpen, setCreateOpen] = useState(false)
  const drawer = useRecordDrawerStack('company')

  const { data, isLoading } = useCompaniesQuery(
    page,
    DEFAULT_PAGE_SIZE,
    tableSearch,
  )
  const { data: stats, isLoading: statsLoading } = useCompanyStatsQuery()

  const selectedCount = Object.keys(rowSelection).length

  const handleSearchChange = (value: string) => {
    setTableSearch(value)
    setPage(1)
    setRowSelection({})
  }

  return (
    <>
      <EntityPageShell
        title="Companies"
        description="Manage and track your client relationships and hiring pipelines."
        searchPlaceholder="Search companies..."
        addLabel="Add Company"
        count={data?.total}
        overview={
          <CompaniesOverview stats={stats} isLoading={statsLoading} />
        }
        onAdd={() => setCreateOpen(true)}
        footer={
          <CompaniesInsights stats={stats} isLoading={statsLoading} />
        }
        panel={
          <RecordDrawer
            sectionLabel="Companies"
            open={drawer.open}
            stack={drawer.stack}
            onOpenChange={drawer.handleOpenChange}
            onNavigateRecord={drawer.navigateRecord}
            onPop={drawer.pop}
            onPopToIndex={drawer.popToIndex}
          />
        }
      >
        <CompaniesTableToolbar
          search={tableSearch}
          onSearchChange={handleSearchChange}
          selectedCount={selectedCount}
        />
        <CompaniesTable
          companies={data?.data ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onCompanyNameClick={(company) =>
            drawer.openRecord({ type: 'company', id: company.id })
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

      <CompanyCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
