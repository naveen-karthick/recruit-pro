import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import type { Candidate, CreateCandidateInput, UpdateCandidateInput } from '@/types'
import type { ListParams, PaginatedResponse } from './types'

export type { CreateCandidateInput, UpdateCandidateInput }

export function fetchCandidates(params: ListParams) {
  return apiGet<PaginatedResponse<Candidate>>('/candidates', {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  })
}

export function fetchCandidate(id: string) {
  return apiGet<Candidate>(`/candidates/${id}`)
}

export function createCandidate(input: CreateCandidateInput) {
  return apiPost<Candidate>('/candidates', input)
}

export function updateCandidate(id: string, input: UpdateCandidateInput) {
  return apiPatch<Candidate>(`/candidates/${id}`, input)
}

export function deleteCandidate(id: string) {
  return apiDelete(`/candidates/${id}`)
}

export interface CandidateStats {
  total: number
  withLinkedIn: number
  availableSoon: number
  avgExperience: number
}

export function fetchCandidateStats() {
  return apiGet<CandidateStats>('/candidates/stats')
}
