import type { Request, Response, NextFunction } from 'express'

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

export function paramId(req: Request, key = 'id'): string {
  const value = req.params[key]
  return Array.isArray(value) ? value[0] : value
}

export function notFound(res: Response, message: string): void {
  res.status(404).json({ error: message })
}

export function badRequest(res: Response, message: string): void {
  res.status(400).json({ error: message })
}
