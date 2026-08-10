---
name: sdlc-phase-6-review
description: >
  SDLC Stage 6 — Code Review for the Capstone Item Manager. Audits the Stage 5 diff across 7 review
  areas (correctness, security, error handling, test coverage, code clarity, DRY, dependency safety),
  applies safe mechanical fixes, and reports findings by severity. Use for "run stage 6",
  "review the code", "code review".
---

# Skill: Stage 6 — Code Review

## Purpose
Peer-review the implementation against `requirements.md` and `architecture.md`, find real bugs and
security issues, and fix safe items directly. All CRITICAL findings must be resolved before Stage 7.

## Prerequisites
- Stage 5 code changes exist; `requirements.md` and `architecture.md` available.

## Pre-Checks
- `cd backend && npx tsc --noEmit` and `cd frontend && npx tsc --noEmit` (compile errors = CRITICAL).
- `git diff main --name-only` to scope the review to changed files.

## The 7 Review Areas (capstone checklist)
| # | Area | Key questions |
|---|------|---------------|
| 1 | Correctness | Does each component behave as specified in requirements.md? All ACs achievable? |
| 2 | Security | Secrets excluded from output/logs? User input validated (Zod)? Parameterized SQL? Auth on protected routes? XSS-safe rendering? |
| 3 | Error Handling | API failures, missing files, empty results, and 404/`Not Found` handled gracefully? |
| 4 | Test Coverage | Do planned tests cover happy path AND 'Not Found'/missing-field edge cases? `data-testid` present? |
| 5 | Code Clarity | Function/variable names self-explanatory? Logic readable without comments? |
| 6 | DRY Principle | Duplicated logic that should be refactored into a shared helper? |
| 7 | Dependency Safety | Any new/known-vulnerable package versions? Deps justified by an ADR? |

## Severity
- **CRITICAL** (blocks Stage 7): compile errors; SQL injection; missing `authMiddleware`; hardcoded
  secrets; XSS vectors; broken response shape; missing Zod validation before DB write; null deref.
- **WARNING**: missing `data-testid`, unused imports, duplicate logic, missing async error handling.
- **INFO**: style drift, naming polish, simplifiable logic.

## Safe Auto-Fixes (apply directly)
Add missing `data-testid`; remove unused imports; add null-coalescing where types allow; fix string typos.
**Do NOT** auto-fix logic, API contracts, DB schema, or anything needing design review.

## Gate Criteria
- **PASS**: both workspaces compile (0 errors); all CRITICAL findings fixed or documented as accepted
  risk; no hardcoded secrets remain.
- **BLOCKED**: any unresolved CRITICAL finding → return to Stage 5.

## Core Steps
1. Run compile pre-checks. 2. Scope diff. 3. Evaluate all 7 areas. 4. Classify findings by severity.
5. Apply safe auto-fixes. 6. Print the review report + verdict. 7. Update `/memories/session/phase-06-state.md`.

## Output Report (to conversation)
```
Code Review — Stage 6
Compile: backend ✓/✗  frontend ✓/✗
Area coverage: 1..7 evaluated
CRITICAL <n>:  [CR-01] file:line — desc — FIXED / MANUAL
WARNING  <n>:  [WR-01] file:line — desc — FIXED / NOTED
INFO     <n>
Verdict: PASS | BLOCKED
```

## Notes
- Detailed rubric: `.claude/instructions/phase-06-review.instructions.md`.
