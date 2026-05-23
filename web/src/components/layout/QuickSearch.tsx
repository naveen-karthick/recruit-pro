import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  Contact,
  Loader2,
  Mail,
  Phone,
  Search,
  User,
  UserSearch,
  X,
} from 'lucide-react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useQuickSearch } from '@/hooks/useQuickSearch'
import type { QuickSearchHit, QuickSearchTab } from '@/api/quick-search'
import { entityDetailPath, entityListPath } from '@/lib/entity-navigation'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 2

const TABS: {
  id: QuickSearchTab
  label: string
  icon: typeof UserSearch
}[] = [
  { id: 'candidates', label: 'Candidates', icon: UserSearch },
  { id: 'contacts', label: 'Contacts', icon: Contact },
  { id: 'companies', label: 'Companies', icon: Building2 },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
]

interface QuickSearchProps {
  placeholder?: string
}

export function QuickSearch({
  placeholder = 'Quick search all records...',
}: QuickSearchProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const lastAutoTabQuery = useRef('')

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<QuickSearchTab>('candidates')

  const debouncedQuery = useDebouncedValue(query, DEBOUNCE_MS)
  const trimmedDebounced = debouncedQuery.trim()
  const canSearch = trimmedDebounced.length >= MIN_QUERY_LENGTH

  const { data, isFetching, isLoading } = useQuickSearch(debouncedQuery)

  useEffect(() => {
    if (canSearch) setOpen(true)
    if (!query.trim()) setOpen(false)
  }, [canSearch, query])

  useEffect(() => {
    if (!data || data.query === lastAutoTabQuery.current) return
    lastAutoTabQuery.current = data.query
    const firstWithResults = TABS.find((t) => data.counts[t.id] > 0)
    if (firstWithResults) setActiveTab(firstWithResults.id)
  }, [data])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const results = data?.results[activeTab] ?? []
  const showPanel = open && canSearch
  const isSearching = canSearch && (isLoading || isFetching)

  const handleResultClick = (hit: QuickSearchHit) => {
    navigate(entityDetailPath(hit.entity, hit.id))
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const clearSearch = () => {
    setQuery('')
    setOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div ref={containerRef} className="relative max-w-xl flex-1">
      <div
        className={cn(
          'flex min-h-9 items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1 shadow-sm transition-shadow',
          showPanel && 'ring-2 ring-ring/20',
        )}
      >
        <Search className="ml-1 h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => canSearch && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
              inputRef.current?.blur()
            }
          }}
          placeholder={placeholder}
          className="h-7 min-w-[120px] flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
          aria-label="Quick search"
          aria-expanded={showPanel}
          aria-controls="quick-search-results"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {isSearching && (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        )}
      </div>

      {showPanel && (
        <div
          id="quick-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-border bg-background shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div className="flex border-b border-border bg-muted/30">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const tabCount = data?.counts[tab.id] ?? 0
              const isActive = activeTab === tab.id
              const showSpinner = isFetching && isActive && data?.query !== trimmedDebounced
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-medium transition-colors',
                    isActive
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-muted-foreground hover:text-foreground',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5',
                      isActive ? 'text-orange-500' : 'text-sky-600',
                    )}
                  />
                  {tab.label} ({showSpinner ? '…' : tabCount})
                </button>
              )
            })}
          </div>

          <div className="max-h-[min(420px,50vh)] overflow-y-auto custom-scrollbar">
            {isSearching && results.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                Searching...
              </p>
            ) : results.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No {activeTab} found for &ldquo;{trimmedDebounced}&rdquo;
              </p>
            ) : (
              <ul>
                {results.map((hit) => (
                  <li
                    key={`${hit.entity}-${hit.id}`}
                    className="border-b border-border last:border-0"
                  >
                    <button
                      type="button"
                      role="option"
                      onClick={() => handleResultClick(hit)}
                      className="flex w-full cursor-pointer gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">{hit.name}</p>
                        <p className="text-xs text-muted-foreground">{hit.subtitle}</p>
                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {hit.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {hit.phone}
                            </span>
                          )}
                          {hit.email && (
                            <span className="inline-flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {hit.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border bg-muted/20 px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Quick search returns the top ten results. To see more, use advanced
              search.
            </p>
            <Button
              type="button"
              size="sm"
              className="shrink-0 cursor-pointer bg-teal-600 text-white hover:bg-teal-700"
              onClick={() => {
                navigate(entityListPath(activeTab))
                setOpen(false)
              }}
            >
              Open in advanced search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
