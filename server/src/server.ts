import 'dotenv/config'
import { createApp } from './app.js'

const PORT = Number(process.env.PORT) || 3001
const app = createApp()

app.listen(PORT, '0.0.0.0', () => {
  console.log(`EIREC API running on 0.0.0.0:${PORT}`)
})
