import { Router } from 'express'
import { asyncHandler } from '../middleware/async-handler.js'
import * as master from '../services/master.js'

const router = Router()

router.get('/industries', asyncHandler(async (_req, res) => {
  res.json(await master.listIndustries())
}))

router.get('/sub-industries', asyncHandler(async (req, res) => {
  const { industryId } = req.query
  res.json(await master.listSubIndustries(industryId as string | undefined))
}))

router.get('/functional-expertise', asyncHandler(async (_req, res) => {
  res.json(await master.listFunctionalExpertise())
}))

router.get('/sub-functional-expertise', asyncHandler(async (req, res) => {
  const { functionalExpertiseId } = req.query
  res.json(await master.listSubFunctionalExpertise(functionalExpertiseId as string | undefined))
}))

router.get('/skills', asyncHandler(async (_req, res) => {
  res.json(await master.listSkills())
}))

router.get('/keywords', asyncHandler(async (_req, res) => {
  res.json(await master.listKeywords())
}))

router.get('/brands', asyncHandler(async (_req, res) => {
  res.json(await master.listBrands())
}))

router.get('/users', asyncHandler(async (_req, res) => {
  res.json(await master.listUsers())
}))

export default router
