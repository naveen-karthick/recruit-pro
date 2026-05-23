import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContact,
  deleteContact,
  fetchContacts,
  fetchContact,
  fetchContactStats,
  updateContact,
  type CreateContactInput,
  type UpdateContactInput,
} from '@/api/contacts'

export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    [...contactKeys.lists(), { page, pageSize, search }] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
  stats: () => [...contactKeys.all, 'stats'] as const,
}

export function useContactsQuery(page: number, pageSize: number, search?: string) {
  return useQuery({
    queryKey: contactKeys.list(page, pageSize, search),
    queryFn: () => fetchContacts({ page, pageSize, search }),
  })
}

export function useContactStatsQuery() {
  return useQuery({
    queryKey: contactKeys.stats(),
    queryFn: fetchContactStats,
  })
}

export function useContactQuery(id: string | null) {
  return useQuery({
    queryKey: contactKeys.detail(id ?? ''),
    queryFn: () => fetchContact(id!),
    enabled: Boolean(id),
  })
}

export function useCreateContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateContactInput) => createContact(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

export function useUpdateContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateContactInput }) =>
      updateContact(id, input),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: contactKeys.detail(id) })
      void queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}

export function useDeleteContactMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: contactKeys.stats() })
    },
  })
}
