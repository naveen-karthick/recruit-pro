import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { backfillSearchVectors, setupSearchVectors } from './setup-search-vectors.js'

const prisma = new PrismaClient()

function makeAddress(overrides: Record<string, string | null | undefined> = {}) {
  return {
    addressLine1: '100 Market Street',
    addressLine2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postalCode: '94105',
    label: 'HQ',
    ...overrides,
  }
}

async function main() {
  console.log('Seeding database...')

  await setupSearchVectors(prisma)

  const industries = await Promise.all([
    prisma.industry.create({ data: { name: 'Technology' } }),
    prisma.industry.create({ data: { name: 'Healthcare' } }),
    prisma.industry.create({ data: { name: 'Finance' } }),
    prisma.industry.create({ data: { name: 'Manufacturing' } }),
    prisma.industry.create({ data: { name: 'Retail' } }),
  ])

  const subIndustries = await Promise.all([
    prisma.subIndustry.create({ data: { name: 'SaaS', industryId: industries[0].id } }),
    prisma.subIndustry.create({ data: { name: 'FinTech', industryId: industries[0].id } }),
    prisma.subIndustry.create({ data: { name: 'Pharmaceuticals', industryId: industries[1].id } }),
    prisma.subIndustry.create({ data: { name: 'Medical Devices', industryId: industries[1].id } }),
    prisma.subIndustry.create({ data: { name: 'Investment Banking', industryId: industries[2].id } }),
    prisma.subIndustry.create({ data: { name: 'Insurance', industryId: industries[2].id } }),
    prisma.subIndustry.create({ data: { name: 'Automotive', industryId: industries[3].id } }),
    prisma.subIndustry.create({ data: { name: 'E-commerce', industryId: industries[4].id } }),
  ])

  const functionalExpertise = await Promise.all([
    prisma.functionalExpertise.create({ data: { name: 'Engineering' } }),
    prisma.functionalExpertise.create({ data: { name: 'Sales' } }),
    prisma.functionalExpertise.create({ data: { name: 'Marketing' } }),
    prisma.functionalExpertise.create({ data: { name: 'Finance' } }),
    prisma.functionalExpertise.create({ data: { name: 'Operations' } }),
    prisma.functionalExpertise.create({ data: { name: 'Human Resources' } }),
  ])

  const subFunctionalExpertise = await Promise.all([
    prisma.subFunctionalExpertise.create({ data: { name: 'Backend Development', functionalExpertiseId: functionalExpertise[0].id } }),
    prisma.subFunctionalExpertise.create({ data: { name: 'Frontend Development', functionalExpertiseId: functionalExpertise[0].id } }),
    prisma.subFunctionalExpertise.create({ data: { name: 'DevOps', functionalExpertiseId: functionalExpertise[0].id } }),
    prisma.subFunctionalExpertise.create({ data: { name: 'Enterprise Sales', functionalExpertiseId: functionalExpertise[1].id } }),
    prisma.subFunctionalExpertise.create({ data: { name: 'Digital Marketing', functionalExpertiseId: functionalExpertise[2].id } }),
    prisma.subFunctionalExpertise.create({ data: { name: 'Financial Planning', functionalExpertiseId: functionalExpertise[3].id } }),
  ])

  const skills = await Promise.all([
    prisma.skill.create({ data: { name: 'JavaScript' } }),
    prisma.skill.create({ data: { name: 'TypeScript' } }),
    prisma.skill.create({ data: { name: 'React' } }),
    prisma.skill.create({ data: { name: 'Node.js' } }),
    prisma.skill.create({ data: { name: 'Python' } }),
    prisma.skill.create({ data: { name: 'AWS' } }),
    prisma.skill.create({ data: { name: 'SQL' } }),
    prisma.skill.create({ data: { name: 'Project Management' } }),
  ])

  const keywords = await Promise.all([
    prisma.keyword.create({ data: { name: 'Remote' } }),
    prisma.keyword.create({ data: { name: 'Startup' } }),
    prisma.keyword.create({ data: { name: 'Leadership' } }),
    prisma.keyword.create({ data: { name: 'Agile' } }),
    prisma.keyword.create({ data: { name: 'B2B' } }),
  ])

  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Premium Partner' } }),
    prisma.brand.create({ data: { name: 'Strategic Account' } }),
    prisma.brand.create({ data: { name: 'Key Client' } }),
  ])

  const users = await Promise.all([
    prisma.crmUser.create({ data: { name: 'Sarah Chen' } }),
    prisma.crmUser.create({ data: { name: 'James Wilson' } }),
    prisma.crmUser.create({ data: { name: 'Maria Garcia' } }),
  ])

  const companyNames = [
    'Acme Corporation', 'Globex Industries', 'Initech Systems', 'Umbrella Health',
    'Stark Financial', 'Wayne Enterprises', 'Oscorp Labs', 'Cyberdyne Systems',
    'Massive Dynamic', 'Hooli Inc', 'Pied Piper', 'Aviato',
    'Soylent Corp', 'Vehement Capital', 'Prestige Worldwide', 'Dunder Mifflin',
    'Bluth Company', 'Sterling Cooper', 'Wonka Industries', 'Monarch Solutions',
  ]

  const createdCompanies: { id: string; industryIds: string[]; subIndustryIds: string[]; ownerIds: string[]; addressId: string }[] = []

  for (let i = 0; i < companyNames.length; i++) {
    const name = companyNames[i]
    const industry = industries[i % industries.length]
    const subIndustry = subIndustries.find((s) => s.industryId === industry.id) ?? subIndustries[0]
    const owner = users[i % users.length]

    const company = await prisma.company.create({
      data: {
        companyName: name,
        website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.com`,
        linkedinUrl: `https://linkedin.com/company/${name.toLowerCase().replace(/\s+/g, '-')}`,
        parentCompanyId: i > 5 ? createdCompanies[i % 5]?.id : undefined,
        addresses: {
          create: makeAddress({
            addressLine1: `${100 + i} Business Park Drive`,
            city: ['San Francisco', 'New York', 'London', 'Singapore', 'Tokyo'][i % 5],
            label: i === 0 ? 'HQ' : 'Branch Office',
          }),
        },
        industries: { create: [{ industryId: industry.id }] },
        subIndustries: { create: [{ subIndustryId: subIndustry.id }] },
        brands: i % 3 === 0 ? { create: [{ brandId: brands[0].id }] } : undefined,
        owners: { create: [{ userId: owner.id }] },
      },
      include: { addresses: true },
    })

    createdCompanies.push({
      id: company.id,
      industryIds: [industry.id],
      subIndustryIds: [subIndustry.id],
      ownerIds: [owner.id],
      addressId: company.addresses[0].id,
    })
  }

  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson']
  const createdContacts: { id: string; companyId: string }[] = []

  for (let ci = 0; ci < createdCompanies.length; ci++) {
    const co = createdCompanies[ci]
    const companyRecord = await prisma.company.findUnique({ where: { id: co.id } })
    if (!companyRecord) continue

    for (let j = 0; j < 2; j++) {
      const fn = firstNames[(ci + j) % firstNames.length]
      const ln = lastNames[(ci + j) % lastNames.length]

      const contact = await prisma.contact.create({
        data: {
          companyId: co.id,
          firstName: fn,
          lastName: ln,
          preferredName: j === 0 ? fn : null,
          jobTitle: ['CEO', 'CTO', 'VP Sales', 'HR Director', 'CFO'][j % 5],
          primaryEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}@${companyRecord.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
          primaryPhone: `+1-555-${String(1000 + ci * 10 + j).slice(-4)}`,
          linkedinProfile: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}`,
          workAddressId: co.addressId,
          industries: { create: co.industryIds.map((id) => ({ industryId: id })) },
          subIndustries: { create: co.subIndustryIds.map((id) => ({ subIndustryId: id })) },
          functionalExpertise: { create: [{ functionalExpertiseId: functionalExpertise[j % functionalExpertise.length].id }] },
          subFunctionalExpertise: { create: [{ subFunctionalExpertiseId: subFunctionalExpertise[j % subFunctionalExpertise.length].id }] },
          owners: { create: co.ownerIds.map((id) => ({ userId: id })) },
        },
      })
      createdContacts.push({ id: contact.id, companyId: co.id })
    }
  }

  for (let ci = 0; ci < createdCompanies.length; ci++) {
    const co = createdCompanies[ci]
    const contact = createdContacts.find((c) => c.companyId === co.id)

    await prisma.job.create({
      data: {
        jobTitle: ['Senior Software Engineer', 'Product Manager', 'Sales Director', 'Data Analyst', 'UX Designer'][ci % 5],
        jobCategory: ci % 4 === 0 ? 'JOB_LEAD' : 'JOB',
        jobType: ['PERMANENT', 'CONTRACT', 'TEMPORARY', 'INTERIM_PROJECT_CONSULTING'][ci % 4],
        permanentSubType: ci % 4 === 0 ? 'CONTINGENT' : null,
        headCount: (ci % 3) + 1,
        companyId: co.id,
        contactId: contact?.id,
        country: 'USA',
        state: ['CA', 'NY', 'TX', 'WA', 'IL'][ci % 5],
        jobAddressId: co.addressId,
        salaryType: ci % 2 === 0 ? 'ANNUAL' : 'MONTHLY',
        monthsPerYear: 12,
        annualSalary: 120000 + ci * 5000,
        salaryFrom: 100000 + ci * 4000,
        salaryTo: 150000 + ci * 6000,
        currency: 'USD',
        forecastBy: 'MANUAL',
        percentOfAnnualSalary: 20,
        forecastFee: 24000 + ci * 1000,
        functionalExpertise: { create: [{ functionalExpertiseId: functionalExpertise[0].id }] },
        subFunctionalExpertise: { create: [{ subFunctionalExpertiseId: subFunctionalExpertise[0].id }] },
        skills: { create: [{ skillId: skills[0].id }, { skillId: skills[2].id }] },
        keywords: { create: [{ keywordId: keywords[0].id }] },
        owners: { create: co.ownerIds.map((id) => ({ userId: id })) },
      },
    })
  }

  for (let i = 0; i < 25; i++) {
    const fn = firstNames[i % firstNames.length]
    const ln = lastNames[(i + 3) % lastNames.length]
    const industry = industries[i % industries.length]
    const subIndustry = subIndustries.find((s) => s.industryId === industry.id) ?? subIndustries[0]

    await prisma.candidate.create({
      data: {
        firstName: fn,
        lastName: ln,
        gender: i % 2 === 0 ? 'Male' : 'Female',
        dateOfBirth: `198${i % 10}-0${(i % 9) + 1}-15`,
        primaryEmail: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@email.com`,
        primaryPhone: `+1-555-${String(2000 + i).slice(-4)}`,
        linkedinProfile: `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}-${i}`,
        currentAddress: `${200 + i} Main Street, Austin, TX 78701`,
        nationality: ['American', 'British', 'Canadian', 'Australian'][i % 4],
        workSummary: `Experienced professional with ${3 + (i % 10)} years in the industry.`,
        currentCompany: companyNames[i % companyNames.length],
        currentJobTitle: ['Engineer', 'Manager', 'Analyst', 'Consultant'][i % 4],
        totalExperience: 3 + (i % 12) + (i % 3) * 0.5,
        expectedSalary: 80000 + i * 2000,
        availabilityDate: '2026-06-01',
        ownerId: users[i % users.length].id,
        skills: { create: [{ skillId: skills[i % skills.length].id }, { skillId: skills[(i + 1) % skills.length].id }] },
        functionalExpertise: { create: [{ functionalExpertiseId: functionalExpertise[i % functionalExpertise.length].id }] },
        subFunctionalExpertise: { create: [{ subFunctionalExpertiseId: subFunctionalExpertise[i % subFunctionalExpertise.length].id }] },
        keywords: { create: [{ keywordId: keywords[i % keywords.length].id }] },
        industries: { create: [{ industryId: industry.id }] },
        subIndustries: { create: [{ subIndustryId: subIndustry.id }] },
      },
    })
  }

  await backfillSearchVectors(prisma)

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
