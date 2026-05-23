import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createJob,
  deleteJob,
  fetchJobs,
  fetchJob,
  fetchJobStats,
  updateJob,
  type CreateJobInput,
  type UpdateJobInput,
} from '@/api/jobs'

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...jobKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  stats: () => [...jobKeys.all, 'stats'] as const,
}

export function useJobsQuery(page: number, pageSize: number, search?: string) {
  return useQuery({
    queryKey: jobKeys.list(page, pageSize, search),
    queryFn: () => fetchJobs({ page, pageSize, search }),
  })
}

export function useJobStatsQuery() {
  return useQuery({
    queryKey: jobKeys.stats(),
    queryFn: fetchJobStats,
  })
}

export function useJobQuery(id: string | null) {
  return useQuery({
    queryKey: jobKeys.detail(id ?? ''),
    queryFn: () => fetchJob(id!),
    enabled: Boolean(id),
  })
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateJobInput) => createJob(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: jobKeys.stats() })
    },
  })
}

export function useUpdateJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateJobInput }) => updateJob(id, input),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: jobKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: jobKeys.stats() })
    },
  })
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: jobKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: jobKeys.stats() })
    },
  })
}
