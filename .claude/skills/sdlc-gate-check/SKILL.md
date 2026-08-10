---
name: sdlc-gate-check
description: >
  Inspect the workspace to determine the current SDLC stage and recommend the next action,
  without executing any stage. Use for "sdlc status", "which stage are we on", "check the
  pipeline gate", or before resuming a pipeline. Read-only detection + gate verdict.
---

# Skill: SDLC Gate Check

## Purpose
A lightweight, read-only inspector. It answers "where are we in the pipeline and what is the
next legal action?" without running a stage. The orchestrator uses it before routing.

## Detection Steps
1. `Glob` for each artifact and record present/absent:
   - `user-story.md`
   - `requirements.md` → Stage 1 done
   - `architecture.md` → Stage 2 done
   - `design-review.md` → read verdict: `APPROVED` (Stage 3 done) vs `REJECTED` (loop to Stage 2)
   - `impl-plan.md` → Stage 4 done
   - Code diff in `backend/src/**` or `frontend/src/**` vs `impl-plan.md` mtime → Stage 5 done
   - `verification-report.md` → read verdict `PASS`/`FAIL` (Stage 7)
   - `CHANGELOG.md` (has an `[Unreleased]` entry) + `sdlc-report.html` → Stage 8 done
2. Apply objective gate rules from `.claude/instructions/gate-validation-checklist.md`.
3. Compute the next incomplete stage.

## Gate Verdict per Stage
For each stage, output one of:
- **PASS** — artifact exists AND all objective checks satisfied → next stage unlocked
- **FAIL** — artifact exists but a required check fails → stage must be re-run
- **BLOCKED** — required input artifact missing → cannot start this stage yet

## Special Detections
- `design-review.md` contains `REJECTED` → print `⚠️ Design rejected — next action is re-run Stage 2`.
- `impl-plan.md` exists but no code diff → `Ready for Stage 5 implementation`.
- `verification-report.md` contains `FAIL` → `Stage 7 failed — re-run Stage 7 (or Stage 5/6 for fixes)`.

## Output Format
```
SDLC Pipeline Status — Capstone Item Manager
| Stage | Name              | Artifact              | Status |
|-------|-------------------|-----------------------|--------|
| 1     | Requirements      | requirements.md       | ✅ DONE |
| 2     | Architecture      | architecture.md       | ✅ DONE |
| 3     | Design Review     | design-review.md      | ▶ NEXT |
| 4     | Impl Plan         | impl-plan.md          | ⏳ PENDING |
| 5     | Implementation    | backend/ + frontend/  | ⏳ PENDING |
| 6     | Code Review       | (in conversation)     | ⏳ PENDING |
| 7     | Verification      | verification-report.md| ⏳ PENDING |
| 8     | PR & Release      | CHANGELOG + report    | ⏳ PENDING |

Next action: <run /sdlc-approve | run /sdlc-stage3 | fix Stage 2 (REJECTED)>
```

## Rules
- **Read-only.** Never write files or run a stage from this skill.
- Never fabricate a status — every row must be backed by an actual `Glob`/`Read` result.
