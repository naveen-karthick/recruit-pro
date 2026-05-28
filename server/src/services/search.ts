import { prisma } from '../lib/prisma.js'
import { buildPrefixTsQuery } from '../utils/search-query.js'

const LIMIT = 10

type CandidateRow = {
  id: string
  firstName: string
  lastName: string
  currentJobTitle: string | null
  primaryEmail: string | null
  primaryPhone: string | null
}

type ContactRow = {
  id: string
  firstName: string
  lastName: string
  jobTitle: string | null
  primaryEmail: string | null
  primaryPhone: string | null
  companyName: string | null
}

type CompanyRow = {
  id: string
  companyName: string
  website: string | null
  industryNames: string | null
}

type JobRow = {
  id: string
  jobTitle: string
  state: string | null
  country: string | null
  companyName: string | null
}

type CountRow = { count: number }

export async function quickSearch(q: string) {
  const query = q.trim()
  const normalizedQuery = query.toLowerCase()
  const tsQuery = buildPrefixTsQuery(query)

  if (!query || !tsQuery) {
    return {
      query: normalizedQuery,
      counts: { candidates: 0, contacts: 0, companies: 0, jobs: 0 },
      results: { candidates: [], contacts: [], companies: [], jobs: [] },
    }
  }

  const [
    candidates,
    contacts,
    companies,
    jobs,
    candidateCount,
    contactCount,
    companyCount,
    jobCount,
  ] = await Promise.all([
    prisma.$queryRaw<CandidateRow[]>`
      SELECT
        id,
        "firstName",
        "lastName",
        "currentJobTitle",
        "primaryEmail",
        "primaryPhone"
      FROM candidates
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
      ORDER BY ts_rank(search_vector, to_tsquery('simple', ${tsQuery})) DESC
      LIMIT ${LIMIT}
    `,
    prisma.$queryRaw<ContactRow[]>`
      SELECT
        ct.id,
        ct."firstName",
        ct."lastName",
        ct."jobTitle",
        ct."primaryEmail",
        ct."primaryPhone",
        co."companyName"
      FROM contacts ct
      LEFT JOIN companies co ON co.id = ct."companyId"
      WHERE ct.search_vector @@ to_tsquery('simple', ${tsQuery})
      ORDER BY ts_rank(ct.search_vector, to_tsquery('simple', ${tsQuery})) DESC
      LIMIT ${LIMIT}
    `,
    prisma.$queryRaw<CompanyRow[]>`
      SELECT
        c.id,
        c."companyName",
        c.website,
        (
          SELECT string_agg(i.name, ', ' ORDER BY i.name)
          FROM company_industries ci
          JOIN industries i ON i.id = ci."industryId"
          WHERE ci."companyId" = c.id
        ) AS "industryNames"
      FROM companies c
      WHERE c.search_vector @@ to_tsquery('simple', ${tsQuery})
      ORDER BY ts_rank(c.search_vector, to_tsquery('simple', ${tsQuery})) DESC
      LIMIT ${LIMIT}
    `,
    prisma.$queryRaw<JobRow[]>`
      SELECT
        j.id,
        j."jobTitle",
        j.state,
        j.country,
        co."companyName"
      FROM jobs j
      LEFT JOIN companies co ON co.id = j."companyId"
      WHERE j.search_vector @@ to_tsquery('simple', ${tsQuery})
      ORDER BY ts_rank(j.search_vector, to_tsquery('simple', ${tsQuery})) DESC
      LIMIT ${LIMIT}
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int AS count
      FROM candidates
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int AS count
      FROM contacts
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int AS count
      FROM companies
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*)::int AS count
      FROM jobs
      WHERE search_vector @@ to_tsquery('simple', ${tsQuery})
    `,
  ])

  return {
    query: normalizedQuery,
    counts: {
      candidates: candidateCount[0]?.count ?? 0,
      contacts: contactCount[0]?.count ?? 0,
      companies: companyCount[0]?.count ?? 0,
      jobs: jobCount[0]?.count ?? 0,
    },
    results: {
      candidates: candidates.map((c) => ({
        entity: 'candidates' as const,
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        subtitle: c.currentJobTitle ?? '',
        email: c.primaryEmail ?? '',
        phone: c.primaryPhone ?? '',
      })),
      contacts: contacts.map((c) => ({
        entity: 'contacts' as const,
        id: c.id,
        name: `${c.firstName} ${c.lastName}`,
        subtitle: `${c.jobTitle ?? ''} — ${c.companyName ?? ''}`,
        email: c.primaryEmail ?? '',
        phone: c.primaryPhone ?? '',
      })),
      companies: companies.map((c) => ({
        entity: 'companies' as const,
        id: c.id,
        name: c.companyName,
        subtitle: c.industryNames ?? '',
        email: c.website ?? '',
        phone: '',
      })),
      jobs: jobs.map((j) => ({
        entity: 'jobs' as const,
        id: j.id,
        name: j.jobTitle,
        subtitle: `${j.companyName ?? ''} · ${j.state ?? j.country ?? ''}`,
        email: '',
        phone: '',
      })),
    },
  }
}
