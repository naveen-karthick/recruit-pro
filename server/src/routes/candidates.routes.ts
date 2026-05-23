import { Router } from 'express'
import { asyncHandler, badRequest, notFound, paramId } from '../middleware/async-handler.js'
import * as candidates from '../services/candidates.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, search } = req.query
  res.json(await candidates.listCandidates(
    page as string | undefined,
    pageSize as string | undefined,
    search as string | undefined,
  ))
}))

router.get('/stats', asyncHandler(async (_req, res) => {
  res.json(await candidates.getCandidateStats())
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const candidate = await candidates.getCandidateById(paramId(req))
  if (!candidate) {
    notFound(res, 'Candidate not found')
    return
  }
  res.json(candidate)
}))

router.post('/', asyncHandler(async (req, res) => {
  try {
    const candidate = await candidates.createCandidate(req.body)
    res.status(201).json(candidate)
  } catch (err) {
    badRequest(res, err instanceof Error ? err.message : 'Invalid request')
  }
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const candidate = await candidates.updateCandidate(paramId(req), req.body)
  if (!candidate) {
    notFound(res, 'Candidate not found')
    return
  }
  res.json(candidate)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await candidates.deleteCandidate(paramId(req))
  if (!deleted) {
    notFound(res, 'Candidate not found')
    return
  }
  res.status(204).send()
}))

export default router
