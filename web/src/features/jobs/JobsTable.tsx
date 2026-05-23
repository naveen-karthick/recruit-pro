import { useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { DataTable } from '@/components/table/DataTable'
import { formatDateTime, formatNames } from '@/types'
import type { Job } from '@/types'

interface JobsTableProps {
  jobs: Job[]
  isLoading?: boolean
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
  onJobTitleClick: (job: Job) => void
  page: number
  pageSize: number
}

export function JobsTable({
  jobs,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  onJobTitleClick,
  page,
  pageSize,
}: JobsTableProps) {
  const columns = useMemo<ColumnDef<Job>[]>(
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
            aria-label={`Select ${row.original.jobTitle}`}
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
        accessorKey: 'jobTitle',
        header: 'Job title',
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer text-left font-medium text-sky-600 hover:underline"
            onClick={(e) => {
              e.stopPropagation()
              onJobTitleClick(row.original)
            }}
          >
            {row.original.jobTitle}
          </button>
        ),
      },
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        accessorKey: 'jobCategory',
        header: 'Category',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        accessorKey: 'jobType',
        header: 'Type',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        id: 'location',
        header: 'Location',
        cell: ({ row }) => (
          <span>
            {[row.original.state, row.original.country].filter(Boolean).join(', ') || '—'}
          </span>
        ),
      },
      {
        id: 'salary',
        header: 'Salary range',
        cell: ({ row }) => {
          const { salaryFrom, salaryTo, currency } = row.original
          if (salaryFrom == null && salaryTo == null) return '—'
          return `${currency ?? ''} ${salaryFrom ?? '—'} – ${salaryTo ?? '—'}`.trim()
        },
      },
      {
        id: 'skills',
        header: 'Skills',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatNames(row.original.skillNames)}
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
    [onJobTitleClick, page, pageSize],
  )

  const table = useReactTable({
    data: jobs,
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

  return <DataTable table={table} isLoading={isLoading} emptyMessage="No jobs match your search." />
}
