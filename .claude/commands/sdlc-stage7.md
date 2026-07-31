---
description: Run Stage 7 — Verification (writes Playwright E2E tests, runs them, writes verification-report.md)
---

Invoke the sdlc-stage7-verify agent. First check that the backend (http://localhost:4000/api/health) and frontend (http://localhost:3000) are running. Write Playwright E2E tests in tests/e2e/specs/ covering every AC from requirements.md. Run the tests and write verification-report.md with real (not fabricated) pass/fail counts. After writing, print the Stage 7 gate message and STOP.
