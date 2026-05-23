// EIREC CRM — API-aligned entity types

export type JobCategory = 'JOB' | 'JOB_LEAD'
export type JobType =
  | 'PERMANENT'
  | 'INTERIM_PROJECT_CONSULTING'
  | 'TEMPORARY'
  | 'CONTRACT'
  | 'TEMP_TO_PERM'
export type PermanentSubType = 'CONTINGENT' | 'RETAINED' | 'EXCLUSIVE'
export type SalaryType = 'MONTHLY' | 'ANNUAL'
export type ForecastBy =
  | 'MANUAL'
  | 'HEADCOUNT'
  | 'ACTIVE_APPLICATIONS_MANUAL'
  | 'ACTIVE_APPLICATIONS_AUTO'

export interface Address {
  id?: string
  addressLine1: string
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
  label?: string | null
}

export interface MasterItem {
  id: string
  name: string
}

export interface SubIndustry extends MasterItem {
  industryId: string
}

export interface SubFunctionalExpertise extends MasterItem {
  functionalExpertiseId: string
}

export interface User extends MasterItem {}

export interface Company {
  id: string
  companyName: string
  addresses: Address[]
  industryIds: string[]
  industryNames: string[]
  subIndustryIds: string[]
  subIndustryNames: string[]
  website?: string | null
  linkedinUrl?: string | null
  parentCompanyId?: string | null
  parentCompanyName?: string | null
  brandIds: string[]
  brandNames: string[]
  ownerIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  companyId: string
  companyName?: string | null
  firstName: string
  lastName: string
  preferredName?: string | null
  jobTitle?: string | null
  primaryEmail?: string | null
  primaryPhone?: string | null
  linkedinProfile?: string | null
  industryIds: string[]
  industryNames: string[]
  subIndustryIds: string[]
  subIndustryNames: string[]
  functionalExpertiseIds: string[]
  functionalExpertiseNames: string[]
  subFunctionalExpertiseIds: string[]
  subFunctionalExpertiseNames: string[]
  ownerIds: string[]
  workAddressId?: string | null
  workAddressDisplay?: string | null
  createdAt: string
  updatedAt: string
}

export interface Job {
  id: string
  jobTitle: string
  jobCategory?: JobCategory | null
  jobType?: JobType | null
  permanentSubType?: PermanentSubType | null
  headCount?: number | null
  companyId: string
  companyName?: string | null
  contactId?: string | null
  contactName?: string | null
  country?: string | null
  state?: string | null
  jobAddressId?: string | null
  jobAddressDisplay?: string | null
  salaryType?: SalaryType | null
  monthsPerYear?: number | null
  annualSalary?: number | null
  salaryFrom?: number | null
  salaryTo?: number | null
  currency?: string | null
  forecastBy?: ForecastBy | null
  percentOfAnnualSalary?: number | null
  forecastFee?: number | null
  functionalExpertiseIds: string[]
  functionalExpertiseNames: string[]
  subFunctionalExpertiseIds: string[]
  subFunctionalExpertiseNames: string[]
  skillIds: string[]
  skillNames: string[]
  keywordIds: string[]
  keywordNames: string[]
  ownerIds: string[]
  createdAt: string
  updatedAt: string
}

export interface Candidate {
  id: string
  firstName: string
  lastName: string
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
  skillIds: string[]
  skillNames: string[]
  functionalExpertiseIds: string[]
  functionalExpertiseNames: string[]
  subFunctionalExpertiseIds: string[]
  subFunctionalExpertiseNames: string[]
  keywordIds: string[]
  keywordNames: string[]
  industryIds: string[]
  industryNames: string[]
  subIndustryIds: string[]
  subIndustryNames: string[]
  ownerId?: string | null
  createdAt: string
  updatedAt: string
}

// Write DTOs — omit read-only fields
export type CreateCompanyInput = Omit<
  Company,
  'id' | 'industryNames' | 'subIndustryNames' | 'brandNames' | 'parentCompanyName' | 'createdAt' | 'updatedAt'
>
export type UpdateCompanyInput = Partial<CreateCompanyInput>

export type CreateContactInput = Omit<
  Contact,
  | 'id'
  | 'companyName'
  | 'industryNames'
  | 'subIndustryNames'
  | 'functionalExpertiseNames'
  | 'subFunctionalExpertiseNames'
  | 'workAddressDisplay'
  | 'createdAt'
  | 'updatedAt'
>
export type UpdateContactInput = Partial<CreateContactInput>

export type CreateJobInput = Omit<
  Job,
  | 'id'
  | 'companyName'
  | 'contactName'
  | 'jobAddressDisplay'
  | 'functionalExpertiseNames'
  | 'subFunctionalExpertiseNames'
  | 'skillNames'
  | 'keywordNames'
  | 'createdAt'
  | 'updatedAt'
>
export type UpdateJobInput = Partial<CreateJobInput>

export type CreateCandidateInput = Omit<
  Candidate,
  | 'id'
  | 'skillNames'
  | 'functionalExpertiseNames'
  | 'subFunctionalExpertiseNames'
  | 'keywordNames'
  | 'industryNames'
  | 'subIndustryNames'
  | 'createdAt'
  | 'updatedAt'
>
export type UpdateCandidateInput = Partial<CreateCandidateInput>

export type CreateAddressInput = Omit<Address, 'id'>
export type UpdateAddressInput = Partial<CreateAddressInput>

// Display helpers
export function contactFullName(c: Pick<Contact, 'firstName' | 'lastName' | 'preferredName'>) {
  const base = `${c.firstName} ${c.lastName}`.trim()
  return c.preferredName ? `${base} (${c.preferredName})` : base
}

export function candidateFullName(c: Pick<Candidate, 'firstName' | 'lastName'>) {
  return `${c.firstName} ${c.lastName}`.trim()
}

export function formatNames(names: string[] | undefined | null) {
  return names?.length ? names.join(', ') : '—'
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}
