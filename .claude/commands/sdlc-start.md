---
description: Start the SDLC pipeline from the beginning (or resume from the last completed stage)
---

Run the SDLC orchestrator (`.claude/agents/sdlc-orchestrator.md`, skill `.claude/skills/sdlc-orchestrator/SKILL.md`).

1. Use the `sdlc-gate-check` skill to detect which artifacts exist (`requirements.md`, `architecture.md`, `design-review.md` + verdict, `impl-plan.md`, code diffs, `verification-report.md`, `CHANGELOG.md`/`sdlc-report.html`).
2. Print a pipeline status table showing ✅ DONE / ▶ NEXT / ⏳ PENDING for all 8 stages.
3. Announce and invoke the next incomplete stage agent (one stage only).
4. Apply the matching gate in `.claude/instructions/gate-validation-checklist.md`.
5. Print the gate message and STOP — do not auto-advance. Wait for `approve` or `reject`.

Follow the global policy in `.claude/instructions/sdlc-global.instructions.md` at all times.
