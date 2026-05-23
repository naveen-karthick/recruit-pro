import express from 'express'
import apiRoutes from './routes/index.js'
import { corsMiddleware } from './middleware/cors.js'

export function createApp() {
  const app = express()

  // Must be first — handles OPTIONS preflight and sets headers on all responses.
  app.use(corsMiddleware)
  app.use(express.json())

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' })
  })

  app.use('/api', apiRoutes)

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
