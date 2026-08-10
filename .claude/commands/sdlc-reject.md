---
description: Reject the current pipeline stage and re-run it with feedback
---

The current pipeline stage output is REJECTED. Convert the user's feedback (and any CRITICAL findings) into concrete rework tasks, then re-run the same stage agent addressing every item — changing only what the feedback requires. Special case: if Stage 3 design review is REJECTED, re-run Stage 2 (architecture) with the findings, then re-run Stage 3 to re-evaluate. After re-running, print the gate message again and STOP. Do not advance until the user explicitly approves.

Template: `.claude/prompts/reject-rework-loop.prompt.md`.
