import { prisma } from '../lib/prisma.js'
import { syncJoinTable } from './lookup.js'
import {
  companyInclude,
  mapCompany,
  withLookupMaps,
} from './mappers.js'
import { paginate, searchFilter, stripReadOnly } from '../utils/helpers.js'

const READ_ONLY = [
  'id', 'industryNames', 'subIndustryNames', 'brandNames', 'parentCompanyName', 'createdAt', 'updatedAt',
] as const

type AddressInput = {
  id?: string
  addressLine1: string
  addressLine2?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  postalCode?: string | null
  label?: string | null
}

type CompanyBody = {
  companyName?: string
  website?: string | null
  linkedinUrl?: string | null
  parentCompanyId?: string | null
  industryIds?: string[]
  subIndustryIds?: string[]
  brandIds?: string[]
  ownerIds?: string[]
  addresses?: AddressInput[]
}

async function upsertAddresses(companyId: string, addresses: AddressInput[]) {
  const results = []
  for (const addr of addresses) {
    const data = {
      companyId,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 ?? null,
      city: addr.city ?? null,
      state: addr.state ?? null,
      country: addr.country ?? null,
      postalCode: addr.postalCode ?? null,
      label: addr.label ?? null,
    }
    if (addr.id) {
      const updated = await prisma.address.upsert({
        where: { id: addr.id },
        create: { id: addr.id, ...data },
        update: data,
      })
      results.push(updated)
    } else {
      const created = await prisma.address.create({ data })
      results.push(created)
    }
  }
  return results
}

async function syncCompanyRelations(companyId: string, body: CompanyBody) {
  await syncJoinTable(prisma.companyIndustry, 'companyId', companyId, 'industryId', body.industryIds)
  await syncJoinTable(prisma.companySubIndustry, 'companyId', companyId, 'subIndustryId', body.subIndustryIds)
  await syncJoinTable(prisma.companyBrand, 'companyId', companyId, 'brandId', body.brandIds)
  await syncJoinTable(prisma.companyOwner, 'companyId', companyId, 'userId', body.ownerIds)
}

export async function listCompanies(page?: string, pageSize?: string, search?: string) {
  return withLookupMaps(async (maps) => {
    const companies = await prisma.company.findMany({
      include: companyInclude,
      orderBy: { createdAt: 'desc' },
    })
    const mapped = companies.map((c) => mapCompany(c, maps))
    const filtered = searchFilter(mapped, search, [
      'companyName', 'website', 'linkedinUrl', 'industryNames', 'subIndustryNames', 'brandNames', 'parentCompanyName',
    ])
    return paginate(filtered, page, pageSize)
  })
}

export async function getCompanyStats() {
  const [total, withWebsite, withParent, totalAddresses] = await Promise.all([
    prisma.company.count(),
    prisma.company.count({ where: { website: { not: null } } }),
    prisma.company.count({ where: { parentCompanyId: { not: null } } }),
    prisma.address.count(),
  ])
  return { total, withWebsite, withParent, totalAddresses }
}

export async function getCompanyById(id: string) {
  return withLookupMaps(async (maps) => {
    const company = await prisma.company.findUnique({ where: { id }, include: companyInclude })
    if (!company) return null
    return mapCompany(company, maps)
  })
}

export async function createCompany(body: CompanyBody) {
  if (!body.companyName) throw new Error('companyName is required')
  if (!body.addresses?.length) throw new Error('At least one address is required')

  const company = await prisma.company.create({
    data: {
      companyName: body.companyName,
      website: body.website ?? null,
      linkedinUrl: body.linkedinUrl ?? null,
      parentCompanyId: body.parentCompanyId ?? null,
    },
  })

  await upsertAddresses(company.id, body.addresses)
  await syncCompanyRelations(company.id, body)

  return getCompanyById(company.id)
}

export async function updateCompany(id: string, rawBody: Record<string, unknown>) {
  const body = stripReadOnly(rawBody, [...READ_ONLY]) as CompanyBody
  const existing = await prisma.company.findUnique({ where: { id } })
  if (!existing) return null

  await prisma.company.update({
    where: { id },
    data: {
      companyName: body.companyName,
      website: body.website,
      linkedinUrl: body.linkedinUrl,
      parentCompanyId: body.parentCompanyId,
    },
  })

  if (body.addresses) await upsertAddresses(id, body.addresses)
  await syncCompanyRelations(id, body)

  return getCompanyById(id)
}

export async function deleteCompany(id: string) {
  const existing = await prisma.company.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.company.delete({ where: { id } })
  return true
}

export async function getCompanyContacts(companyId: string) {
  const { listContactsByCompany } = await import('./contacts.js')
  return listContactsByCompany(companyId)
}

export async function getCompanyAddresses(companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId }, include: { addresses: true } })
  if (!company) return null
  return company.addresses
}

export async function createCompanyAddress(companyId: string, body: AddressInput) {
  const company = await prisma.company.findUnique({ where: { id: companyId } })
  if (!company) return null
  if (!body.addressLine1) throw new Error('addressLine1 is required')

  const addr = await prisma.address.create({
    data: {
      companyId,
      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2 ?? null,
      city: body.city ?? null,
      state: body.state ?? null,
      country: body.country ?? null,
      postalCode: body.postalCode ?? null,
      label: body.label ?? null,
    },
  })

  await prisma.company.update({ where: { id: companyId }, data: { updatedAt: new Date() } })
  return addr
}

export async function getCompanyAddressOptions(companyId: string) {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: { addresses: true },
  })
  if (!company) return null
  return company.addresses.map((a) => ({
    id: a.id,
    name: [a.label, a.addressLine1, a.city].filter(Boolean).join(' — '),
  }))
}

export async function listCompanyOptions() {
  const companies = await prisma.company.findMany({
    select: { id: true, companyName: true },
    orderBy: { companyName: 'asc' },
  })
  return companies.map((c) => ({ id: c.id, name: c.companyName }))
}
