import { apiDelete, apiGet, apiPatch, apiPost } from './client'
import type { Job, CreateJobInput, UpdateJobInput } from '@/types'
import type { ListParams, PaginatedResponse } from './types'

export type { CreateJobInput, UpdateJobInput }

export function fetchJobs(params: ListParams) {
  return apiGet<PaginatedResponse<Job>>('/jobs', {
    page: params.page,
    pageSize: params.pageSize,
    search: params.search,
  })
}

export function fetchJob(id: string) {
  return apiGet<Job>(`/jobs/${id}`)
}

export function createJob(input: CreateJobInput) {
  return apiPost<Job>('/jobs', input)
}

export function updateJob(id: string, input: UpdateJobInput) {
  return apiPatch<Job>(`/jobs/${id}`, input)
}

export function deleteJob(id: string) {
  return apiDelete(`/jobs/${id}`)
}

export interface JobStats {
  total: number
  permanent: number
  contract: number
  jobLeads: number
}

export function fetchJobStats() {
  return apiGet<JobStats>('/jobs/stats')
}
