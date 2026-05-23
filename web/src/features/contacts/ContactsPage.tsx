import { useState } from 'react'
import type { RowSelectionState } from '@tanstack/react-table'
import { ContactsInsights } from '@/components/data/EntityInsightsPanel'
import { EntityPageShell } from '@/components/data/EntityPageShell'
import { RecordDrawer } from '@/components/layout/RecordDrawer'
import { PaginationBar } from '@/components/table/PaginationBar'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { useRecordDrawerStack } from '@/hooks/useRecordDrawerStack'
import { ContactsTable } from './ContactsTable'
import { ContactsTableToolbar } from './ContactsTableToolbar'
import { ContactCreateModal } from './ContactCreateModal'
import { ContactsOverview } from './ContactsOverview'
import { useContactsQuery, useContactStatsQuery } from './hooks'

export function ContactsPage() {
  const [page, setPage] = useState(1)
  const [tableSearch, setTableSearch] = useState('')
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [createOpen, setCreateOpen] = useState(false)
  const drawer = useRecordDrawerStack('contact')

  const { data, isLoading } = useContactsQuery(
    page,
    DEFAULT_PAGE_SIZE,
    tableSearch,
  )
  const { data: stats, isLoading: statsLoading } = useContactStatsQuery()

  const selectedCount = Object.keys(rowSelection).length

  const handleSearchChange = (value: string) => {
    setTableSearch(value)
    setPage(1)
    setRowSelection({})
  }

  return (
    <>
      <EntityPageShell
        title="Contacts"
        description="Manage and track relationships with key decision makers."
        searchPlaceholder="Search contacts, companies, or roles..."
        addLabel="New Contact"
        count={data?.total}
        overview={
          <ContactsOverview stats={stats} isLoading={statsLoading} />
        }
        onAdd={() => setCreateOpen(true)}
        footer={
          <ContactsInsights stats={stats} isLoading={statsLoading} />
        }
        panel={
          <RecordDrawer
            sectionLabel="Contacts"
            open={drawer.open}
            stack={drawer.stack}
            onOpenChange={drawer.handleOpenChange}
            onNavigateRecord={drawer.navigateRecord}
            onPop={drawer.pop}
            onPopToIndex={drawer.popToIndex}
          />
        }
      >
        <ContactsTableToolbar
          search={tableSearch}
          onSearchChange={handleSearchChange}
          selectedCount={selectedCount}
        />
        <ContactsTable
          contacts={data?.data ?? []}
          isLoading={isLoading}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onContactNameClick={(contact) =>
            drawer.openRecord({ type: 'contact', id: contact.id })
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

      <ContactCreateModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
