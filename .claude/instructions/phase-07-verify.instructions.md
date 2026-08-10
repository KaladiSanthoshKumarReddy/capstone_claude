---
description: Stage 7 detailed how-to — test authoring, execution, and content-quality verification for the Capstone Item Manager.
appliesTo: Stage 7 (Verification)
---

# Phase 7 — Verification (Detailed)

## Objective
Prove the feature works with REAL evidence: verify the CODE (Playwright E2E + Vitest unit) AND the
OUTPUT DOCUMENT (content-quality check). Never fabricate any result.

## Preconditions
- `requirements.md` (AC list) and `design-review.md` = APPROVED.
- App is running: `curl -s http://localhost:4000/api/health` → `{"success":true}`; frontend on :3000.
  If not up → STOP: "Stage 7 blocked: start the app with `npm run dev`."

## E2E Test Authoring Rules
- One spec per feature: `tests/e2e/specs/<feature>.spec.ts`. Extend with `test.describe`, don't rewrite existing specs.
- Reuse `tests/e2e/helpers/auth.ts` (`registerUser`, `loginViaApi`, `clearAuth`) and `tests/e2e/pages/*`.
- **Selectors**: `getByTestId` > `getByRole({name})` > `getByLabel`. Never CSS class selectors.
- **Waiting**: `await el.waitFor({ state:'visible' })`, `await page.waitForURL(...)`. NEVER `waitForTimeout`.
- Label each test with its AC: `test('AC-01: <desc>', ...)`. Cover happy path AND edge/'Not Found'/empty.
- Structure:
  ```ts
  test.describe('Feature — <name>', () => {
    test.beforeEach(async ({ page }) => { await registerUser(page, USER.email, USER.password); await loginViaApi(page, USER.email, USER.password) })
    test('AC-01: <desc>', async ({ page }) => { /* ... */ })
  })
  ```

## Unit Test Rules (Vitest)
- Unit-test pure logic (e.g. CSV serialization/escaping) under `frontend/src/**/__tests__`.
- Cover: normal rows, empty list (headers only), fields containing commas/quotes/newlines.

## Run & Capture (verbatim)
```
cd tests && npx playwright test --reporter=list 2>&1
cd frontend && npm run test 2>&1
```
Use the actual counts/timings from this output — never invent them.

## Content-Quality Check (capstone Step 7 — the output document)
Beyond "tests pass", verify the produced output/document quality:
- Correct headers/columns/format (CSV: `id,title,description,status,created_at,updated_at`).
- No secrets and no cross-user data in the output.
- Graceful edge behavior (empty export = headers only; special characters escaped).
Record under a **Content Quality** section with concrete observations.

## Output (`verification-report.md`)
Test Run Summary (suite/total/pass/fail/skip + real date + duration) → AC Traceability
(AC↔spec↔test↔result, must be 100%) → Content Quality → Gap Analysis (empty for PASS) → Failed
Tests (real error text) → Verdict (PASS/FAIL).

## Gate (see gate-validation-checklist.md → Gate 7)
PASS = 100% AC coverage, all tests green, content-quality checks pass, numbers match runner output,
no `waitForTimeout`, nothing fabricated.
