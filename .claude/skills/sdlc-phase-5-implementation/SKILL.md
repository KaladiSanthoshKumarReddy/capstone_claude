---
name: sdlc-phase-5-implementation
description: >
  SDLC Stage 5 — Implementation for the Capstone Item Manager. Reads impl-plan.md and writes clean,
  minimal, production-safe TypeScript to backend/src/ and frontend/src/, verifying tsc after each
  task. Never touches tests/e2e/. Use for "run stage 5", "implement the feature", "write the code".
---

# Skill: Stage 5 — Implementation

## Purpose
Execute every `TASK-XX` from `impl-plan.md` in dependency order, producing production code that
follows existing project patterns exactly. This is the deepest phase — precision matters most here.

## Prerequisites
- `impl-plan.md` exists (Stage 4 PASS) and `design-review.md` = APPROVED.
- Baseline compiles: `cd backend && npx tsc --noEmit`; `cd frontend && npx tsc --noEmit` (0 errors).

## Execution Protocol (per task)
1. Read the target file(s) BEFORE editing.
2. Apply the minimum diff for that one task.
3. Run `npx tsc --noEmit` in the affected workspace; fix errors before proceeding.
4. Report `TASK-XX: ✓ <what changed>`.

## Coding Standards
### Backend (`backend/src/`)
- Handlers: `async (req: AuthRequest, res: Response)`.
- Protected routes: `router.use(authMiddleware)` at top; enforce per-user `user_id` scoping.
- DB: parameterized queries only via `@libsql/client` (never string concatenation).
- Validation: Zod schema before any DB write; 400 on validation error.
- Response shape: `{ success: true, data }` or `{ success: false, error }`.
- Status codes: 400 validation · 401 auth · 403 forbidden · 404 not found · 409 conflict · 500 unexpected.
- Errors: try/catch around async DB calls; never leak stack traces or secrets to the client.
### Frontend (`frontend/src/`)
- Functional components with a typed props interface.
- All HTTP through `frontend/src/api/client.ts` (never raw fetch/axios).
- State in Zustand stores (`frontend/src/store/`); URL params for shareable filters.
- Tailwind utility classes only (no inline styles, no new CSS files).
- `data-testid` on every interactive element (required by Stage 7 Playwright tests).
- Escape/encode all user-rendered content (no `dangerouslySetInnerHTML` with user data).
### Database migrations (additive pattern from `backend/src/db/init.ts`)
```ts
const cols = await db.execute("PRAGMA table_info(items)")
if (!cols.rows.some(r => r.name === 'new_col')) {
  await db.execute("ALTER TABLE items ADD COLUMN new_col TEXT")
}
```
Never DROP TABLE/COLUMN or run destructive migrations.

## Gate Criteria — PASS
1. ≥ 80% of `impl-plan.md` tasks completed (target 100%).
2. `npx tsc --noEmit` = 0 errors in both `backend/` and `frontend/`.
3. No hardcoded secrets/URLs/tokens; all from `process.env.*`.
4. No parameterless SQL; every write preceded by Zod validation.
5. No files modified under `tests/e2e/**`.
6. `data-testid` present on new interactive elements.

## Gate Criteria — FAIL
- New compile errors, destructive migration, secret leak, unparameterized SQL, or Stage-7 files touched.
- Remediation: fix and re-run affected tasks.

## Absolute Prohibitions
- Do NOT write anything in `tests/e2e/**`. Do NOT hardcode secrets. Do NOT add npm deps without noting them.
- Do NOT change `middleware/auth.ts` or `api/client.ts` behavior unless the architecture requires it.
- Do NOT fabricate passing results.

## Completion Report
```
Stage 5 complete — Implementation
✓ TASK-01: <desc>
✓ TASK-02: <desc>
TypeScript: backend 0 errors · frontend 0 errors
Tasks completed: <n>/<N>
```
Update `/memories/session/phase-05-state.md`, then print the gate message.

## Notes
- Detailed standards (JS, HTML, CSS, a11y, validation, error handling, security, DB, perf):
  `.claude/instructions/phase-05-implementation.instructions.md`.
