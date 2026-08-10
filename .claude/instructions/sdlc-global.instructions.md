---
description: Global, cross-stage policy for the Capstone Item Manager AI SDLC pipeline. Applies to every stage agent, skill, and command.
appliesTo: all SDLC stages (1-8)
---

# SDLC Global Instructions — Capstone Item Manager

These rules apply to **every** stage. Stage-specific rules never override these.

## 1. Human-in-the-Loop Gates (non-negotiable)
- Every stage ends by printing a **gate message** and then **STOPS**.
- Advance only on explicit `approve` / `continue` / `proceed`.
- Re-run the current stage only on `reject` / `rework` / `redo`.
- Never auto-advance, never skip a gate, never run more than one stage per approval.
- Stage 3 `REJECTED` routes back to Stage 2 (not Stage 4).

## 2. Artifact Naming Contract (immutable)
| Stage | Artifact |
|-------|----------|
| 1 | `requirements.md` |
| 2 | `architecture.md` |
| 3 | `design-review.md` (verdict `APPROVED`/`REJECTED`) |
| 4 | `impl-plan.md` |
| 5 | code in `backend/src/**`, `frontend/src/**` |
| 6 | review report in conversation + safe fixes in code |
| 7 | `tests/e2e/specs/*.spec.ts` + `verification-report.md` |
| 8 | `CHANGELOG.md` + `sdlc-report.html` + GitHub PR |

## 3. Precedence Rule
If `requirements.md`, `architecture.md`, and `impl-plan.md` ever conflict:
**requirements.md wins**, then architecture, then plan.

## 4. Security (OWASP Top 10 — enforced at Stage 3 design and Stage 6 review)
- No hardcoded secrets, tokens, or URLs anywhere — read from `process.env.*` / `.env`.
- Parameterized SQL only (`@libsql/client` bound params); never string-concatenate queries.
- Zod-validate all input before any DB write.
- All protected routes go through `backend/src/middleware/auth.ts`; enforce per-user scoping.
- Escape/encode all user-rendered content; no `dangerouslySetInnerHTML` with user data.
- Never write or edit `.env` files programmatically (blocked by hook).

## 5. Coding Conventions
- API response shape: `{ success: true, data }` or `{ success: false, error }`.
- All frontend HTTP through `frontend/src/api/client.ts` (JWT interceptor).
- Frontend state in Zustand stores (`frontend/src/store/`); Tailwind utility classes only.
- Additive DB migrations only (pattern in `backend/src/db/init.ts`) — never DROP.
- `data-testid` on every interactive element.
- No new npm dependency without a documented ADR rationale in `architecture.md`.

## 6. Stage Isolation
- Stage 5 (implementation) must NEVER modify `tests/e2e/**` — that is Stage 7's domain.
- Stage 7 owns all E2E specs and the verification report.

## 7. Honesty Rule (no fabrication)
- Never invent test counts, timings, URLs, coverage numbers, or file states.
- Every metric in any artifact must come from an actual tool run (tsc, playwright, vitest, git, gh).
- If something is unknown or missing, write `Not Found` / `N/A` — do not guess.

## 8. Session State
- Each stage updates `/memories/session/phase-0N-state.md` and the master
  `/memories/session/sdlc-gate-state.md`; the orchestrator appends to `orchestrator-log.md`.
