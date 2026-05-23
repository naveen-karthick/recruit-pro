import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import type { Contact, CreateContactInput, UpdateContactInput } from '@/types'
import type { ListParams, PaginatedResponse } from './types'

export type { CreateContactInput, UpdateContactInput }

export function fetchContacts(params: ListParams) {
  return apiGet<PaginatedResponse<Contact>>('/contacts', {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  })
}

export function fetchContact(id: string) {
  return apiGet<Contact>(`/contacts/${id}`)
}

export function createContact(input: CreateContactInput) {
  return apiPost<Contact>('/contacts', input)
}

export function updateContact(id: string, input: UpdateContactInput) {
  return apiPatch<Contact>(`/contacts/${id}`, input)
}

export function deleteContact(id: string) {
  return apiDelete(`/contacts/${id}`)
}

export interface ContactStats {
  total: number
  withEmail: number
  withPhone: number
  withLinkedIn: number
}

export function fetchContactStats() {
  return apiGet<ContactStats>('/contacts/stats')
}
