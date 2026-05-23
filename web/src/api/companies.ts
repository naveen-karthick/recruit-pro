import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import type { Company, Contact, Address, CreateCompanyInput, UpdateCompanyInput } from '@/types'
import type { ListParams, PaginatedResponse } from './types'

export type { CreateCompanyInput, UpdateCompanyInput }

export function fetchCompanies(params: ListParams) {
  return apiGet<PaginatedResponse<Company>>('/companies', {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  })
}

export function fetchCompany(id: string) {
  return apiGet<Company>(`/companies/${id}`)
}

export function createCompany(input: CreateCompanyInput) {
  return apiPost<Company>('/companies', input)
}

export function updateCompany(id: string, input: UpdateCompanyInput) {
  return apiPatch<Company>(`/companies/${id}`, input)
}

export function deleteCompany(id: string) {
  return apiDelete(`/companies/${id}`)
}

export function fetchCompanyContacts(companyId: string) {
  return apiGet<Contact[]>(`/companies/${companyId}/contacts`)
}

export function fetchCompanyAddresses(companyId: string) {
  return apiGet<Address[]>(`/companies/${companyId}/addresses`)
}

export interface CompanyStats {
  total: number
  withWebsite: number
  withParent: number
  totalAddresses: number
}

export function fetchCompanyStats() {
  return apiGet<CompanyStats>('/companies/stats')
}
