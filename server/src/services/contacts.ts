import { prisma } from '../lib/prisma.js'
import { syncJoinTable } from './lookup.js'
import { contactInclude, mapContact, withLookupMaps } from './mappers.js'
import { paginate, searchFilter, stripReadOnly } from '../utils/helpers.js'

const READ_ONLY = [
  'id', 'companyName', 'industryNames', 'subIndustryNames', 'functionalExpertiseNames',
  'subFunctionalExpertiseNames', 'workAddressDisplay', 'createdAt', 'updatedAt',
] as const

type ContactBody = {
  companyId?: string
  firstName?: string
  lastName?: string
  preferredName?: string | null
  jobTitle?: string | null
  primaryEmail?: string | null
  primaryPhone?: string | null
  linkedinProfile?: string | null
  industryIds?: string[]
  subIndustryIds?: string[]
  functionalExpertiseIds?: string[]
  subFunctionalExpertiseIds?: string[]
  ownerIds?: string[]
  workAddressId?: string | null
}

async function syncContactRelations(contactId: string, body: ContactBody) {
  await syncJoinTable(prisma.contactIndustry, 'contactId', contactId, 'industryId', body.industryIds)
  await syncJoinTable(prisma.contactSubIndustry, 'contactId', contactId, 'subIndustryId', body.subIndustryIds)
  await syncJoinTable(prisma.contactFunctionalExpertise, 'contactId', contactId, 'functionalExpertiseId', body.functionalExpertiseIds)
  await syncJoinTable(prisma.contactSubFunctionalExpertise, 'contactId', contactId, 'subFunctionalExpertiseId', body.subFunctionalExpertiseIds)
  await syncJoinTable(prisma.contactOwner, 'contactId', contactId, 'userId', body.ownerIds)
}

export async function listContacts(page?: string, pageSize?: string, search?: string) {
  return withLookupMaps(async (maps) => {
    const contacts = await prisma.contact.findMany({
      include: contactInclude,
      orderBy: { createdAt: 'desc' },
    })
    const mapped = contacts.map((c) => mapContact(c, maps))
    const filtered = searchFilter(mapped, search, [
      'firstName', 'lastName', 'preferredName', 'companyName', 'jobTitle', 'primaryEmail', 'primaryPhone',
    ])
    return paginate(filtered, page, pageSize)
  })
}

export async function listContactsByCompany(companyId: string) {
  return withLookupMaps(async (maps) => {
    const contacts = await prisma.contact.findMany({
      where: { companyId },
      include: contactInclude,
      orderBy: { createdAt: 'desc' },
    })
    return contacts.map((c) => mapContact(c, maps))
  })
}

export async function getContactStats() {
  const [total, withEmail, withPhone, withLinkedIn] = await Promise.all([
    prisma.contact.count(),
    prisma.contact.count({ where: { primaryEmail: { not: null } } }),
    prisma.contact.count({ where: { primaryPhone: { not: null } } }),
    prisma.contact.count({ where: { linkedinProfile: { not: null } } }),
  ])
  return { total, withEmail, withPhone, withLinkedIn }
}

export async function getContactById(id: string) {
  return withLookupMaps(async (maps) => {
    const contact = await prisma.contact.findUnique({ where: { id }, include: contactInclude })
    if (!contact) return null
    return mapContact(contact, maps)
  })
}

export async function createContact(body: ContactBody) {
  if (!body.companyId) throw new Error('companyId is required')
  if (!body.firstName) throw new Error('firstName is required')
  if (!body.lastName) throw new Error('lastName is required')

  const contact = await prisma.contact.create({
    data: {
      companyId: body.companyId,
      firstName: body.firstName,
      lastName: body.lastName,
      preferredName: body.preferredName ?? null,
      jobTitle: body.jobTitle ?? null,
      primaryEmail: body.primaryEmail ?? null,
      primaryPhone: body.primaryPhone ?? null,
      linkedinProfile: body.linkedinProfile ?? null,
      workAddressId: body.workAddressId ?? null,
    },
  })

  await syncContactRelations(contact.id, body)
  return getContactById(contact.id)
}

export async function updateContact(id: string, rawBody: Record<string, unknown>) {
  const body = stripReadOnly(rawBody, [...READ_ONLY]) as ContactBody
  const existing = await prisma.contact.findUnique({ where: { id } })
  if (!existing) return null

  await prisma.contact.update({
    where: { id },
    data: {
      companyId: body.companyId,
      firstName: body.firstName,
      lastName: body.lastName,
      preferredName: body.preferredName,
      jobTitle: body.jobTitle,
      primaryEmail: body.primaryEmail,
      primaryPhone: body.primaryPhone,
      linkedinProfile: body.linkedinProfile,
      workAddressId: body.workAddressId,
    },
  })

  await syncContactRelations(id, body)
  return getContactById(id)
}

export async function deleteContact(id: string) {
  const existing = await prisma.contact.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.contact.delete({ where: { id } })
  return true
}
