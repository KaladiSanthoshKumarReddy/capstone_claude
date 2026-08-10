---
description: Run Stage 6 — Code Review (adversarial review of Stage 5 code, auto-applies safe fixes)
---

Invoke the sdlc-stage6-review agent. Review all code changes from Stage 5 for CRITICAL issues (compile errors, SQL injection, missing auth, hardcoded secrets, XSS), WARNINGs (missing data-testid, unused imports), and INFO items. Auto-apply safe mechanical fixes. Report PASS or BLOCKED. After the review, print the Stage 6 gate message and STOP.

Evaluate all 7 capstone review areas (correctness, security, error handling, test coverage, code clarity, DRY, dependency safety). See skill `.claude/skills/sdlc-phase-6-review/SKILL.md`, how-to `.claude/instructions/phase-06-review.instructions.md`, and Gate 6 in `.claude/instructions/gate-validation-checklist.md`.
