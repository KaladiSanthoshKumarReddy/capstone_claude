---
description: Stage 4 detailed how-to — task decomposition and dependency ordering for the Capstone Item Manager.
appliesTo: Stage 4 (Implementation Plan)
---

# Phase 4 — Implementation Planning (Detailed)

## Objective
Convert the APPROVED design into a dependency-ordered `impl-plan.md` that Stage 5 can execute with
zero ambiguity. Surface blocked tasks explicitly.

## Precondition
`design-review.md` verdict must be `APPROVED`. If not → STOP: "Stage 4 blocked: design not APPROVED."

## Task Anatomy (every task needs all fields)
```
### TASK-0N: <imperative title>
- File(s): backend/src/routes/items.ts
- Change type: Modify | Add | Delete
- Description: <exact change>
- Depends on: none | TASK-0M
- Success criteria: <objective, verifiable — e.g. "npx tsc --noEmit passes; GET /api/items/export returns 200 text/csv">
- FR coverage: FR-07
```

## Granularity Rules
- **One concern per task.** Split any task that would exceed ~100 LOC.
- **Backend before frontend**, and within that: DB migration → route handler → API client →
  component → page → wiring.
- Tests are NOT implementation tasks (Stage 7 owns `tests/e2e/**`). A task may add a Vitest unit
  test file for pure logic only if it lives under `frontend/src/**/__tests__`.

## Ordering & Dependencies
- Produce a Mermaid dependency graph.
- Ensure topological validity (no cycles). DB-column tasks precede any route using that column.
- List a final **Implementation Order** (flat, numbered) that respects dependencies.

## Blocked Tasks
Flag any task that cannot start until another finishes, and state the blocker explicitly.

## Traceability & Risk
- `FR → Task` matrix: every FR covered by ≥ 1 task.
- Risk table: `Task | Risk | Mitigation` for the riskiest tasks (migrations, auth, large responses).

## Do / Do NOT
**Do:** make success criteria machine-verifiable; keep tasks atomic.
**Do NOT:** write code, include E2E test writing, or leave vague file targets.

## Gate (see gate-validation-checklist.md → Gate 4)
PASS = all tasks fully specified, every FR covered, valid ordering, no `tests/e2e/**` tasks, blockers flagged.
