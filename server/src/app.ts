import express from 'express'
import cors from 'cors'
import apiRoutes from './routes/index.js'
import { getCorsOptions } from './middleware/cors.js'

export function createApp() {
  const app = express()

  app.use(cors(getCorsOptions()))
  app.use(express.json())

  app.use('/api', apiRoutes)

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  })

  return app
}
