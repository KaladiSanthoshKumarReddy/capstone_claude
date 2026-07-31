import { Router, Request, Response } from 'express'
import { getDb } from '../db/init'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Capstone Debug Tables</title>
  <style>
    body { margin: 0; background: #f6f7fb; font-family: "Segoe UI", sans-serif; }
    .wrap { max-width: 1200px; margin: 24px auto; padding: 0 16px; }
    .card { background: #fff; border: 1px solid #d9e0ea; border-radius: 14px; overflow: hidden; margin-bottom: 14px; }
    .card h2 { margin: 0; padding: 12px 14px; font-size: 16px; background: #f2f6fc; border-bottom: 1px solid #d9e0ea; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { border-bottom: 1px solid #eef3fa; padding: 8px 10px; text-align: left; }
    th { background: #eef3fa; font-weight: 700; }
    .empty { padding: 16px; color: #5f6b7a; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Capstone Debug Tables</h1>
    <div class="card">
      <h2>Users <span id="uCount"></span></h2>
      <div id="uWrap"></div>
    </div>
    <div class="card">
      <h2>Items <span id="iCount"></span></h2>
      <div id="iWrap"></div>
    </div>
  </div>
  <script>
    function esc(v) { return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
    async function load() {
      const [u, i] = await Promise.all([fetch('/api/debug/users'), fetch('/api/debug/items')])
      const users = (await u.json()).data || []
      const items = (await i.json()).data || []
      document.getElementById('uCount').textContent = users.length + ' row(s)'
      document.getElementById('iCount').textContent = items.length + ' row(s)'
      document.getElementById('uWrap').innerHTML = users.length
        ? '<table><thead><tr><th>ID</th><th>Email</th><th>Created</th></tr></thead><tbody>'
          + users.map(r=>'<tr><td>'+esc(r.id)+'</td><td>'+esc(r.email)+'</td><td>'+esc(r.created_at)+'</td></tr>').join('')
          + '</tbody></table>'
        : '<div class="empty">No users</div>'
      document.getElementById('iWrap').innerHTML = items.length
        ? '<table><thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Tags</th><th>User</th><th>Created</th></tr></thead><tbody>'
          + items.map(r=>'<tr><td>'+esc(r.id)+'</td><td>'+esc(r.title)+'</td><td>'+esc(r.status)+'</td><td>'+esc(r.tags)+'</td><td>'+esc(r.user_id)+'</td><td>'+esc(r.created_at)+'</td></tr>').join('')
          + '</tbody></table>'
        : '<div class="empty">No items</div>'
    }
    load()
  </script>
</body>
</html>`)
})

router.get('/users', async (_req: Request, res: Response) => {
  const db = getDb()
  const result = await db.execute({ sql: 'SELECT id, email, created_at FROM users ORDER BY created_at DESC', args: [] })
  return res.json({ success: true, data: result.rows })
})

router.get('/items', async (_req: Request, res: Response) => {
  const db = getDb()
  const result = await db.execute({
    sql: 'SELECT id, title, description, status, tags, user_id, created_at, updated_at FROM items ORDER BY created_at DESC',
    args: [],
  })
  return res.json({ success: true, data: result.rows })
})

export default router
