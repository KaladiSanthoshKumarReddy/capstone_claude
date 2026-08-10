---
name: sdlc-phase-8-pr
description: >
  SDLC Stage 8 — PR & Release for the Capstone Item Manager. Reads all pipeline artifacts, writes a
  CHANGELOG.md entry and a self-contained sdlc-report.html, and opens a GitHub PR whose description
  contains Summary, Changes Made, Test Evidence, Known Limitations, and Reviewer Checklist. Use for
  "run stage 8", "create the PR", "finalize the release".
---

# Skill: Stage 8 — PR & Release

## Purpose
Close the agentic SDLC loop: summarize the feature across all artifacts, produce release docs, and
open a production-ready Pull Request via the GitHub CLI.

## Prerequisites
- `verification-report.md` verdict = `PASS`. If not, STOP: "Stage 8 blocked: verification not PASS."
- `requirements.md`, `architecture.md`, `impl-plan.md`, `verification-report.md` all present.

## Pre-Reads
- `git diff main --name-only` (changed files) and `git log main..HEAD --oneline` (commits).
- Real test numbers from `verification-report.md` (no placeholders anywhere).

## Gate Criteria — PASS
1. `CHANGELOG.md` has a new `[Unreleased] — <Feature>` entry with real test numbers.
2. `sdlc-report.html` exists, self-contained, no `[TODO]`/placeholder text, real metrics.
3. PR opened (or PR body printed for manual open if `gh` unauthenticated) containing ALL five
   required sections below.

## Required PR Description Sections (capstone Step 8 — all mandatory)
1. **Summary** — 2–3 sentence overview of what was built and why.
2. **Changes Made** — bulleted list of every file added/modified + the reason.
3. **Test Evidence** — pasted test-run output (or CI link) from `verification-report.md`.
4. **Known Limitations** — anything marked 'Not Found', assumptions, or out-of-scope items.
5. **Reviewer Checklist** — tick-list the reviewer completes before approving.

## Core Steps
1. Confirm `verification-report.md` = PASS.
2. Prepend CHANGELOG entry (Added / Changed / Technical / Testing with real numbers).
3. Generate `sdlc-report.html` from `.claude/templates/sdlc-report-template.html`, filling every
   `{{PLACEHOLDER}}` from real artifacts (FR/AC counts, test results, pipeline table, changed files, ADRs).
4. Build the PR body with the 5 mandatory sections + pipeline status table.
5. `gh pr create --title "feat: <Feature>" --body "<body>"`; if unauthenticated, print body + instruct manual open.
6. Update `/memories/session/phase-08-state.md`; print completion.

## PR Body Template
```
## Summary
<2–3 sentences>

## Changes Made
- `path/file` — <reason>

## Test Evidence
```<paste real test output>```
- Playwright E2E: <p>/<t> · Vitest Unit: <p>/<t> · AC Coverage: <x>/<y> (100%)

## Known Limitations
- <assumptions / out-of-scope / 'Not Found' items>

## Reviewer Checklist
- [ ] Requirements met (all ACs)
- [ ] Security: no secrets, input validated, parameterized SQL, auth enforced
- [ ] Error handling verified (incl. Not Found / empty)
- [ ] Tests pass locally and cover edge cases
- [ ] No unjustified dependencies

## SDLC Pipeline
| Stage | Artifact | Status |
|-------|----------|--------|
| 1 Requirements | requirements.md | DONE |
| 2 Architecture | architecture.md | DONE |
| 3 Design Review | design-review.md | APPROVED |
| 4 Impl Plan | impl-plan.md | DONE |
| 5 Implementation | backend/ + frontend/ | DONE |
| 6 Code Review | (conversation) | PASS |
| 7 Verification | verification-report.md | PASS |
| 8 PR | this PR | OPEN |

🤖 Generated with Claude Code AI SDLC Pipeline
```

## Completion
`Stage 8 complete — PR opened at <URL> | CHANGELOG + sdlc-report.html written.`

## Notes
- Detailed guidance: `.claude/instructions/phase-08-pr.instructions.md`.
