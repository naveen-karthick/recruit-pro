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
import type { Company } from '@/types'

interface CompaniesTableProps {
  companies: Company[]
  isLoading?: boolean
  rowSelection: RowSelectionState
  onRowSelectionChange: (state: RowSelectionState) => void
  onCompanyNameClick: (company: Company) => void
  page: number
  pageSize: number
}

export function CompaniesTable({
  companies,
  isLoading,
  rowSelection,
  onRowSelectionChange,
  onCompanyNameClick,
  page,
  pageSize,
}: CompaniesTableProps) {
  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="h-3.5 w-3.5 cursor-pointer rounded border-border accent-foreground"
            checked={table.getIsAllPageRowsSelected()}
            ref={(el) => {
              if (el) {
                el.indeterminate =
                  table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
              }
            }}
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
            aria-label={`Select ${row.original.companyName}`}
          />
        ),
        size: 40,
      },
      {
        id: 'view',
        header: 'View',
        cell: () => (
          <button
            type="button"
            className="cursor-pointer text-sky-600 hover:text-sky-700"
            onClick={(e) => e.stopPropagation()}
            aria-label="View record"
          >
            <FileText className="h-4 w-4" />
          </button>
        ),
      },
      {
        accessorKey: 'companyName',
        header: 'Company',
        cell: ({ row }) => (
          <button
            type="button"
            className="cursor-pointer text-left font-medium text-sky-600 hover:text-sky-700 hover:underline"
            onClick={(e) => {
              e.stopPropagation()
              onCompanyNameClick(row.original)
            }}
          >
            {row.original.companyName}
          </button>
        ),
      },
      {
        id: 'industries',
        header: 'Industries',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatNames(row.original.industryNames)}
          </span>
        ),
      },
      {
        accessorKey: 'website',
        header: 'Website',
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue<string>() || '—'}</span>
        ),
      },
      {
        id: 'parent',
        header: 'Parent company',
        cell: ({ row }) => (
          <span className="text-sm">{row.original.parentCompanyName || '—'}</span>
        ),
      },
      {
        id: 'brands',
        header: 'Brands',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatNames(row.original.brandNames)}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="tabular-nums text-muted-foreground text-xs">
            {formatDateTime(getValue<string>())}
          </span>
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ getValue }) => (
          <span className="tabular-nums text-muted-foreground text-xs">
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
    [onCompanyNameClick, page, pageSize],
  )

  const table = useReactTable({
    data: companies,
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
      emptyMessage="No companies match your search."
    />
  )
}
