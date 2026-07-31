---
description: Start the SDLC pipeline from the beginning (or resume from the last completed stage)
---

Run the SDLC orchestrator agent. Check which pipeline artifacts exist (requirements.md, architecture.md, design-review.md, impl-plan.md, verification-report.md), print a pipeline status table showing DONE/NEXT/PENDING for all 8 stages, then invoke the next stage agent. After the stage completes, print the gate message and STOP — do not auto-advance. Wait for the user to type "approve" or "reject".
