import { Router } from 'express'
import { asyncHandler } from '../middleware/async-handler.js'
import { quickSearch } from '../services/search.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const q = (req.query.q as string | undefined) ?? ''
  res.json(await quickSearch(q))
}))

export default router
