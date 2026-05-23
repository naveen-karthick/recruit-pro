import { prisma } from '../lib/prisma.js'
import { stripReadOnly } from '../utils/helpers.js'

export async function getAddressById(id: string) {
  return prisma.address.findUnique({ where: { id } })
}

export async function updateAddress(id: string, rawBody: Record<string, unknown>) {
  const body = stripReadOnly(rawBody, ['id']) as {
    addressLine1?: string
    addressLine2?: string | null
    city?: string | null
    state?: string | null
    country?: string | null
    postalCode?: string | null
    label?: string | null
  }
  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing) return null
  return prisma.address.update({ where: { id }, data: body })
}

export async function deleteAddress(id: string) {
  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing) return false
  await prisma.address.delete({ where: { id } })
  return true
}
