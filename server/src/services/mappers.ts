import type {
  Address,
  Company,
  Contact,
  Job,
  Candidate,
  Prisma,
} from '@prisma/client'
import { formatAddress, toIso } from '../utils/helpers.js'
import { getLookupMaps, resolveNames } from './lookup.js'

type CompanyWithRelations = Company & {
  addresses: Address[]
  industries: { industryId: string }[]
  subIndustries: { subIndustryId: string }[]
  brands: { brandId: string }[]
  owners: { userId: string }[]
  parentCompany?: { companyName: string } | null
}

type ContactWithRelations = Contact & {
  company?: { companyName: string } | null
  workAddress?: Address | null
  industries: { industryId: string }[]
  subIndustries: { subIndustryId: string }[]
  functionalExpertise: { functionalExpertiseId: string }[]
  subFunctionalExpertise: { subFunctionalExpertiseId: string }[]
  owners: { userId: string }[]
}

type JobWithRelations = Job & {
  company?: { companyName: string } | null
  contact?: { firstName: string; lastName: string } | null
  jobAddress?: Address | null
  functionalExpertise: { functionalExpertiseId: string }[]
  subFunctionalExpertise: { subFunctionalExpertiseId: string }[]
  skills: { skillId: string }[]
  keywords: { keywordId: string }[]
  owners: { userId: string }[]
}

type CandidateWithRelations = Candidate & {
  skills: { skillId: string }[]
  functionalExpertise: { functionalExpertiseId: string }[]
  subFunctionalExpertise: { subFunctionalExpertiseId: string }[]
  keywords: { keywordId: string }[]
  industries: { industryId: string }[]
  subIndustries: { subIndustryId: string }[]
}

type LookupMaps = Awaited<ReturnType<typeof getLookupMaps>>

export function mapAddress(addr: Address) {
  return {
    id: addr.id,
    addressLine1: addr.addressLine1,
    addressLine2: addr.addressLine2,
    city: addr.city,
    state: addr.state,
    country: addr.country,
    postalCode: addr.postalCode,
    label: addr.label,
  }
}

export function mapCompany(company: CompanyWithRelations, maps: LookupMaps) {
  const industryIds = company.industries.map((i) => i.industryId)
  const subIndustryIds = company.subIndustries.map((i) => i.subIndustryId)
  const brandIds = company.brands.map((i) => i.brandId)
  const ownerIds = company.owners.map((i) => i.userId)

  return {
    id: company.id,
    companyName: company.companyName,
    addresses: company.addresses.map(mapAddress),
    industryIds,
    industryNames: resolveNames(industryIds, maps.industryMap),
    subIndustryIds,
    subIndustryNames: resolveNames(subIndustryIds, maps.subIndustryMap),
    website: company.website,
    linkedinUrl: company.linkedinUrl,
    parentCompanyId: company.parentCompanyId,
    parentCompanyName: company.parentCompany?.companyName ?? null,
    brandIds,
    brandNames: resolveNames(brandIds, maps.brandMap),
    ownerIds,
    createdAt: toIso(company.createdAt),
    updatedAt: toIso(company.updatedAt),
  }
}

export function mapContact(contact: ContactWithRelations, maps: LookupMaps) {
  const industryIds = contact.industries.map((i) => i.industryId)
  const subIndustryIds = contact.subIndustries.map((i) => i.subIndustryId)
  const functionalExpertiseIds = contact.functionalExpertise.map((i) => i.functionalExpertiseId)
  const subFunctionalExpertiseIds = contact.subFunctionalExpertise.map((i) => i.subFunctionalExpertiseId)
  const ownerIds = contact.owners.map((i) => i.userId)

  return {
    id: contact.id,
    companyId: contact.companyId,
    companyName: contact.company?.companyName ?? null,
    firstName: contact.firstName,
    lastName: contact.lastName,
    preferredName: contact.preferredName,
    jobTitle: contact.jobTitle,
    primaryEmail: contact.primaryEmail,
    primaryPhone: contact.primaryPhone,
    linkedinProfile: contact.linkedinProfile,
    industryIds,
    industryNames: resolveNames(industryIds, maps.industryMap),
    subIndustryIds,
    subIndustryNames: resolveNames(subIndustryIds, maps.subIndustryMap),
    functionalExpertiseIds,
    functionalExpertiseNames: resolveNames(functionalExpertiseIds, maps.functionalExpertiseMap),
    subFunctionalExpertiseIds,
    subFunctionalExpertiseNames: resolveNames(subFunctionalExpertiseIds, maps.subFunctionalExpertiseMap),
    ownerIds,
    workAddressId: contact.workAddressId,
    workAddressDisplay: contact.workAddress ? formatAddress(contact.workAddress) : null,
    createdAt: toIso(contact.createdAt),
    updatedAt: toIso(contact.updatedAt),
  }
}

