---
description: Resume the SDLC pipeline from the current state — skips completed stages automatically
---

Inspect all pipeline artifacts on disk to determine the furthest completed stage, then resume from the next incomplete stage. Print a brief "Resuming from Stage N" message before invoking the stage agent. After the stage completes, print the gate message and STOP.

Useful when returning to a pipeline run after closing the session.
