import express from 'express'
import cors from 'cors'
import { config } from './config/index.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api', routes)

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' })
})

app.use(errorHandler)

app.listen(config.port, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${config.port}`)
})
