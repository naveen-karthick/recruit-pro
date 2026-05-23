import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { backfillSearchVectors, setupSearchVectors } from './setup-search-vectors.js'

const prisma = new PrismaClient()

async function main() {
  await setupSearchVectors(prisma)
  await backfillSearchVectors(prisma)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
