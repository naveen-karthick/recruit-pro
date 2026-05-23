import { useMemo } from 'react'
import {
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
} from '@tanstack/react-table'
import { FileText } from 'lucide-react'
import { DataTable } from '@/components/table/DataTable'
import { candidateFullName, formatDateTime, formatNames } from '@/types'
import type { Candidate } from '@/types'

interface CandidatesTableProps {
  candidates: Candidate[]
  isLoading?: boolean
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
  onCandidateNameClick: (candidate: Candidate) => void
  page: number
  pageSize: number
}

export function CandidatesTable({
  candidates,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  onCandidateNameClick,
  page,
  pageSize,
}: CandidatesTableProps) {
  const columns = useMemo<ColumnDef<Candidate>[]>(
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
            aria-label={`Select ${candidateFullName(row.original)}`}
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
              onCandidateNameClick(row.original)
            }}
          >
            {candidateFullName(row.original)}
          </button>
        ),
      },
      {
        accessorKey: 'currentJobTitle',
        header: 'Current role',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
      },
      {
        accessorKey: 'currentCompany',
        header: 'Current company',
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
        accessorKey: 'totalExperience',
        header: 'Experience (yrs)',
        cell: ({ getValue }) => {
          const v = getValue<number>()
          return <span className="tabular-nums">{v != null ? v : '—'}</span>
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
        accessorKey: 'availabilityDate',
        header: 'Available from',
        cell: ({ getValue }) => <span>{getValue<string>() || '—'}</span>,
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
    [onCandidateNameClick, page, pageSize],
  )

  const table = useReactTable({
    data: candidates,
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
    <DataTable
      table={table}
      isLoading={isLoading}
      emptyMessage="No candidates match your search."
    />
  )
}
