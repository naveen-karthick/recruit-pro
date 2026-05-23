import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCandidate,
  deleteCandidate,
  fetchCandidates,
  fetchCandidate,
  fetchCandidateStats,
  updateCandidate,
  type CreateCandidateInput,
  type UpdateCandidateInput,
} from '@/api/candidates'

export const candidateKeys = {
  all: ['candidates'] as const,
  lists: () => [...candidateKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...candidateKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...candidateKeys.all, 'detail'] as const,
  detail: (id: string) => [...candidateKeys.details(), id] as const,
  stats: () => [...candidateKeys.all, 'stats'] as const,
}

export function useCandidatesQuery(page: number, pageSize: number, search?: string) {
  return useQuery({
    queryKey: candidateKeys.list(page, pageSize, search),
    queryFn: () => fetchCandidates({ page, pageSize, search }),
  })
}

export function useCandidateStatsQuery() {
  return useQuery({
    queryKey: candidateKeys.stats(),
    queryFn: fetchCandidateStats,
  })
}

export function useCandidateQuery(id: string | null) {
  return useQuery({
    queryKey: candidateKeys.detail(id ?? ''),
    queryFn: () => fetchCandidate(id!),
    enabled: Boolean(id),
  })
}

export function useCreateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCandidateInput) => createCandidate(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: candidateKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: candidateKeys.stats() })
    },
  })
}

export function useUpdateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCandidateInput }) =>
      updateCandidate(id, input),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: candidateKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: candidateKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: candidateKeys.stats() })
    },
  })
}

export function useDeleteCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCandidate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: candidateKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: candidateKeys.stats() })
    },
  })
}
