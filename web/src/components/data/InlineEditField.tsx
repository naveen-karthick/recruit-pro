import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { Check, Loader2, Pencil, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { FieldOptionType } from '@/api/field-options'
import { AsyncMultiSelect, StaticSingleSelect } from './AsyncMultiSelect'
import { useFieldOptionsQuery } from '@/hooks/useMasterData'

function formatDisplay(value: string | number | null | undefined) {
  if (value == null || value === '') return '—'
  return String(value)
}

function useDismissOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!enabled) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (ref.current?.contains(target)) return
      onDismiss()
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [enabled, onDismiss, ref])
}

function viewModeClasses(readOnly?: boolean, editing?: boolean) {
  return cn(
    'group w-full rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors',
    editing && 'border-sky-200 bg-sky-50/50 dark:border-sky-900 dark:bg-sky-950/20',
    !editing && !readOnly && 'cursor-pointer hover:border-border/60 hover:bg-muted/20',
    readOnly && 'cursor-default',
  )
}

function FieldLabel({ label }: { label: string }) {
  return (
    <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {label}
    </div>
  )
}

function InlineActions({
  onConfirm,
  onCancel,
  isSaving,
  disabled,
}: {
  onConfirm: () => void
  onCancel: () => void
  isSaving?: boolean
  disabled?: boolean
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        disabled={disabled || isSaving}
        onClick={onConfirm}
        title="Save"
        className="cursor-pointer rounded-md p-1.5 text-emerald-600 transition-colors hover:bg-emerald-50 disabled:opacity-40 dark:hover:bg-emerald-950/50"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
      </button>
      <button
        type="button"
        disabled={isSaving}
        onClick={onCancel}
        title="Cancel"
        className="cursor-pointer rounded-md p-1.5 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40 dark:hover:bg-red-950/40"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface InlineEditFieldProps {
  label: string
  value: string | number | null | undefined
  onSave: (value: string) => Promise<void>
  type?: 'text' | 'number' | 'email' | 'url' | 'date' | 'textarea'
  className?: string
  readOnly?: boolean
}

export function InlineEditField({
  label,
  value,
  onSave,
  type = 'text',
  className,
  readOnly,
}: InlineEditFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const startEdit = () => {
    if (readOnly) return
    setDraft(value == null || value === '' ? '' : String(value))
    setEditing(true)
  }

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const cancel = () => {
    setEditing(false)
    setDraft('')
  }

  useDismissOnClickOutside(containerRef, editing && !isSaving, cancel)

  const confirm = async () => {
    setIsSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && type !== 'textarea') {
      e.preventDefault()
      void confirm()
    }
    if (e.key === 'Escape') cancel()
  }

  return (
    <div ref={containerRef} className={cn(viewModeClasses(readOnly, editing), className)}>
      {editing ? (
        <>
          <FieldLabel label={label} />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              {type === 'textarea' ? (
                <Textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[72px] text-sm"
                  disabled={isSaving}
                />
              ) : (
                <Input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-8 text-sm"
                  disabled={isSaving}
                />
              )}
            </div>
            <InlineActions onConfirm={confirm} onCancel={cancel} isSaving={isSaving} />
          </div>
        </>
      ) : (
        <button type="button" onClick={startEdit} disabled={readOnly} className="w-full text-left">
          <FieldLabel label={label} />
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'min-w-0 flex-1 text-sm text-foreground',
                !readOnly && 'group-hover:text-sky-700',
              )}
            >
              {formatDisplay(value)}
            </span>
            {!readOnly && (
              <span className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  )
}

interface InlineEditMultiSelectProps {
  label: string
  optionType: FieldOptionType
  parentId?: string
  value: string[]
  displayNames: string[]
  onSave: (ids: string[]) => Promise<void>
  readOnly?: boolean
  className?: string
}

export function InlineEditMultiSelect({
  label,
  optionType,
  parentId,
  value,
  displayNames,
  onSave,
  readOnly,
  className,
}: InlineEditMultiSelectProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const startEdit = () => {
    if (readOnly) return
    setDraft([...value])
    setEditing(true)
  }

  const cancel = () => {
    setEditing(false)
    setDraft([])
  }

  useDismissOnClickOutside(containerRef, editing && !isSaving, cancel)

  const confirm = async () => {
    setIsSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const { data: options = [] } = useFieldOptionsQuery(optionType, {
    parentId,
    enabled: displayNames.length === 0 && value.length > 0,
  })

  const resolvedNames =
    displayNames.length > 0
      ? displayNames
      : (value
          .map((id) => options.find((o) => o.id === id)?.name)
          .filter(Boolean) as string[])

  const display = resolvedNames.length ? resolvedNames.join(', ') : '—'

  return (
    <div ref={containerRef} className={cn(viewModeClasses(readOnly, editing), className)}>
      {editing ? (
        <>
          <FieldLabel label={label} />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <AsyncMultiSelect
                optionType={optionType}
                parentId={parentId}
                value={draft}
                onChange={setDraft}
                disabled={isSaving}
              />
            </div>
            <InlineActions onConfirm={confirm} onCancel={cancel} isSaving={isSaving} />
          </div>
        </>
      ) : (
        <button type="button" onClick={startEdit} disabled={readOnly} className="w-full text-left">
          <FieldLabel label={label} />
          <div className="flex items-start gap-2">
            <span
              className={cn(
                'min-w-0 flex-1 text-sm text-foreground',
                !readOnly && 'group-hover:text-sky-700',
              )}
            >
              {display}
            </span>
            {!readOnly && (
              <span className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  )
}

interface InlineEditSelectProps {
  label: string
  value: string
  displayValue: string
  options: { id: string; name: string }[]
  isLoading?: boolean
  onSave: (value: string) => Promise<void>
  readOnly?: boolean
  allowEmpty?: boolean
  className?: string
}

export function InlineEditSelect({
  label,
  value,
  displayValue,
  options,
  isLoading,
  onSave,
  readOnly,
  allowEmpty = true,
  className,
}: InlineEditSelectProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const startEdit = () => {
    if (readOnly) return
    setDraft(value)
    setEditing(true)
  }

  const cancel = () => setEditing(false)

  useDismissOnClickOutside(containerRef, editing && !isSaving, cancel)

  const confirm = async () => {
    setIsSaving(true)
    try {
      await onSave(draft)
      setEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div ref={containerRef} className={cn(viewModeClasses(readOnly, editing), className)}>
      {editing ? (
        <>
          <FieldLabel label={label} />
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <StaticSingleSelect
                options={options}
                value={draft}
                onChange={setDraft}
                isLoading={isLoading}
                disabled={isSaving}
                allowEmpty={allowEmpty}
              />
            </div>
            <InlineActions onConfirm={confirm} onCancel={cancel} isSaving={isSaving} />
          </div>
        </>
      ) : (
        <button type="button" onClick={startEdit} disabled={readOnly} className="w-full text-left">
          <FieldLabel label={label} />
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'min-w-0 flex-1 text-sm text-foreground',
                !readOnly && 'group-hover:text-sky-700',
              )}
            >
              {displayValue || '—'}
            </span>
            {!readOnly && (
              <span className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:bg-accent">
                <Pencil className="h-3.5 w-3.5" />
              </span>
            )}
          </div>
        </button>
      )}
    </div>
  )
}

export function RecordPanelHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border bg-background px-6 py-4">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  )
}

export function RecordSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1">
      <h3 className="mb-2 border-b border-border pb-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <div className="grid gap-1 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function InlineReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div className="rounded-lg px-3 py-2.5">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <p className="text-sm text-foreground">{value || '—'}</p>
    </div>
  )
}
