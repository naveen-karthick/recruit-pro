import { Router } from 'express'
import companiesRoutes from './companies.routes.js'
import contactsRoutes from './contacts.routes.js'
import jobsRoutes from './jobs.routes.js'
import candidatesRoutes from './candidates.routes.js'
import addressesRoutes from './addresses.routes.js'
import masterRoutes from './master.routes.js'
import optionsRoutes from './options.routes.js'
import searchRoutes from './search.routes.js'

const router = Router()

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

router.use('/master', masterRoutes)
router.use('/options', optionsRoutes)
router.use('/companies', companiesRoutes)
router.use('/contacts', contactsRoutes)
router.use('/jobs', jobsRoutes)
router.use('/candidates', candidatesRoutes)
router.use('/addresses', addressesRoutes)
router.use('/search', searchRoutes)

export default router
