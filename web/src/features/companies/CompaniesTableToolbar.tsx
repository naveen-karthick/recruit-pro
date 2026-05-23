import { Columns3, Filter, LayoutGrid, MoreHorizontal, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface CompaniesTableToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  selectedCount: number
}

export function CompaniesTableToolbar({
  search,
  onSearchChange,
  selectedCount,
}: CompaniesTableToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border bg-muted/30 px-6 py-3">
      <div className="relative w-full max-w-xs">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search table"
          className="h-8 bg-background pl-8 text-sm"
        />
      </div>
      <div className="flex items-center gap-1">
        {selectedCount > 0 && (
          <span className="mr-2 text-xs text-muted-foreground">
            {selectedCount} selected
          </span>
        )}
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Columns">
          <Columns3 className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Views">
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Filters">
          <Filter className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
