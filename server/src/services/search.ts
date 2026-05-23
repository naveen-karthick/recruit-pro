import { prisma } from '../lib/prisma.js'
import { withLookupMaps, mapCompany, mapJob } from './mappers.js'

export async function quickSearch(q: string) {
  const query = q.trim().toLowerCase()
  const limit = 10

  if (!query) {
    return {
      query,
      counts: { candidates: 0, contacts: 0, companies: 0, jobs: 0 },
      results: { candidates: [], contacts: [], companies: [], jobs: [] },
    }
  }

  const [candidates, contacts, companies, jobs] = await Promise.all([
    prisma.candidate.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { primaryEmail: { contains: query, mode: 'insensitive' } },
          { currentCompany: { contains: query, mode: 'insensitive' } },
          { currentJobTitle: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: limit,
    }),
    prisma.contact.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { primaryEmail: { contains: query, mode: 'insensitive' } },
          { jobTitle: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { company: { select: { companyName: true } } },
      take: limit,
    }),
    prisma.company.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { website: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        addresses: true,
        industries: true,
        subIndustries: true,
        brands: true,
        owners: true,
        parentCompany: { select: { companyName: true } },
      },
      take: limit,
    }),
    prisma.job.findMany({
      where: {
        OR: [
          { jobTitle: { contains: query, mode: 'insensitive' } },
          { country: { contains: query, mode: 'insensitive' } },
          { state: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        company: { select: { companyName: true } },
        contact: { select: { firstName: true, lastName: true } },
        jobAddress: true,
        functionalExpertise: true,
        subFunctionalExpertise: true,
        skills: true,
        keywords: true,
        owners: true,
      },
      take: limit,
    }),
  ])

  return withLookupMaps(async (maps) => {
    const candidateResults = candidates.map((c) => ({
      entity: 'candidates' as const,
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      subtitle: c.currentJobTitle ?? '',
      email: c.primaryEmail ?? '',
      phone: c.primaryPhone ?? '',
    }))

    const contactResults = contacts.map((c) => ({
      entity: 'contacts' as const,
      id: c.id,
      name: `${c.firstName} ${c.lastName}`,
      subtitle: `${c.jobTitle ?? ''} — ${c.company?.companyName ?? ''}`,
      email: c.primaryEmail ?? '',
      phone: c.primaryPhone ?? '',
    }))

    const companyResults = companies.map((c) => {
      const enriched = mapCompany(c, maps)
      return {
        entity: 'companies' as const,
        id: c.id,
        name: c.companyName,
        subtitle: enriched.industryNames.join(', '),
        email: c.website ?? '',
        phone: '',
      }
    })

    const jobResults = jobs.map((j) => {
      const enriched = mapJob(j, maps)
      return {
        entity: 'jobs' as const,
        id: j.id,
        name: j.jobTitle,
        subtitle: `${enriched.companyName ?? ''} · ${j.state ?? j.country ?? ''}`,
        email: '',
        phone: '',
      }
    })

    const [candidateCount, contactCount, companyCount, jobCount] = await Promise.all([
      prisma.candidate.count({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.contact.count({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
      prisma.company.count({ where: { companyName: { contains: query, mode: 'insensitive' } } }),
      prisma.job.count({ where: { jobTitle: { contains: query, mode: 'insensitive' } } }),
    ])

    return {
      query,
      counts: {
        candidates: candidateCount,
        contacts: contactCount,
        companies: companyCount,
        jobs: jobCount,
      },
      results: {
        candidates: candidateResults,
        contacts: contactResults,
        companies: companyResults,
        jobs: jobResults,
      },
    }
  })
}
