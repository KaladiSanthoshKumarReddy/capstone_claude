---
name: sdlc-phase-3-design-review
description: >
  SDLC Stage 3 — Design Review for the Capstone Item Manager. Performs an adversarial audit of
  architecture.md against requirements.md across 6 dimensions and writes design-review.md with an
  explicit APPROVED or REJECTED verdict. Use for "run stage 3", "review the architecture",
  "write design-review.md".
---

# Skill: Stage 3 — Design Review

## Purpose
Act as a senior reviewer who finds real risks BEFORE any code is written. A REJECTED verdict that
prevents a bad design reaching implementation is a success, not a failure.

## Prerequisites
- `requirements.md` and `architecture.md` both exist.

## Six Review Dimensions
1. **FR Coverage** — every FR traces to ≥ 1 architecture element. List uncovered FRs.
2. **API Contract Correctness** — each endpoint has method, path, auth, request body, response
   shape (`{success,...}`). List incomplete endpoints.
3. **Database Safety** — no DROP/destructive migration; new columns nullable or defaulted.
4. **Security (OWASP Top 10)** — injection (SQL/XSS), broken auth, data exposure, missing input
   validation; all protected routes use `authMiddleware`.
5. **Convention Compliance** — auth flow, additive DB init pattern, and `api/client.ts` preserved.
6. **Completeness** — required sections present (diagrams, DB diff, API contracts, ADRs, traceability).

## Gate Criteria
- **APPROVED**: all 6 dimensions pass with zero CRITICAL findings (WARNINGs allowed).
- **REJECTED**: any CRITICAL finding in any dimension. Orchestrator routes back to Stage 2 with findings.

## Core Steps
1. Read `requirements.md` → collect all FR/AC IDs.
2. Read `architecture.md` → evaluate all 6 dimensions.
3. Cross-check `backend/src/db/init.ts` for migration safety and convention drift (Grep).
4. Classify findings: CRITICAL (blocks) / WARNING (note) / INFO.
5. Decide verdict; write `design-review.md`; update `/memories/session/phase-03-state.md`.
6. Print gate message with the verdict.

## Output — `design-review.md` structure
`## Verdict: APPROVED | REJECTED` → Review Summary table (6 dimensions PASS/FAIL + findings) →
Detailed Findings (CRITICAL / WARNING / INFO, each with dimension + description + suggested fix) →
Traceability Verification → Security Sign-off (per OWASP category) → Reviewer Notes for Stage 4/5.

## Gate Message
```
✅ STAGE 3 COMPLETE — Design Review
📄 Artifact: design-review.md
📊 Verdict: <APPROVED|REJECTED> · CRITICAL <c> · WARNING <w>
🎯 Next: <Stage 4 (if APPROVED) | Stage 2 rework (if REJECTED)>
⏸️  GATE: Review design-review.md → approve / reject
```

## Notes
- The verdict string must literally contain `APPROVED` or `REJECTED` (gate detection depends on it).
- Detailed rubric: `.claude/instructions/phase-03-design-review.instructions.md`.
