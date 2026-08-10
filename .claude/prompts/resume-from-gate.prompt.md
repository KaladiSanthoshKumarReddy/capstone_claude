# Prompt Template: Resume From Gate

Use this template to resume the pipeline after an interruption (new session, closed chat).

## Prompt
Resume the Capstone Item Manager SDLC pipeline from where it left off.

1. Detect existing artifacts (use `Glob`/`Read`; do not assume):
   `user-story.md`, `requirements.md`, `architecture.md`, `design-review.md` (read verdict),
   `impl-plan.md`, code diffs in `backend/src`/`frontend/src`, `verification-report.md`,
   `CHANGELOG.md`, `sdlc-report.html`.
2. Read `/memories/session/sdlc-gate-state.md` if present for the last recorded state.
3. Identify the last completed stage and its gate verdict.
4. Determine the next legal action:
   - If `design-review.md` = REJECTED → next action is re-run Stage 2.
   - If `verification-report.md` = FAIL → next action is re-run Stage 7 (or Stage 5/6 to fix).
   - Otherwise → next incomplete stage.
5. Print the status table (all 8 stages ✅/▶/⏳) and the exact command to continue
   (e.g. `/sdlc-approve` or `/sdlc-stageN`).
6. STOP — do not execute the next stage until the human confirms.

## Required Output
The 8-stage status table + a one-line "Next action" recommendation. Do not run a stage automatically.
