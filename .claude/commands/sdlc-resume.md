---
description: Resume the SDLC pipeline from the current state — skips completed stages automatically
---

Inspect all pipeline artifacts on disk (via the `sdlc-gate-check` skill) to determine the furthest completed stage, then resume from the next incomplete stage. Special cases: if `design-review.md` = REJECTED, the next action is re-running Stage 2; if `verification-report.md` = FAIL, re-run Stage 7 (or Stage 5/6 to fix). Print a brief "Resuming from Stage N" message and the status table before invoking the stage agent. After the stage completes, print the gate message and STOP.

Template: `.claude/prompts/resume-from-gate.prompt.md`. Useful when returning to a run after closing the session.
