import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ENTITY_DRAWER_PARAM } from '@/lib/entity-navigation'

export function useEntityDrawerFromUrl(param = ENTITY_DRAWER_PARAM) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const idFromUrl = searchParams.get(param)

  useEffect(() => {
    if (idFromUrl) {
      setSelectedId(idFromUrl)
      setDetailOpen(true)
    }
  }, [idFromUrl])

  const openDetail = (id: string) => {
    setSelectedId(id)
    setDetailOpen(true)
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.set(param, id)
        return next
      },
      { replace: true },
    )
  }

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open)
    if (!open) {
      setSelectedId(null)
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.delete(param)
          return next
        },
        { replace: true },
      )
    }
  }

  return {
    selectedId,
    detailOpen,
    openDetail,
    handleDetailOpenChange,
  }
}
