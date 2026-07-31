import { Router, Response } from 'express'
import { z } from 'zod'
import { getDb } from '../db/init'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
router.use(authMiddleware)

const tagsSchema = z.string()
  .transform(raw => raw.split(',').map(t => t.trim()).filter(t => t.length > 0))
  .refine(tags => tags.length <= 10, { message: 'Maximum of 10 tags allowed' })
  .refine(tags => tags.every(t => t.length <= 30), { message: 'Each tag must be 30 characters or fewer' })
  .optional()

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  tags: tagsSchema,
})

const patchSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
  tags: tagsSchema,
})

function normalizeTags(tags?: string[]): string | null {
  if (!tags || tags.length === 0) return null
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of tags) {
    const t = raw.toLowerCase()
    if (t && !seen.has(t)) { seen.add(t); result.push(t) }
  }
  return result.length ? result.join(',') : null
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const page  = Math.max(1, parseInt(req.query.page  as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10))
  const search = (req.query.search as string | undefined)?.trim() || null
  const status = (req.query.status as string | undefined) || null
  const tag = (req.query.tag as string | undefined)?.trim().toLowerCase() || null
  const offset = (page - 1) * limit

  const db = getDb()

  const whereClauses: string[] = ['user_id = ?']
  const args: (string | number | null)[] = [req.userId ?? null]

  if (search) {
    whereClauses.push("(title LIKE ? OR description LIKE ?)")
    args.push(`%${search}%`, `%${search}%`)
  }
  if (status && status !== 'all') {
    whereClauses.push("status = ?")
    args.push(status)
  }
  if (tag) {
    const escapedTag = tag.replace(/[%_]/g, ch => `\\${ch}`)
    whereClauses.push("(',' || tags || ',') LIKE ? ESCAPE '\\'")
    args.push(`%,${escapedTag},%`)
  }

  const where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : ''

  const countResult = await db.execute({ sql: `SELECT COUNT(*) as total FROM items ${where}`, args })
  const total = Number((countResult.rows[0] as unknown as { total: number }).total)

  const itemsResult = await db.execute({
    sql: `SELECT * FROM items ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [...args, limit, offset],
  })

  return res.json({
    success: true,
    data: itemsResult.rows,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  })
})

router.post('/', async (req: AuthRequest, res: Response) => {
  const parsed = createSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' })
  }
  const { title, description, tags } = parsed.data
  const db = getDb()
  const result = await db.execute({
    sql: 'INSERT INTO items (title, description, tags, user_id) VALUES (?, ?, ?, ?)',
    args: [title, description ?? null, normalizeTags(tags), req.userId ?? null],
  })
  return res.status(201).json({ success: true, data: { id: Number(result.lastInsertRowid) } })
})

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const parsed = patchSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: 'Invalid input' })
  }
  const { title, description, status, tags } = parsed.data
  if (!title && description === undefined && !status && tags === undefined) {
    return res.status(400).json({ success: false, error: 'Nothing to update' })
  }
  const db = getDb()

  const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP']
  const args: (string | number | null)[] = []
  if (title)                { setClauses.push('title = ?');       args.push(title) }
  if (description !== undefined) { setClauses.push('description = ?'); args.push(description) }
  if (status)               { setClauses.push('status = ?');      args.push(status) }
  if (tags !== undefined)   { setClauses.push('tags = ?');         args.push(normalizeTags(tags)) }
  args.push(req.params.id, req.userId ?? null)

  const result = await db.execute({
    sql: `UPDATE items SET ${setClauses.join(', ')} WHERE id = ? AND user_id = ?`,
    args,
  })

  if (result.rowsAffected === 0) {
    return res.status(404).json({ success: false, error: 'Item not found' })
  }

  const updated = await db.execute({
    sql: 'SELECT * FROM items WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.userId ?? null],
  })
  return res.json({ success: true, data: updated.rows[0] })
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  const db = getDb()
  const result = await db.execute({
    sql: 'DELETE FROM items WHERE id = ? AND user_id = ?',
    args: [req.params.id, req.userId ?? null],
  })
  if (result.rowsAffected === 0) {
    return res.status(404).json({ success: false, error: 'Item not found' })
  }
  return res.json({ success: true, data: { deleted: true } })
})

export default router
