import { useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { DataTable } from '@/components/table/DataTable'
import { contactFullName, formatDateTime, formatNames } from '@/types'
import type { Contact } from '@/types'

interface ContactsTableProps {
  contacts: Contact[]
  isLoading?: boolean
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
  onContactNameClick: (contact: Contact) => void
  page: number
  pageSize: number
}

export function ContactsTable({
  contacts,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  onContactNameClick,
  page,
  pageSize,
}: ContactsTableProps) {
  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-foreground"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-foreground"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${contactFullName(row.original)}`}
          />
        ),
        size: 40,
      },
      {
        id: 'view',
        header: 'View',
        cell: () => <FileText className="h-4 w-4 text-sky-600" />,
      },
      {
        id: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer text-left font-medium text-sky-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation()
              onContactNameClick(row.original)
            }}
          >
            {contactFullName(row.original)}
          </button>
        ),
      },
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        accessorKey: 'jobTitle',
        header: 'Job title',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        accessorKey: 'primaryEmail',
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue<string>() || '—'}</span>
        ),
      },
      {
        accessorKey: 'primaryPhone',
        header: 'Phone',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        id: 'expertise',
        header: 'Functional expertise',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatNames(row.original.functionalExpertiseNames)}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatDateTime(getValue<string>())}
          </span>
        ),
      },
      {
        id: 'rowNumber',
        header: '',
        cell: ({ row }) => (
          <span className="text-muted-foreground/60 tabular-nums">
            {(page - 1) * pageSize + row.index + 1}
          </span>
        ),
      },
    ],
    [onContactNameClick, page, pageSize],
  )

  const table = useReactTable({
    data: contacts,
    columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const next = typeof updater === 'function' ? updater(rowSelection) : updater
      onRowSelectionChange(next)
    },
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable table={table} isLoading={isLoading} emptyMessage="No contacts match your search." />
  )
}
