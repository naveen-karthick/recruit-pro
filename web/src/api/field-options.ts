import { apiGet } from './client'
import type { MasterItem, SubIndustry, SubFunctionalExpertise, User } from '@/types'

/** Field types that support multi-select — each maps to a GET /api/options/:type endpoint */
export type FieldOptionType =
  | 'industries'
  | 'sub-industries'
  | 'functional-expertise'
  | 'sub-functional-expertise'
  | 'skills'
  | 'keywords'
  | 'brands'
  | 'users'

export function fetchFieldOptions(
  type: FieldOptionType,
  params?: { parentId?: string },
): Promise<MasterItem[]> {
  return apiGet<MasterItem[]>(`/options/${type}`, {
    parentId: params?.parentId,
  })
}

// Legacy master-data helpers (used where parent filters apply)
export function fetchIndustries() {
  return fetchFieldOptions('industries')
}

export function fetchSubIndustries(industryId?: string) {
  if (industryId) {
    return apiGet<SubIndustry[]>('/options/sub-industries', { parentId: industryId })
  }
  return fetchFieldOptions('sub-industries')
}

export function fetchFunctionalExpertise() {
  return fetchFieldOptions('functional-expertise')
}

export function fetchSubFunctionalExpertise(functionalExpertiseId?: string) {
  if (functionalExpertiseId) {
    return apiGet<SubFunctionalExpertise[]>('/options/sub-functional-expertise', {
      parentId: functionalExpertiseId,
    })
  }
  return fetchFieldOptions('sub-functional-expertise')
}

export function fetchSkills() {
  return fetchFieldOptions('skills')
}

export function fetchKeywords() {
  return fetchFieldOptions('keywords')
}

export function fetchBrands() {
  return fetchFieldOptions('brands')
}

export function fetchUsers() {
  return fetchFieldOptions('users') as Promise<User[]>
}

export function fetchCompanyOptions() {
  return apiGet<MasterItem[]>('/options/companies')
}

export function fetchCompanyAddressOptions(companyId: string) {
  return apiGet<MasterItem[]>(`/companies/${companyId}/address-options`)
}
