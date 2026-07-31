# Backend Instructions

These instructions apply to all work inside `backend/`. They are automatically loaded by Claude Code when working on backend files.

## Stack

- Runtime: Node.js 20 + TypeScript (strict mode)
- Framework: Express 4
- Database: SQLite via `@libsql/client` (local file, no network)
- Auth: JWT (`jsonwebtoken`) — 8h expiry, HS256
- Validation: Zod (`zod`) — validate before every DB write
- Password hashing: SHA-256 (no bcrypt — single-user dev tool)

## File Layout

```
backend/src/
├── index.ts           ← Express app, CORS, mounts routes
├── db/
│   └── init.ts        ← createClient(), CREATE TABLE IF NOT EXISTS, additive migrations
├── middleware/
│   └── auth.ts        ← verifyToken(), AuthRequest interface
└── routes/
    ├── auth.ts        ← POST /api/auth/login, /api/auth/register
    ├── items.ts       ← GET/POST/PATCH/DELETE /api/items (auth-protected)
    └── debug.ts       ← Dev-only HTML viewer, non-prod guard
```

## Conventions

### Database
- ALWAYS use `@libsql/client` syntax: `{ sql: '...', args: [...] }` — never string concatenation
- Migrations MUST be additive: `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...` or `PRAGMA table_info()` check first
- Never DROP TABLE, DROP COLUMN, or DELETE all rows in migrations
- DB client is a singleton — import from `../db/init` only

### Validation
- Use Zod schemas before every `db.execute()` write operation
- Return 400 with `{ success: false, error: schema.error.message }` on validation failure
- Return 409 for duplicate key conflicts (email already exists)

### Auth
- Import `authMiddleware` from `../middleware/auth` and apply to all routes under `/api/items`
- Access `(req as AuthRequest).userId` and `.userEmail` after middleware
- JWT secret from `process.env.JWT_SECRET` — never hardcode

### Response shape
All responses must follow:
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: string }
```

### Error handling
- Wrap route handlers in try/catch
- Log errors with `console.error`
- Return 500 `{ success: false, error: 'Internal server error' }` — never expose stack traces

## What NOT to change

- The DB client singleton pattern in `db/init.ts`
- The `AuthRequest` interface in `middleware/auth.ts`
- The `/api/auth` route prefix
- The `{ sql, args }` parameterized query format
