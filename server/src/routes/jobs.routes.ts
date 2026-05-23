import { Router } from 'express'
import { asyncHandler, badRequest, notFound, paramId } from '../middleware/async-handler.js'
import * as jobs from '../services/jobs.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, search } = req.query
  res.json(await jobs.listJobs(
    page as string | undefined,
    pageSize as string | undefined,
    search as string | undefined,
  ))
}))

router.get('/stats', asyncHandler(async (_req, res) => {
  res.json(await jobs.getJobStats())
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const job = await jobs.getJobById(paramId(req))
  if (!job) {
    notFound(res, 'Job not found')
    return
  }
  res.json(job)
}))

router.post('/', asyncHandler(async (req, res) => {
  try {
    const job = await jobs.createJob(req.body)
    res.status(201).json(job)
  } catch (err) {
    badRequest(res, err instanceof Error ? err.message : 'Invalid request')
  }
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const job = await jobs.updateJob(paramId(req), req.body)
  if (!job) {
    notFound(res, 'Job not found')
    return
  }
  res.json(job)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await jobs.deleteJob(paramId(req))
  if (!deleted) {
    notFound(res, 'Job not found')
    return
  }
  res.status(204).send()
}))

export default router
