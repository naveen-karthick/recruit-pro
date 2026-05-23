import { flexRender, type Table as TanStackTable } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

interface DataTableProps<T> {
  table: TanStackTable<T>
  onRowClick?: (row: T) => void
  isLoading?: boolean
  emptyMessage?: string
  dense?: boolean
}

export function DataTable<T>({
  table,
  onRowClick,
  isLoading,
  emptyMessage = 'No records found.',
  dense = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">Loading...</p>
    )
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[320px] overflow-x-auto [&_button]:cursor-pointer [&_input]:cursor-pointer [&_a]:cursor-pointer">
      <table className="w-full border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border bg-muted/40">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={cn(
                    'text-left text-xs font-medium uppercase tracking-wider text-muted-foreground',
                    dense ? 'px-3 py-2' : 'px-6 py-3',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row.original)}
              className={cn(
                'border-b border-border transition-colors',
                index % 2 === 1 && 'bg-table-stripe',
                onRowClick && 'cursor-pointer hover:bg-table-hover',
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cn('text-sm', dense ? 'px-3 py-2' : 'px-6 py-3.5')}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
