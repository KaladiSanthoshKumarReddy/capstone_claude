---
description: Stage 3 detailed how-to — adversarial 6-dimension design review rubric for the Capstone Item Manager.
appliesTo: Stage 3 (Design Review)
---

# Phase 3 — Design Review (Detailed)

## Objective
Act as a senior reviewer. Find real risks in `architecture.md` before implementation. Produce
`design-review.md` with an explicit `APPROVED` or `REJECTED` verdict. Catching a bad design here is
cheaper than catching it in code.

## The 6 Dimensions (evaluate each independently)
### 1. FR Coverage
Every FR in `requirements.md` maps to ≥ 1 architecture element. List uncovered FRs (each = CRITICAL).

### 2. API Contract Correctness
Each new/changed endpoint documents method, path, auth, request body, and response shape
(`{success,data}`/`{success,error}`). Missing auth on a protected route = CRITICAL.

### 3. Database Safety
No DROP TABLE/COLUMN, no destructive migration. New columns nullable or defaulted. Migration uses
the `PRAGMA table_info` guard. Any destructive step = CRITICAL.

### 4. Security (OWASP Top 10)
Check: SQL injection (must be parameterized), XSS (must escape user content), broken auth (JWT +
`authMiddleware`), sensitive-data exposure (no secrets in responses/logs), missing input validation
(Zod before writes), cross-user data leakage (per-user scoping). Any unmitigated risk = CRITICAL.

### 5. Convention Compliance
Auth flow preserved; additive DB init pattern preserved; `frontend/src/api/client.ts` used for HTTP;
Zustand for state; response contract honored. Violations = WARNING or CRITICAL by severity.

### 6. Completeness
All required architecture sections present (diagrams, DB diff, API contracts, ADRs, traceability,
security, risks). Missing required section = CRITICAL.

## Finding Severity
- **CRITICAL** — blocks APPROVED. Must include: dimension, description, suggested fix.
- **WARNING** — should fix; does not block.
- **INFO** — optional polish.

## Verdict Rules
- **APPROVED** — all 6 dimensions pass; zero CRITICAL findings (WARNINGs allowed).
- **REJECTED** — any CRITICAL finding. Orchestrator routes back to Stage 2 with these findings.
- The verdict line must literally contain `APPROVED` or `REJECTED`.

## Output (`design-review.md`)
Verdict → Review Summary table (6 rows PASS/FAIL + finding count) → Detailed Findings (CRITICAL /
WARNING / INFO) → Traceability Verification → Security Sign-off (per OWASP category) → Reviewer Notes.

## Do / Do NOT
**Do:** be adversarial; prefer REJECTED over rubber-stamping a flawed design; give concrete fixes.
**Do NOT:** change the architecture yourself (that is Stage 2's job on rework).

## Gate (see gate-validation-checklist.md → Gate 3)
PASS = APPROVED with 0 CRITICAL and a complete traceability verification.
