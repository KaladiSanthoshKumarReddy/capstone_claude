import { createClient, Client } from '@libsql/client'
import path from 'path'
import fs from 'fs'

let client: Client

export function getDb(): Client {
  if (!client) {
    const dbPath = process.env.DATABASE_PATH || './data/capstone.db'
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    client = createClient({ url: `file:${dbPath}` })
  }
  return client
}

export async function initDb() {
  const db = getDb()
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      description TEXT,
      status      TEXT DEFAULT 'active',
      user_id     INTEGER REFERENCES users(id),
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME
    );
  `)

  const cols = await db.execute("PRAGMA table_info(items)")
  const hasUpdatedAt = cols.rows.some((r: unknown) => (r as { name: string }).name === 'updated_at')
  if (!hasUpdatedAt) {
    await db.execute("ALTER TABLE items ADD COLUMN updated_at DATETIME")
    console.log('Migration: added updated_at column to items')
  }

  const hasTags = cols.rows.some((r: unknown) => (r as { name: string }).name === 'tags')
  if (!hasTags) {
    await db.execute("ALTER TABLE items ADD COLUMN tags TEXT")
    console.log('Migration: added tags column to items')
  }

  console.log('Database initialized')
}
