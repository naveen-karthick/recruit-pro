import { prisma } from '../lib/prisma.js'
import { syncJoinTable } from './lookup.js'
import { jobInclude, mapJob, withLookupMaps } from './mappers.js'
import { paginate, searchFilter, stripReadOnly } from '../utils/helpers.js'
import type { ForecastBy, JobCategory, JobType, PermanentSubType, SalaryType } from '@prisma/client'

const READ_ONLY = [
  'id', 'companyName', 'contactName', 'jobAddressDisplay', 'functionalExpertiseNames',
  'subFunctionalExpertiseNames', 'skillNames', 'keywordNames', 'createdAt', 'updatedAt',
] as const

type JobBody = {
  jobTitle?: string
  jobCategory?: JobCategory | null
  jobType?: JobType | null
  permanentSubType?: PermanentSubType | null
  headCount?: number | null
  companyId?: string
  contactId?: string | null
  country?: string | null
  state?: string | null
  jobAddressId?: string | null
  salaryType?: SalaryType | null
  monthsPerYear?: number | null
  annualSalary?: number | null
  salaryFrom?: number | null
  salaryTo?: number | null
  currency?: string | null
  forecastBy?: ForecastBy | null
  percentOfAnnualSalary?: number | null
  forecastFee?: number | null
  functionalExpertiseIds?: string[]
  subFunctionalExpertiseIds?: string[]
  skillIds?: string[]
  keywordIds?: string[]
  ownerIds?: string[]
}

async function syncJobRelations(jobId: string, body: JobBody) {
  await syncJoinTable(prisma.jobFunctionalExpertise, 'jobId', jobId, 'functionalExpertiseId', body.functionalExpertiseIds)
  await syncJoinTable(prisma.jobSubFunctionalExpertise, 'jobId', jobId, 'subFunctionalExpertiseId', body.subFunctionalExpertiseIds)
  await syncJoinTable(prisma.jobSkill, 'jobId', jobId, 'skillId', body.skillIds)
  await syncJoinTable(prisma.jobKeyword, 'jobId', jobId, 'keywordId', body.keywordIds)
  await syncJoinTable(prisma.jobOwner, 'jobId', jobId, 'userId', body.ownerIds)
}

export async function listJobs(page?: string, pageSize?: string, search?: string) {
  return withLookupMaps(async (maps) => {
    const jobs = await prisma.job.findMany({
      include: jobInclude,
      orderBy: { createdAt: 'desc' },
    })
    const mapped = jobs.map((j) => mapJob(j, maps))
    const filtered = searchFilter(mapped, search, [
      'jobTitle', 'companyName', 'contactName', 'country', 'state', 'jobCategory', 'jobType',
    ])
    return paginate(filtered, page, pageSize)
  })
}

export async function getJobStats() {
  const [total, permanent, contract, jobLeads] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { jobType: 'PERMANENT' } }),
    prisma.job.count({ where: { jobType: 'CONTRACT' } }),
    prisma.job.count({ where: { jobCategory: 'JOB_LEAD' } }),
  ])
  return { total, permanent, contract, jobLeads }
}

export async function getJobById(id: string) {
  return withLookupMaps(async (maps) => {
    const job = await prisma.job.findUnique({ where: { id }, include: jobInclude })
    if (!job) return null
    return mapJob(job, maps)
  })
}

export async function createJob(body: JobBody) {
  if (!body.jobTitle) throw new Error('jobTitle is required')
  if (!body.companyId) throw new Error('companyId is required')

  const job = await prisma.job.create({
    data: {
      jobTitle: body.jobTitle,
      jobCategory: body.jobCategory ?? null,
      jobType: body.jobType ?? null,
      permanentSubType: body.permanentSubType ?? null,
      headCount: body.headCount ?? null,
      companyId: body.companyId,
      contactId: body.contactId ?? null,
      country: body.country ?? null,
      state: body.state ?? null,
      jobAddressId: body.jobAddressId ?? null,
      salaryType: body.salaryType ?? null,
      monthsPerYear: body.monthsPerYear ?? null,
      annualSalary: body.annualSalary ?? null,
      salaryFrom: body.salaryFrom ?? null,
      salaryTo: body.salaryTo ?? null,
      currency: body.currency ?? null,
      forecastBy: body.forecastBy ?? null,
      percentOfAnnualSalary: body.percentOfAnnualSalary ?? null,
      forecastFee: body.forecastFee ?? null,
    },
  })

  await syncJobRelations(job.id, body)
  return getJobById(job.id)
}

export async function updateJob(id: string, rawBody: Record<string, unknown>) {
  const body = stripReadOnly(rawBody, [...READ_ONLY]) as JobBody
  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) return null

  await prisma.job.update({
    where: { id },
    data: {
      jobTitle: body.jobTitle,
      jobCategory: body.jobCategory,
      jobType: body.jobType,
      permanentSubType: body.permanentSubType,
      headCount: body.headCount,
      companyId: body.companyId,
      contactId: body.contactId,
      country: body.country,
      state: body.state,
      jobAddressId: body.jobAddressId,
      salaryType: body.salaryType,
      monthsPerYear: body.monthsPerYear,
      annualSalary: body.annualSalary,
      salaryFrom: body.salaryFrom,
      salaryTo: body.salaryTo,
      currency: body.currency,
      forecastBy: body.forecastBy,
      percentOfAnnualSalary: body.percentOfAnnualSalary,
      forecastFee: body.forecastFee,
    },
  })

  await syncJobRelations(id, body)
  return getJobById(id)
}

export async function deleteJob(id: string) {
  const existing = await prisma.job.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.job.delete({ where: { id } })
  return true
}
