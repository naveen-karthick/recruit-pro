import { prisma } from '../lib/prisma.js'

export async function listIndustries() {
  return prisma.industry.findMany({ orderBy: { name: 'asc' } })
}

export async function listSubIndustries(industryId?: string) {
  return prisma.subIndustry.findMany({
    where: industryId ? { industryId } : undefined,
    orderBy: { name: 'asc' },
  })
}

export async function listFunctionalExpertise() {
  return prisma.functionalExpertise.findMany({ orderBy: { name: 'asc' } })
}

export async function listSubFunctionalExpertise(functionalExpertiseId?: string) {
  return prisma.subFunctionalExpertise.findMany({
    where: functionalExpertiseId ? { functionalExpertiseId } : undefined,
    orderBy: { name: 'asc' },
  })
}

export async function listSkills() {
  return prisma.skill.findMany({ orderBy: { name: 'asc' } })
}

export async function listKeywords() {
  return prisma.keyword.findMany({ orderBy: { name: 'asc' } })
}

export async function listBrands() {
  return prisma.brand.findMany({ orderBy: { name: 'asc' } })
}

export async function listUsers() {
  return prisma.crmUser.findMany({ orderBy: { name: 'asc' } })
}

const OPTION_RESOLVERS: Record<string, (parentId?: string) => Promise<unknown[]>> = {
  industries: () => listIndustries(),
  'sub-industries': (parentId) => listSubIndustries(parentId),
  'functional-expertise': () => listFunctionalExpertise(),
  'sub-functional-expertise': (parentId) => listSubFunctionalExpertise(parentId),
  skills: () => listSkills(),
  keywords: () => listKeywords(),
  brands: () => listBrands(),
  users: () => listUsers(),
}

export function resolveOptions(type: string, parentId?: string) {
  const resolver = OPTION_RESOLVERS[type]
  if (!resolver) return null
  return resolver(parentId)
}
