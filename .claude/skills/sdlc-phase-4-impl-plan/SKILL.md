---
name: sdlc-phase-4-impl-plan
description: >
  SDLC Stage 4 — Implementation Planning for the Capstone Item Manager. Reads the APPROVED
  design-review.md and architecture.md and writes impl-plan.md — a dependency-ordered task list
  with file targets, success criteria, and FR traceability. Use for "run stage 4", "create the
  implementation plan", "write impl-plan.md".
---

# Skill: Stage 4 — Implementation Planning

## Purpose
Decompose the approved design into precise, dependency-ordered tasks a developer (or Stage 5 agent)
can execute without ambiguity. Identify blocked tasks that cannot start until a prerequisite finishes.

## Prerequisites
- `design-review.md` verdict = `APPROVED`. If not, STOP: "Stage 4 blocked: design not APPROVED."
- `architecture.md` and `requirements.md` exist.

## Gate Criteria — PASS
1. `impl-plan.md` exists.
2. Every task has: ID (`TASK-01…`), file target(s), change type, description, dependencies,
   success criteria, and FR coverage.
3. Every FR from `requirements.md` is covered by ≥ 1 task.
4. Ordering is topologically valid (no cycles); DB migrations precede routes that use new columns;
   backend precedes frontend.
5. No task modifies `tests/e2e/**` (Stage 7's domain).
6. Blocked tasks explicitly flagged with their blocker.

## Gate Criteria — FAIL
- Vague file targets ("update backend"), uncovered FRs, circular dependencies, or test-writing tasks.
- Remediation: refine tasks; re-run Stage 4.

## Core Steps
1. Confirm `design-review.md` = APPROVED.
2. Extract all planned changes from `architecture.md`.
3. Break into single-concern tasks (split any task > ~100 LOC).
4. Order: DB migration → route handlers → API client → components → pages.
5. Add dependency graph (Mermaid), FR→Task matrix, and risk areas.
6. Write `impl-plan.md`; update `/memories/session/phase-04-state.md`; print gate message.

## Output — `impl-plan.md` structure
Overview → Task List (each: File(s), Change type, Description, Depends on, Success criteria,
FR coverage) → Dependency Graph (Mermaid) → FR→Task Traceability → Implementation Order →
Estimated Risk Areas → Blocked Tasks.

## Gate Message
```
✅ STAGE 4 COMPLETE — Implementation Plan
📄 Artifact: impl-plan.md
📊 <N> tasks · FR coverage <x>/<y> · blocked: <b>
🎯 Next: Stage 5 — Implementation
⏸️  GATE: Review impl-plan.md → approve / reject
```

## Notes
- Each task must have a verifiable success criterion (e.g. "`npx tsc --noEmit` passes; endpoint returns 200").
- Detailed guidance: `.claude/instructions/phase-04-impl-plan.instructions.md`.
