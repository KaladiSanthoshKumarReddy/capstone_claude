---
description: Stage 5 detailed coding standards (deepest file) for implementing features in the Capstone Item Manager.
appliesTo: Stage 5 (Implementation)
---

# Phase 5 — Implementation (Detailed Coding Standards)

This is the most detailed instruction file. Stage 5 turns `impl-plan.md` into production TypeScript.
Follow existing project patterns exactly; write the minimum correct diff per task.

## 0. Input Precedence & Scope
- Precedence: `requirements.md` > `architecture.md` > `impl-plan.md`.
- Output scope: `backend/src/**` and `frontend/src/**` only. NEVER `tests/e2e/**`.
- Execute tasks in the plan's dependency order; verify `tsc` after each.

## 1. General
- High cohesion, low coupling. One responsibility per module/function.
- Prefer clarity over cleverness; self-documenting names over comments.
- Reuse existing helpers; do not duplicate logic (extract a shared function instead).

## 2. TypeScript / JavaScript
- ES modules, `const`/`let` (never `var`); `async/await` (no floating promises).
- Explicit types on function signatures and exported symbols; avoid `any` (use `unknown` + narrowing).
- Name booleans as predicates (`isLoading`, `hasNext`); functions as verbs (`exportItemsCsv`).
- Guard against `null`/`undefined` on optional fields before use.

## 3. Backend (Express + TypeScript)
- Handler signature: `async (req: AuthRequest, res: Response)`.
- Protected router: `router.use(authMiddleware)` at the top; read the user via `req.user.id`.
- **Per-user scoping**: every items query filters by `user_id = ?` — never return another user's rows.
- **Parameterized SQL only** via `@libsql/client`:
  ```ts
  await db.execute({ sql: "SELECT * FROM items WHERE user_id = ? AND status = ?", args: [userId, status] })
  ```
- **Validate first** with Zod, then act:
  ```ts
  const schema = z.object({ status: z.enum(['todo','doing','done']).optional() })
  const parsed = schema.safeParse(req.query)
  if (!parsed.success) return res.status(400).json({ success: false, error: 'Invalid query' })
  ```
- **Response contract**: `res.json({ success: true, data })` or `res.status(code).json({ success: false, error })`.
- **Status codes**: 400 validation · 401 unauthenticated · 403 forbidden · 404 not found · 409 conflict · 500 unexpected.
- **Errors**: wrap DB/async in try/catch; log server-side; return a generic message (never leak stack/SQL/secrets).
- **Large responses** (e.g. CSV up to 1000 rows): set `Content-Type: text/csv` and
  `Content-Disposition: attachment; filename="items.csv"`; build output from parameterized query results;
  escape CSV fields (wrap in quotes, double embedded quotes) to prevent CSV/formula injection.

## 4. Database Migrations (additive only)
```ts
const cols = await db.execute("PRAGMA table_info(items)")
if (!cols.rows.some(r => r.name === 'new_col')) {
  await db.execute("ALTER TABLE items ADD COLUMN new_col TEXT")
  console.log('Migration: added items.new_col')
}
```
Never DROP TABLE/COLUMN; never run destructive DDL; new columns nullable or defaulted.

## 5. Frontend (React + TypeScript + Vite + Tailwind)
- Functional components with a typed `Props` interface; hooks at the top; no logic in JSX.
- **All HTTP through `frontend/src/api/client.ts`** (JWT interceptor + error normalization) — never raw fetch/axios.
- State in Zustand stores (`frontend/src/store/`); use URL search params for shareable filter/search state.
- **Tailwind utility classes only** — no inline styles, no new `.css` files.
- Every interactive element gets a stable `data-testid` (Stage 7 depends on these).
- Loading/empty/error states rendered explicitly (no silent failures).
- For downloads, create a Blob from the response and trigger an `<a download>`; revoke the object URL after.

## 6. Accessibility
- Semantic HTML; label every input (`<label htmlFor>` or `aria-label`).
- Keyboard operable (buttons, not clickable divs); visible focus states; sufficient contrast.

## 7. Security (OWASP hygiene)
- No hardcoded secrets/URLs/tokens — read from `process.env.*`.
- Never render untrusted HTML; no `dangerouslySetInnerHTML` with user data.
- Validate/normalize all input at the boundary; enforce auth + per-user scope on every protected route.

## 8. Performance
- Batch DOM updates; avoid N+1 queries; reuse prepared statements/patterns; paginate large lists.
- Keep bundle lean — do not add heavy dependencies for trivial tasks.

## 9. Verify Each Task
- After each task: `cd backend && npx tsc --noEmit` and/or `cd frontend && npx tsc --noEmit` (0 errors).
- Report `TASK-XX: ✓ <what changed>`; fix errors before the next task.

## 10. Constraints — DO / DO NOT
**DO:** follow the plan order; keep diffs minimal; preserve conventions; add `data-testid`; validate input.
**DO NOT:** touch `tests/e2e/**`; hardcode secrets; add npm deps without noting them; change
`middleware/auth.ts` or `api/client.ts` behavior unless architecture requires it; fabricate results.

## 11. Completion Gate (see gate-validation-checklist.md → Gate 5)
≥80% tasks done (target 100%), 0 tsc errors both workspaces, no secrets, parameterized SQL + Zod,
no `tests/e2e/**` changes, `data-testid` present. Then print the Stage 5 completion report + gate message.