export function mapJob(job: JobWithRelations, maps: LookupMaps) {
  const functionalExpertiseIds = job.functionalExpertise.map((i) => i.functionalExpertiseId)
  const subFunctionalExpertiseIds = job.subFunctionalExpertise.map((i) => i.subFunctionalExpertiseId)
  const skillIds = job.skills.map((i) => i.skillId)
  const keywordIds = job.keywords.map((i) => i.keywordId)
  const ownerIds = job.owners.map((i) => i.userId)

  return {
    id: job.id,
    jobTitle: job.jobTitle,
    jobCategory: job.jobCategory,
    jobType: job.jobType,
    permanentSubType: job.permanentSubType,
    headCount: job.headCount,
    companyId: job.companyId,
    companyName: job.company?.companyName ?? null,
    contactId: job.contactId,
    contactName: job.contact ? `${job.contact.firstName} ${job.contact.lastName}` : null,
    country: job.country,
    state: job.state,
    jobAddressId: job.jobAddressId,
    jobAddressDisplay: job.jobAddress ? formatAddress(job.jobAddress) : null,
    salaryType: job.salaryType,
    monthsPerYear: job.monthsPerYear,
    annualSalary: job.annualSalary,
    salaryFrom: job.salaryFrom,
    salaryTo: job.salaryTo,
    currency: job.currency,
    forecastBy: job.forecastBy,
    percentOfAnnualSalary: job.percentOfAnnualSalary,
    forecastFee: job.forecastFee,
    functionalExpertiseIds,
    functionalExpertiseNames: resolveNames(functionalExpertiseIds, maps.functionalExpertiseMap),
    subFunctionalExpertiseIds,
    subFunctionalExpertiseNames: resolveNames(subFunctionalExpertiseIds, maps.subFunctionalExpertiseMap),
    skillIds,
    skillNames: resolveNames(skillIds, maps.skillMap),
    keywordIds,
    keywordNames: resolveNames(keywordIds, maps.keywordMap),
    ownerIds,
    createdAt: toIso(job.createdAt),
    updatedAt: toIso(job.updatedAt),
  }
}

export function mapCandidate(candidate: CandidateWithRelations, maps: LookupMaps) {
  const skillIds = candidate.skills.map((i) => i.skillId)
  const functionalExpertiseIds = candidate.functionalExpertise.map((i) => i.functionalExpertiseId)
  const subFunctionalExpertiseIds = candidate.subFunctionalExpertise.map((i) => i.subFunctionalExpertiseId)
  const keywordIds = candidate.keywords.map((i) => i.keywordId)
  const industryIds = candidate.industries.map((i) => i.industryId)
  const subIndustryIds = candidate.subIndustries.map((i) => i.subIndustryId)

  return {
    id: candidate.id,
    firstName: candidate.firstName,
    lastName: candidate.lastName,
    gender: candidate.gender,
    dateOfBirth: candidate.dateOfBirth,
    primaryEmail: candidate.primaryEmail,
    primaryPhone: candidate.primaryPhone,
    linkedinProfile: candidate.linkedinProfile,
    currentAddress: candidate.currentAddress,
    nationality: candidate.nationality,
    workSummary: candidate.workSummary,
    currentCompany: candidate.currentCompany,
    currentJobTitle: candidate.currentJobTitle,
    totalExperience: candidate.totalExperience,
    expectedSalary: candidate.expectedSalary,
    availabilityDate: candidate.availabilityDate,
    skillIds,
    skillNames: resolveNames(skillIds, maps.skillMap),
    functionalExpertiseIds,
    functionalExpertiseNames: resolveNames(functionalExpertiseIds, maps.functionalExpertiseMap),
    subFunctionalExpertiseIds,
    subFunctionalExpertiseNames: resolveNames(subFunctionalExpertiseIds, maps.subFunctionalExpertiseMap),
    keywordIds,
    keywordNames: resolveNames(keywordIds, maps.keywordMap),
    industryIds,
    industryNames: resolveNames(industryIds, maps.industryMap),
    subIndustryIds,
    subIndustryNames: resolveNames(subIndustryIds, maps.subIndustryMap),
    ownerId: candidate.ownerId,
    createdAt: toIso(candidate.createdAt),
    updatedAt: toIso(candidate.updatedAt),
  }
}

export const companyInclude = {
  addresses: true,
  industries: true,
  subIndustries: true,
  brands: true,
  owners: true,
  parentCompany: { select: { companyName: true } },
} satisfies Prisma.CompanyInclude

export const contactInclude = {
  company: { select: { companyName: true } },
  workAddress: true,
  industries: true,
  subIndustries: true,
  functionalExpertise: true,
  subFunctionalExpertise: true,
  owners: true,
} satisfies Prisma.ContactInclude

export const jobInclude = {
  company: { select: { companyName: true } },
  contact: { select: { firstName: true, lastName: true } },
  jobAddress: true,
  functionalExpertise: true,
  subFunctionalExpertise: true,
  skills: true,
  keywords: true,
  owners: true,
} satisfies Prisma.JobInclude

export const candidateInclude = {
  skills: true,
  functionalExpertise: true,
  subFunctionalExpertise: true,
  keywords: true,
  industries: true,
  subIndustries: true,
} satisfies Prisma.CandidateInclude

export async function withLookupMaps<T>(fn: (maps: LookupMaps) => Promise<T>): Promise<T> {
  const maps = await getLookupMaps()
  return fn(maps)
}
