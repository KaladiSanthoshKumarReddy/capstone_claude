---
description: Run Stage 3 — Design Review (adversarial audit of architecture.md, writes design-review.md)
---

Invoke the sdlc-stage3-design-review agent. Perform an adversarial review of architecture.md across 6 dimensions: FR coverage, API contracts, DB migration safety, OWASP Top 10, coding conventions, and document completeness. Write design-review.md with an APPROVED or REJECTED verdict. After writing, print the Stage 3 gate message and STOP. If REJECTED, list the blocking findings clearly.
