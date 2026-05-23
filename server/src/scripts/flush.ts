import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function flushDatabase() {
  console.log('Flushing all data...')

  await prisma.$transaction([
    prisma.candidateSubIndustry.deleteMany(),
    prisma.candidateIndustry.deleteMany(),
    prisma.candidateKeyword.deleteMany(),
    prisma.candidateSubFunctionalExpertise.deleteMany(),
    prisma.candidateFunctionalExpertise.deleteMany(),
    prisma.candidateSkill.deleteMany(),
    prisma.candidate.deleteMany(),
    prisma.jobOwner.deleteMany(),
    prisma.jobKeyword.deleteMany(),
    prisma.jobSkill.deleteMany(),
    prisma.jobSubFunctionalExpertise.deleteMany(),
    prisma.jobFunctionalExpertise.deleteMany(),
    prisma.job.deleteMany(),
    prisma.contactOwner.deleteMany(),
    prisma.contactSubFunctionalExpertise.deleteMany(),
    prisma.contactFunctionalExpertise.deleteMany(),
    prisma.contactSubIndustry.deleteMany(),
    prisma.contactIndustry.deleteMany(),
    prisma.contact.deleteMany(),
    prisma.companyOwner.deleteMany(),
    prisma.companyBrand.deleteMany(),
    prisma.companySubIndustry.deleteMany(),
    prisma.companyIndustry.deleteMany(),
    prisma.address.deleteMany(),
    prisma.company.deleteMany(),
    prisma.subIndustry.deleteMany(),
    prisma.industry.deleteMany(),
    prisma.subFunctionalExpertise.deleteMany(),
    prisma.functionalExpertise.deleteMany(),
    prisma.skill.deleteMany(),
    prisma.keyword.deleteMany(),
    prisma.brand.deleteMany(),
    prisma.crmUser.deleteMany(),
  ])

  console.log('Database flushed.')
}

flushDatabase()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
