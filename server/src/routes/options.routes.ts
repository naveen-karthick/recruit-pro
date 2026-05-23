import { Router } from 'express'
import { asyncHandler, notFound, paramId } from '../middleware/async-handler.js'
import * as master from '../services/master.js'
import * as companies from '../services/companies.js'

const router = Router()

router.get('/companies', asyncHandler(async (_req, res) => {
  res.json(await companies.listCompanyOptions())
}))

router.get('/:type', asyncHandler(async (req, res) => {
  const { parentId } = req.query
  const result = await master.resolveOptions(paramId(req, 'type'), parentId as string | undefined)
  if (!result) {
    notFound(res, `Unknown option type: ${paramId(req, 'type')}`)
    return
  }
  res.json(result)
}))

export default router
