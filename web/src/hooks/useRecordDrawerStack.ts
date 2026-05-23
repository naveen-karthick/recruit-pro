import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  navigateToRecord,
  RECORD_STACK_PARAM,
  serializeStack,
  stackFromLegacyParams,
  type RecordEntityType,
  type RecordFrame,
} from '@/lib/record-drawer'

function clearDrawerParams(params: URLSearchParams) {
  params.delete(RECORD_STACK_PARAM)
  params.delete('id')
  params.delete('contact')
  params.delete('company')
}

export function useRecordDrawerStack(sectionType: RecordEntityType) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [open, setOpen] = useState(false)
  const [stack, setStack] = useState<RecordFrame[]>([])

  const syncUrl = useCallback(
    (frames: RecordFrame[]) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          clearDrawerParams(next)
          if (frames.length > 0) {
            next.set(RECORD_STACK_PARAM, serializeStack(frames))
          }
          return next
        },
        { replace: true },
      )
    },
    [setSearchParams],
  )

  useEffect(() => {
    const parsed = stackFromLegacyParams(searchParams, sectionType)
    if (parsed.length > 0) {
      setStack(parsed)
      setOpen(true)
    } else {
      setStack([])
      setOpen(false)
    }
  }, [searchParams, sectionType])

  const openRecord = useCallback(
    (frame: RecordFrame) => {
      const next = [frame]
      setStack(next)
      setOpen(true)
      syncUrl(next)
    },
    [syncUrl],
  )

  const navigateRecord = useCallback(
    (frame: RecordFrame) => {
      setStack((prev) => {
        const next = navigateToRecord(prev, frame)
        syncUrl(next)
        return next
      })
    },
    [syncUrl],
  )

  const pop = useCallback(() => {
    setStack((prev) => {
      if (prev.length <= 1) {
        setOpen(false)
        syncUrl([])
        return []
      }
      const next = prev.slice(0, -1)
      syncUrl(next)
      return next
    })
  }, [syncUrl])

  const popToIndex = useCallback(
    (index: number) => {
      setStack((prev) => {
        const next = prev.slice(0, index + 1)
        syncUrl(next)
        return next
      })
    },
    [syncUrl],
  )

  const close = useCallback(() => {
    setOpen(false)
    setStack([])
    syncUrl([])
  }, [syncUrl])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) close()
    },
    [close],
  )

  const top = stack[stack.length - 1] ?? null

  return {
    open,
    stack,
    top,
    openRecord,
    navigateRecord,
    pop,
    popToIndex,
    close,
    handleOpenChange,
  }
}
