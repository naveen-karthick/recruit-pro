import { apiGet } from './client'

const RESULT_LIMIT = 10

export type QuickSearchTab = 'candidates' | 'contacts' | 'companies' | 'jobs'

export type QuickSearchHit = {
  entity: QuickSearchTab
  id: string
  name: string
  subtitle: string
  email: string
  phone: string
}

export interface QuickSearchResponse {
  query: string
  counts: Record<QuickSearchTab, number>
  results: Record<QuickSearchTab, QuickSearchHit[]>
}

export async function quickSearch(query: string): Promise<QuickSearchResponse> {
  return apiGet<QuickSearchResponse>('/search', { q: query })
}

export { RESULT_LIMIT }
