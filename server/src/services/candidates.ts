import { prisma } from '../lib/prisma.js'
import { syncJoinTable } from './lookup.js'
import { candidateInclude, mapCandidate, withLookupMaps } from './mappers.js'
import { paginate, searchFilter, stripReadOnly } from '../utils/helpers.js'

const READ_ONLY = [
  'id', 'skillNames', 'functionalExpertiseNames', 'subFunctionalExpertiseNames',
  'keywordNames', 'industryNames', 'subIndustryNames', 'createdAt', 'updatedAt',
] as const

type CandidateBody = {
  firstName?: string
  lastName?: string
  gender?: string | null
  dateOfBirth?: string | null
  primaryEmail?: string | null
  primaryPhone?: string | null
  linkedinProfile?: string | null
  currentAddress?: string | null
  nationality?: string | null
  workSummary?: string | null
  currentCompany?: string | null
  currentJobTitle?: string | null
  totalExperience?: number | null
  expectedSalary?: number | null
  availabilityDate?: string | null
  skillIds?: string[]
  functionalExpertiseIds?: string[]
  subFunctionalExpertiseIds?: string[]
  keywordIds?: string[]
  industryIds?: string[]
  subIndustryIds?: string[]
  ownerId?: string | null
}

async function syncCandidateRelations(candidateId: string, body: CandidateBody) {
  await syncJoinTable(prisma.candidateSkill, 'candidateId', candidateId, 'skillId', body.skillIds)
  await syncJoinTable(prisma.candidateFunctionalExpertise, 'candidateId', candidateId, 'functionalExpertiseId', body.functionalExpertiseIds)
  await syncJoinTable(prisma.candidateSubFunctionalExpertise, 'candidateId', candidateId, 'subFunctionalExpertiseId', body.subFunctionalExpertiseIds)
  await syncJoinTable(prisma.candidateKeyword, 'candidateId', candidateId, 'keywordId', body.keywordIds)
  await syncJoinTable(prisma.candidateIndustry, 'candidateId', candidateId, 'industryId', body.industryIds)
  await syncJoinTable(prisma.candidateSubIndustry, 'candidateId', candidateId, 'subIndustryId', body.subIndustryIds)
}

export async function listCandidates(page?: string, pageSize?: string, search?: string) {
  return withLookupMaps(async (maps) => {
    const candidates = await prisma.candidate.findMany({
      include: candidateInclude,
      orderBy: { createdAt: 'desc' },
    })
    const mapped = candidates.map((c) => mapCandidate(c, maps))
    const filtered = searchFilter(mapped, search, [
      'firstName', 'lastName', 'primaryEmail', 'primaryPhone', 'currentCompany', 'currentJobTitle', 'nationality',
    ])
    return paginate(filtered, page, pageSize)
  })
}

export async function getCandidateStats() {
  const candidates = await prisma.candidate.findMany({
    select: { linkedinProfile: true, availabilityDate: true, totalExperience: true },
  })
  const total = candidates.length
  const withLinkedIn = candidates.filter((c) => c.linkedinProfile).length
  const availableSoon = candidates.filter((c) => c.availabilityDate).length
  const avgExperience = total
    ? Math.round((candidates.reduce((s, c) => s + (c.totalExperience ?? 0), 0) / total) * 10) / 10
    : 0
  return { total, withLinkedIn, availableSoon, avgExperience }
}

export async function getCandidateById(id: string) {
  return withLookupMaps(async (maps) => {
    const candidate = await prisma.candidate.findUnique({ where: { id }, include: candidateInclude })
    if (!candidate) return null
    return mapCandidate(candidate, maps)
  })
}

export async function createCandidate(body: CandidateBody) {
  if (!body.firstName) throw new Error('firstName is required')
  if (!body.lastName) throw new Error('lastName is required')

  const candidate = await prisma.candidate.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender ?? null,
      dateOfBirth: body.dateOfBirth ?? null,
      primaryEmail: body.primaryEmail ?? null,
      primaryPhone: body.primaryPhone ?? null,
      linkedinProfile: body.linkedinProfile ?? null,
      currentAddress: body.currentAddress ?? null,
      nationality: body.nationality ?? null,
      workSummary: body.workSummary ?? null,
      currentCompany: body.currentCompany ?? null,
      currentJobTitle: body.currentJobTitle ?? null,
      totalExperience: body.totalExperience ?? null,
      expectedSalary: body.expectedSalary ?? null,
      availabilityDate: body.availabilityDate ?? null,
      ownerId: body.ownerId ?? null,
    },
  })

  await syncCandidateRelations(candidate.id, body)
  return getCandidateById(candidate.id)
}

export async function updateCandidate(id: string, rawBody: Record<string, unknown>) {
  const body = stripReadOnly(rawBody, [...READ_ONLY]) as CandidateBody
  const existing = await prisma.candidate.findUnique({ where: { id } })
  if (!existing) return null

  await prisma.candidate.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      primaryEmail: body.primaryEmail,
      primaryPhone: body.primaryPhone,
      linkedinProfile: body.linkedinProfile,
      currentAddress: body.currentAddress,
      nationality: body.nationality,
      workSummary: body.workSummary,
      currentCompany: body.currentCompany,
      currentJobTitle: body.currentJobTitle,
      totalExperience: body.totalExperience,
      expectedSalary: body.expectedSalary,
      availabilityDate: body.availabilityDate,
      ownerId: body.ownerId,
    },
  })

  await syncCandidateRelations(id, body)
  return getCandidateById(id)
}

export async function deleteCandidate(id: string) {
  const existing = await prisma.candidate.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.candidate.delete({ where: { id } })
  return true
}
