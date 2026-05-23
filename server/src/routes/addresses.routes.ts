import { Router } from 'express'
import { asyncHandler, notFound, paramId } from '../middleware/async-handler.js'
import * as addresses from '../services/addresses.js'

const router = Router()

router.get('/:id', asyncHandler(async (req, res) => {
  const addr = await addresses.getAddressById(paramId(req))
  if (!addr) {
    notFound(res, 'Address not found')
    return
  }
  res.json(addr)
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const addr = await addresses.updateAddress(paramId(req), req.body)
  if (!addr) {
    notFound(res, 'Address not found')
    return
  }
  res.json(addr)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await addresses.deleteAddress(paramId(req))
  if (!deleted) {
    notFound(res, 'Address not found')
    return
  }
  res.status(204).send()
}))

export default router
