import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb } from './db/init'
import authRouter from './routes/auth'
import itemsRouter from './routes/items'
import debugRouter from './routes/debug'

dotenv.config({ path: '../.env' })

const app = express()
const PORT = process.env.BACKEND_PORT || 4000

app.use(cors({ origin: `http://localhost:${process.env.FRONTEND_PORT || 3000}` }))
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/items', itemsRouter)

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', debugRouter)
}

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok' } })
})

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
  })
}).catch(err => {
  console.error('Failed to initialize DB:', err)
  process.exit(1)
})
