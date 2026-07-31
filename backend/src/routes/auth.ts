import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/init'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' })
  }
  const { email, password } = parsed.data
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: [email],
  })
  const user = result.rows[0] as unknown as { id: number; email: string; password_hash: string } | undefined
  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' })
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '8h' })
  return res.json({ success: true, data: { token, email: user.email } })
})

router.post('/register', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' })
  }
  const { email, password } = parsed.data
  const db = getDb()
  try {
    await db.execute({
      sql: 'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      args: [email, hashPassword(password)],
    })
    return res.status(201).json({ success: true, data: { message: 'User created' } })
  } catch {
    return res.status(409).json({ success: false, error: 'Email already exists' })
  }
})

export default router
