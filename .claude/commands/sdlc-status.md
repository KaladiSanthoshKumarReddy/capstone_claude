---
description: Show the current SDLC pipeline status — which stages are done, which is next, which are pending
---

Check which pipeline artifact files exist on disk:
- requirements.md → Stage 1 done?
- architecture.md → Stage 2 done?
- design-review.md (and its verdict) → Stage 3 done?
- impl-plan.md → Stage 4 done?
- Any new files in backend/src/ or frontend/src/ since last commit → Stage 5 done?
- verification-report.md → Stage 7 done?
- CHANGELOG.md → Stage 8 done?

Print a clear status table:

| Stage | Name | Status |
|-------|------|--------|
| 1 | Requirements | ✅ DONE / ▶ NEXT / ⏳ PENDING |
...

Then state the exact next action (e.g. "Run /sdlc-approve to advance to Stage 4", or "Design REJECTED — re-run Stage 2").

Use the `sdlc-gate-check` skill (`.claude/skills/sdlc-gate-check/SKILL.md`) and the objective criteria in `.claude/instructions/gate-validation-checklist.md`. This command is READ-ONLY — do not run any stage.
