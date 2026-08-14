---
name: sdlc-phase-7-verify
description: >
  SDLC Stage 7 — Verification for the Capstone Item Manager. Writes deterministic Playwright E2E
  tests + Vitest unit tests covering every AC, runs them against the live app, performs a
  content-quality check of the artifacts, and writes verification-report.md with REAL results only.
  Use for "run stage 7", "write tests", "verify the feature".
---

# Skill: Stage 7 — Verification

## Purpose
Prove the feature works: verify the CODE (unit + integration/E2E) AND the OUTPUT DOCUMENTS
(content-quality check). Every reported number must come from an actual test run — never fabricated.

## Prerequisites
- `requirements.md` (AC list), `design-review.md` = APPROVED, Stage 5 implemented.
- App running: `curl -s http://localhost:4000/api/health` → `{"success":true}`; frontend on :3000.

## Test Rules
- One spec per feature: `tests/e2e/specs/<feature>.spec.ts`; do not rewrite existing specs.
- Selector preference: `getByTestId` > `getByRole` > `getByLabel`; never CSS class selectors.
- Waiting: `waitFor({state:'visible'})` / `waitForURL(...)`; NEVER `waitForTimeout`.
- Reuse helpers in `tests/e2e/helpers/auth.ts` and page objects in `tests/e2e/pages/`.
- Label each test with its AC: `test('AC-01: ...', ...)`. Cover happy path AND edge/'Not Found' cases.
- Unit-test pure logic (e.g. CSV serialization) with Vitest in `frontend/`.

## Content-Quality Check (capstone Step 7 — the output document)
Verify the produced artifact(s)/output for quality, not just that code runs:
- Correct headers/columns/format (e.g. CSV headers `id,title,description,status,created_at,updated_at`).
- No secrets or cross-user data leakage in output.
- Handles empty/edge inputs gracefully (e.g. empty list exports headers only).
Record results under a "Content Quality" section of the report.

## Run
```
cd tests && npx playwright test --reporter=list 2>&1
cd frontend && npm run test 2>&1
```
Capture the ACTUAL output verbatim.

## Gate Criteria
- **PASS**: 100% AC coverage (every AC → ≥ 1 test), all tests green, content-quality checks pass,
  report numbers match runner output, zero `waitForTimeout`.
- **FAIL**: any uncovered AC, any failing test, or fabricated/placeholder results.

## Core Steps
1. Read all ACs. 2. Confirm app is up. 3. Reuse/extend page objects + helpers. 4. Write E2E + unit tests.
5. Run both suites; capture output. 6. Run content-quality checks. 7. Write `verification-report.md`
   (real results). 8. Update `/memories/session/phase-07-state.md`; print gate message.

## Output — `verification-report.md` structure
Test Run Summary (suite/total/pass/fail/skip + real date + duration) → AC Traceability
(AC↔spec↔test↔result) → Content Quality → Gap Analysis (must be empty for PASS) → Failed Tests
(with real error output) → Verdict (PASS/FAIL).

## Gate Message
```
✅ STAGE 7 COMPLETE — Verification
📄 Artifact: verification-report.md
📊 Verdict: <PASS|FAIL> · AC coverage <x>/<y> · E2E <p>/<t> · Unit <p>/<t>
🎯 Next: Stage 8 — PR & Release
⏸️  GATE: Review verification-report.md → approve / continue / proceed  ·  reject / rework / redo
```

## Notes
- Stage 7 OWNS `tests/e2e/**`. Detailed guidance: `.claude/instructions/phase-07-verify.instructions.md`.
