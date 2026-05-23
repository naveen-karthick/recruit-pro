import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'

function parseCorsOrigins(): string[] | true {
  const raw = process.env.CORS_ORIGIN
  if (!raw || raw === '*') return true
  return raw.split(',').map((o) => o.trim()).filter(Boolean)
}

export function createApp() {
  const app = express()

  app.use(cors({ origin: parseCorsOrigins() }))
  app.use(express.json())

  app.use('/api', apiRoutes)

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
