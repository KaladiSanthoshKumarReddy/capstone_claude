---
description: Approve the current pipeline gate and advance to the next stage
---

The current pipeline stage has been reviewed and is APPROVED. Advance to the next stage: invoke the appropriate stage agent, run it to completion, validate it against the matching gate in `.claude/instructions/gate-validation-checklist.md`, then print the gate message for that stage and STOP. Do not run more than one stage per approval. Update `/memories/session/sdlc-gate-state.md` with the new current stage.
