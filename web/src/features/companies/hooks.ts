import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCompany,
  deleteCompany,
  fetchCompanies,
  fetchCompany,
  fetchCompanyContacts,
  fetchCompanyStats,
  updateCompany,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from '@/api/companies'

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...companyKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (id: string) => [...companyKeys.details(), id] as const,
  stats: () => [...companyKeys.all, 'stats'] as const,
}

export function useCompaniesQuery(page: number, pageSize: number, search?: string) {
  return useQuery({
    queryKey: companyKeys.list(page, pageSize, search),
    queryFn: () => fetchCompanies({ page, pageSize, search }),
  })
}

export function useCompanyStatsQuery() {
  return useQuery({
    queryKey: companyKeys.stats(),
    queryFn: fetchCompanyStats,
  })
}

export function useCompanyQuery(id: string | null) {
  return useQuery({
    queryKey: companyKeys.detail(id ?? ''),
    queryFn: () => fetchCompany(id!),
    enabled: Boolean(id),
  })
}

export function useCompanyContactsQuery(companyId: string | null) {
  return useQuery({
    queryKey: [...companyKeys.detail(companyId ?? ''), 'contacts'] as const,
    queryFn: () => fetchCompanyContacts(companyId!),
    enabled: Boolean(companyId),
  })
}

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCompanyInput) => createCompany(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: companyKeys.stats() })
    },
  })
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCompanyInput }) =>
      updateCompany(id, input),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: companyKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: companyKeys.stats() })
    },
  })
}

export function useDeleteCompanyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCompany(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: companyKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: companyKeys.stats() })
    },
  })
}
