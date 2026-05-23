import { useQuery } from '@tanstack/react-query'
import {
  fetchBrands,
  fetchCompanyAddressOptions,
  fetchCompanyOptions,
  fetchFieldOptions,
  fetchFunctionalExpertise,
  fetchIndustries,
  fetchKeywords,
  fetchSkills,
  fetchSubFunctionalExpertise,
  fetchSubIndustries,
  fetchUsers,
  type FieldOptionType,
} from '@/api/field-options'

export const optionKeys = {
  all: ['field-options'] as const,
  type: (type: FieldOptionType, parentId?: string) =>
    [...optionKeys.all, type, parentId ?? 'all'] as const,
  companies: () => [...optionKeys.all, 'companies'] as const,
  companyAddresses: (companyId: string) =>
    [...optionKeys.all, 'company-addresses', companyId] as const,
}

export function useFieldOptionsQuery(
  type: FieldOptionType,
  options?: { parentId?: string; enabled?: boolean },
) {
  return useQuery({
    queryKey: optionKeys.type(type, options?.parentId),
    queryFn: () => fetchFieldOptions(type, { parentId: options?.parentId }),
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useIndustriesQuery() {
  return useQuery({ queryKey: optionKeys.type('industries'), queryFn: fetchIndustries })
}

export function useSubIndustriesQuery(industryId?: string) {
  return useQuery({
    queryKey: optionKeys.type('sub-industries', industryId),
    queryFn: () => fetchSubIndustries(industryId),
  })
}

export function useFunctionalExpertiseQuery() {
  return useQuery({
    queryKey: optionKeys.type('functional-expertise'),
    queryFn: fetchFunctionalExpertise,
  })
}

export function useSubFunctionalExpertiseQuery(functionalExpertiseId?: string) {
  return useQuery({
    queryKey: optionKeys.type('sub-functional-expertise', functionalExpertiseId),
    queryFn: () => fetchSubFunctionalExpertise(functionalExpertiseId),
  })
}

export function useSkillsQuery() {
  return useQuery({ queryKey: optionKeys.type('skills'), queryFn: fetchSkills })
}

export function useKeywordsQuery() {
  return useQuery({ queryKey: optionKeys.type('keywords'), queryFn: fetchKeywords })
}

export function useBrandsQuery() {
  return useQuery({ queryKey: optionKeys.type('brands'), queryFn: fetchBrands })
}

export function useUsersQuery() {
  return useQuery({ queryKey: optionKeys.type('users'), queryFn: fetchUsers })
}

export function useCompanyOptionsQuery(enabled = true) {
  return useQuery({
    queryKey: optionKeys.companies(),
    queryFn: fetchCompanyOptions,
    enabled,
  })
}

export function useCompanyAddressOptionsQuery(companyId: string | null | undefined) {
  return useQuery({
    queryKey: optionKeys.companyAddresses(companyId ?? ''),
    queryFn: () => fetchCompanyAddressOptions(companyId!),
    enabled: Boolean(companyId),
  })
}

// Re-export keys for backwards compatibility
export const masterKeys = optionKeys
