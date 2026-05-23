import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Loader2, X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { FieldOptionType } from '@/api/field-options'
import { useFieldOptionsQuery } from '@/hooks/useMasterData'
import type { MasterItem } from '@/types'

interface AsyncMultiSelectProps {
  label?: string
  optionType: FieldOptionType
  parentId?: string
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  className?: string
  placeholder?: string
  /** When true, fetches options only after the dropdown is opened */
  lazy?: boolean
}

export function AsyncMultiSelect({
  label,
  optionType,
  parentId,
  value,
  onChange,
  disabled,
  className,
  placeholder = 'Select options...',
  lazy = false,
}: AsyncMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [fetchEnabled, setFetchEnabled] = useState(!lazy)
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: options = [], isLoading, isFetching } = useFieldOptionsQuery(optionType, {
    parentId,
    enabled: fetchEnabled,
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedItems = value
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean) as MasterItem[]

  const toggle = (id: string) => {
    if (disabled) return
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    onChange(value.filter((v) => v !== id))
  }

  const openDropdown = () => {
    if (disabled) return
    setFetchEnabled(true)
    setOpen((o) => !o)
  }

  const loading = isLoading || isFetching

  return (
    <div className={cn('space-y-1.5', className)} ref={containerRef}>
      {label && <Label>{label}</Label>}

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={openDropdown}
          className={cn(
            'flex min-h-[38px] w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-left text-sm shadow-xs transition-colors',
            'hover:border-ring/60 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
            disabled && 'cursor-not-allowed opacity-50',
            open && 'border-ring ring-[3px] ring-ring/50',
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
            {selectedItems.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-200"
              >
                {item.name}
                {!disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => remove(item.id, e)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') remove(item.id, e as unknown as React.MouseEvent)
                    }}
                    className="cursor-pointer rounded-full p-0.5 hover:bg-sky-200 dark:hover:bg-sky-900"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </span>
            ))}
          </div>
          {loading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown
              className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
            />
          )}
        </button>

        {open && (
          <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-lg custom-scrollbar">
            {loading && options.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">Loading options...</p>
            ) : options.length === 0 ? (
              <p className="px-3 py-4 text-center text-xs text-muted-foreground">No options available</p>
            ) : (
              options.map((opt) => {
                const selected = value.includes(opt.id)
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggle(opt.id)}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent',
                      selected && 'bg-sky-50/80 dark:bg-sky-950/40',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                        selected ? 'border-sky-600 bg-sky-600 text-white' : 'border-border bg-background',
                      )}
                    >
                      {selected && <Check className="h-3 w-3" />}
                    </span>
                    <span className="truncate">{opt.name}</span>
                  </button>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/** Static options multi-select (company list, addresses) */
export function StaticMultiSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  isLoading,
  className,
  placeholder = 'Select options...',
}: {
  label?: string
  options: MasterItem[]
  value: string[]
  onChange: (ids: string[]) => void
  disabled?: boolean
  isLoading?: boolean
  className?: string
  placeholder?: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedItems = value.map((id) => options.find((o) => o.id === id)).filter(Boolean) as MasterItem[]

  const toggle = (id: string) => {
    if (disabled) return
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  const remove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (disabled) return
    onChange(value.filter((v) => v !== id))
  }

  return (
    <div className={cn('space-y-1.5', className)} ref={containerRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
          className={cn(
            'flex min-h-[38px] w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-2.5 py-1.5 text-left text-sm shadow-xs',
            disabled && 'cursor-not-allowed opacity-50',
            open && 'border-ring ring-[3px] ring-ring/50',
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
            {selectedItems.length === 0 && (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            {selectedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-0.5 rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800"
              >
                {item.name}
                {!disabled && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => remove(item.id, e)}
                    className="cursor-pointer rounded-full p-0.5 hover:bg-sky-200"
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </span>
            ))}
          </div>
          {isLoading ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
          ) : (
            <ChevronDown className={cn('h-4 w-4 shrink-0 text-muted-foreground', open && 'rotate-180')} />
          )}
        </button>
        {open && (
          <div className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover py-1 shadow-lg">
            {options.map((opt) => {
              const selected = value.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggle(opt.id)}
                  className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <span
                    className={cn(
                      'flex h-4 w-4 items-center justify-center rounded border',
                      selected ? 'border-sky-600 bg-sky-600 text-white' : 'border-border',
                    )}
                  >
                    {selected && <Check className="h-3 w-3" />}
                  </span>
                  {opt.name}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

interface AsyncSingleSelectProps {
  label?: string
  optionType: FieldOptionType
  value: string
  onChange: (id: string) => void
  disabled?: boolean
  allowEmpty?: boolean
  placeholder?: string
}

export function AsyncSingleSelect({
  label,
  optionType,
  value,
  onChange,
  disabled,
  allowEmpty = true,
  placeholder = 'Select...',
}: AsyncSingleSelectProps) {
  const { data: options = [], isLoading } = useFieldOptionsQuery(optionType)

  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <select
        value={value}
        disabled={disabled || isLoading}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
      >
        {allowEmpty && <option value="">{isLoading ? 'Loading...' : placeholder}</option>}
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export function StaticSingleSelect({
  label,
  options,
  value,
  onChange,
  disabled,
  isLoading,
  allowEmpty = true,
  placeholder = 'Select...',
}: {
  label?: string
  options: MasterItem[]
  value: string
  onChange: (id: string) => void
  disabled?: boolean
  isLoading?: boolean
  allowEmpty?: boolean
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      {label && <Label>{label}</Label>}
      <select
        value={value}
        disabled={disabled || isLoading}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
      >
        {allowEmpty && <option value="">{isLoading ? 'Loading...' : placeholder}</option>}
        {options.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  )
}

/** @deprecated Use AsyncMultiSelect */
export { AsyncMultiSelect as LookupMultiSelect }
