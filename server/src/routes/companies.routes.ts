import { Router } from 'express'
import { asyncHandler, badRequest, notFound, paramId } from '../middleware/async-handler.js'
import * as companies from '../services/companies.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, search } = req.query
  res.json(await companies.listCompanies(
    page as string | undefined,
    pageSize as string | undefined,
    search as string | undefined,
  ))
}))

router.get('/stats', asyncHandler(async (_req, res) => {
  res.json(await companies.getCompanyStats())
}))

router.get('/:id/contacts', asyncHandler(async (req, res) => {
  const id = paramId(req)
  const company = await companies.getCompanyById(id)
  if (!company) {
    notFound(res, 'Company not found')
    return
  }
  res.json(await companies.getCompanyContacts(id))
}))

router.get('/:id/addresses', asyncHandler(async (req, res) => {
  const id = paramId(req)
  const addresses = await companies.getCompanyAddresses(id)
  if (!addresses) {
    notFound(res, 'Company not found')
    return
  }
  res.json(addresses)
}))

router.post('/:id/addresses', asyncHandler(async (req, res) => {
  const id = paramId(req)
  try {
    const addr = await companies.createCompanyAddress(id, req.body)
    if (!addr) {
      notFound(res, 'Company not found')
      return
    }
    res.status(201).json(addr)
  } catch (err) {
    badRequest(res, err instanceof Error ? err.message : 'Invalid request')
  }
}))

router.get('/:id/address-options', asyncHandler(async (req, res) => {
  const id = paramId(req)
  const options = await companies.getCompanyAddressOptions(id)
  if (!options) {
    notFound(res, 'Company not found')
    return
  }
  res.json(options)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const company = await companies.getCompanyById(paramId(req))
  if (!company) {
    notFound(res, 'Company not found')
    return
  }
  res.json(company)
}))

router.post('/', asyncHandler(async (req, res) => {
  try {
    const company = await companies.createCompany(req.body)
    res.status(201).json(company)
  } catch (err) {
    badRequest(res, err instanceof Error ? err.message : 'Invalid request')
  }
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const company = await companies.updateCompany(paramId(req), req.body)
  if (!company) {
    notFound(res, 'Company not found')
    return
  }
  res.json(company)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await companies.deleteCompany(paramId(req))
  if (!deleted) {
    notFound(res, 'Company not found')
    return
  }
  res.status(204).send()
}))

export default router
