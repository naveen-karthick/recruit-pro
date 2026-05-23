import { prisma } from '../lib/prisma.js'

export async function syncJoinTable(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any,
  parentKey: string,
  parentId: string,
  childKey: string,
  childIds: string[] | undefined,
) {
  if (childIds === undefined) return
  await model.deleteMany({ where: { [parentKey]: parentId } })
  if (childIds.length === 0) return
  await model.createMany({
    data: childIds.map((id) => ({ [parentKey]: parentId, [childKey]: id })),
    skipDuplicates: true,
  })
}

export async function getLookupMaps() {
  const [industries, subIndustries, functionalExpertise, subFunctionalExpertise, skills, keywords, brands, users] =
    await Promise.all([
      prisma.industry.findMany(),
      prisma.subIndustry.findMany(),
      prisma.functionalExpertise.findMany(),
      prisma.subFunctionalExpertise.findMany(),
      prisma.skill.findMany(),
      prisma.keyword.findMany(),
      prisma.brand.findMany(),
      prisma.crmUser.findMany(),
    ])

  return {
    industryMap: new Map(industries.map((i) => [i.id, i.name])),
    subIndustryMap: new Map(subIndustries.map((i) => [i.id, i.name])),
    functionalExpertiseMap: new Map(functionalExpertise.map((i) => [i.id, i.name])),
    subFunctionalExpertiseMap: new Map(subFunctionalExpertise.map((i) => [i.id, i.name])),
    skillMap: new Map(skills.map((i) => [i.id, i.name])),
    keywordMap: new Map(keywords.map((i) => [i.id, i.name])),
    brandMap: new Map(brands.map((i) => [i.id, i.name])),
    userMap: new Map(users.map((i) => [i.id, i.name])),
  }
}

export function resolveNames(ids: string[], map: Map<string, string>): string[] {
  if (!ids.length) return []
  return ids.map((id) => map.get(id)).filter((n): n is string => Boolean(n))
}
