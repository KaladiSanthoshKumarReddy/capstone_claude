---
description: Stage 6 detailed how-to — 7-area code-review checklist and safe-fix rules for the Capstone Item Manager.
appliesTo: Stage 6 (Code Review)
---

# Phase 6 — Code Review (Detailed)

## Objective
Peer-review the Stage 5 diff. Find real bugs and security issues, fix safe items directly, and block
Stage 7 until all CRITICAL findings are resolved.

## Pre-Checks
- `cd backend && npx tsc --noEmit` and `cd frontend && npx tsc --noEmit` — compile errors = CRITICAL.
- `git diff main --name-only` — scope review to changed files only.

## The 7 Review Areas (evaluate each; capstone checklist)
| Area | Ask |
|------|-----|
| **Correctness** | Does each component behave as specified in `requirements.md`? Are all ACs achievable with this code? |
| **Security** | Secrets excluded from output/logs? Input validated with Zod? Parameterized SQL? `authMiddleware` on protected routes? Per-user scoping? XSS-safe rendering? |
| **Error Handling** | Are API failures, missing files, empty results, and 'Not Found' handled gracefully (correct status codes, no crashes)? |
| **Test Coverage** | Will planned tests cover the happy path AND 'Not Found'/missing-field/empty edge cases? Are `data-testid`s present for E2E? |
| **Code Clarity** | Are function/variable names self-explanatory? Is logic followable without comments? |
| **DRY** | Is there duplicated logic to refactor into a shared helper? |
| **Dependency Safety** | Any new or known-vulnerable package versions? Is every dependency justified by an ADR? |

## Severity Definitions
- **CRITICAL** (blocks Stage 7): compile error; SQL injection; missing auth; hardcoded secret; XSS
  vector; broken `{success,...}` response shape; missing Zod validation before write; null deref;
  cross-user data leakage.
- **WARNING**: missing `data-testid`; unused imports; duplicate logic; missing async error handling;
  unescaped CSV field.
- **INFO**: style drift; naming polish; simplifiable logic.

## Safe Auto-Fixes (apply directly, no design change)
- Add missing `data-testid` (derive from component + purpose).
- Remove unused imports/variables.
- Add null-coalescing where the type already allows it.
- Fix obvious string-literal typos.
- Add CSV field escaping if missing.

## Never Auto-Fix
- Logic that changes behavior; API contracts; DB schema; anything needing architecture review.

## Output Report (to conversation, not a file)
```
Code Review — Stage 6
Compile: backend ✓/✗  frontend ✓/✗
Areas evaluated: Correctness, Security, Error Handling, Test Coverage, Clarity, DRY, Dependency Safety
CRITICAL <n>: [CR-01] file:line — desc — FIXED / MANUAL
WARNING  <n>: [WR-01] file:line — desc — FIXED / NOTED
INFO     <n>
Verdict: PASS (0 unresolved CRITICAL) | BLOCKED (→ Stage 5)
```

## Gate (see gate-validation-checklist.md → Gate 6)
PASS = both workspaces compile, all 7 areas evaluated, 0 unresolved CRITICAL, no secrets remaining.
