import { Router } from 'express'
import { asyncHandler, badRequest, notFound, paramId } from '../middleware/async-handler.js'
import * as contacts from '../services/contacts.js'

const router = Router()

router.get('/', asyncHandler(async (req, res) => {
  const { page, pageSize, search } = req.query
  res.json(await contacts.listContacts(
    page as string | undefined,
    pageSize as string | undefined,
    search as string | undefined,
  ))
}))

router.get('/stats', asyncHandler(async (_req, res) => {
  res.json(await contacts.getContactStats())
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const contact = await contacts.getContactById(paramId(req))
  if (!contact) {
    notFound(res, 'Contact not found')
    return
  }
  res.json(contact)
}))

router.post('/', asyncHandler(async (req, res) => {
  try {
    const contact = await contacts.createContact(req.body)
    res.status(201).json(contact)
  } catch (err) {
    badRequest(res, err instanceof Error ? err.message : 'Invalid request')
  }
}))

router.patch('/:id', asyncHandler(async (req, res) => {
  const contact = await contacts.updateContact(paramId(req), req.body)
  if (!contact) {
    notFound(res, 'Contact not found')
    return
  }
  res.json(contact)
}))

router.delete('/:id', asyncHandler(async (req, res) => {
  const deleted = await contacts.deleteContact(paramId(req))
  if (!deleted) {
    notFound(res, 'Contact not found')
    return
  }
  res.status(204).send()
}))

export default router
