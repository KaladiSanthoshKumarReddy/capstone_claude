---
description: Run Stage 3 — Design Review (adversarial audit of architecture.md, writes design-review.md)
---

Invoke the sdlc-stage3-design-review agent. Perform an adversarial review of architecture.md across 6 dimensions: FR coverage, API contracts, DB migration safety, OWASP Top 10, coding conventions, and document completeness. Write design-review.md with an APPROVED or REJECTED verdict. After writing, print the Stage 3 gate message and STOP. If REJECTED, list the blocking findings clearly.

See skill `.claude/skills/sdlc-phase-3-design-review/SKILL.md`, how-to `.claude/instructions/phase-03-design-review.instructions.md`, and Gate 3 in `.claude/instructions/gate-validation-checklist.md`. On REJECTED, the next action is re-running Stage 2.
