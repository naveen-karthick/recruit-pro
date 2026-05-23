import { useQuery } from '@tanstack/react-query'
import { quickSearch } from '@/api/quick-search'

export const quickSearchKeys = {
  all: ['quickSearch'] as const,
  query: (q: string) => [...quickSearchKeys.all, q] as const,
}

export function useQuickSearch(keyword: string) {
  const trimmed = keyword.trim()
  return useQuery({
    queryKey: quickSearchKeys.query(trimmed),
    queryFn: () => quickSearch(trimmed),
    enabled: trimmed.length >= 2,
    staleTime: 15_000,
  })
}
