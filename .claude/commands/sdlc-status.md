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

Then state what the next action is (e.g. "Run /sdlc-approve to advance to Stage 4").
