---
description: Stage 8 detailed how-to — CHANGELOG, HTML report, and Pull Request construction for the Capstone Item Manager.
appliesTo: Stage 8 (PR & Release)
---

# Phase 8 — PR & Release (Detailed)

## Objective
Close the agentic SDLC loop: write release docs and open a production-ready GitHub PR whose
description contains all five mandatory capstone sections.

## Precondition
`verification-report.md` verdict = `PASS`. If not → STOP: "Stage 8 blocked: verification not PASS."

## Inputs
- `requirements.md`, `architecture.md`, `impl-plan.md`, `verification-report.md`.
- `git diff main --name-only` (changed files); `git log main..HEAD --oneline` (commits).
- Real test numbers from `verification-report.md` (no placeholders anywhere).

## Step A — CHANGELOG.md (prepend `[Unreleased]` entry)
```
## [Unreleased] — <Feature>
### Added
- <user-facing capabilities>
### Changed
- <modified behaviors>
### Technical
- <DB migrations, API changes>
### Testing
- E2E: <p>/<t> passing · Unit: <p>/<t> passing · AC coverage: <x>/<y>
```
Use REAL numbers from the verification report.

## Step B — sdlc-report.html
Generate from `.claude/templates/sdlc-report-template.html`, substituting every `{{PLACEHOLDER}}`
with real values: FR/AC counts, per-stage pipeline table with gate verdicts, test results block,
review findings, changed files, ADR summaries, timestamp. Self-contained (inline CSS), no `[TODO]`.

## Step C — Pull Request (all 5 sections mandatory)
1. **Summary** — 2–3 sentences: what was built and why.
2. **Changes Made** — bulleted `path/file — reason` for every added/modified file.
3. **Test Evidence** — pasted real test-run output (or CI link) + pass counts + AC coverage.
4. **Known Limitations** — 'Not Found' items, assumptions, out-of-scope.
5. **Reviewer Checklist** — tick-list (requirements met; security; error handling; tests/edge cases;
   no unjustified deps). Also include the 8-row SDLC pipeline status table.

## Step D — Open the PR
```
gh pr create --title "feat: <Feature>" --body "<body>"
```
If `gh` is unauthenticated or fails, print the full PR body and instruct the user to open it manually.
Use a conventional-commit title prefix (`feat:`, `fix:`, `chore:`…).

## Do / Do NOT
**Do:** use real numbers; include all 5 PR sections; keep the report self-contained.
**Do NOT:** fabricate metrics/URLs; force-push; open the PR before verification PASS.

## Gate (see gate-validation-checklist.md → Gate 8)
PASS = CHANGELOG entry (real numbers) + complete `sdlc-report.html` + PR opened (or body printed)
with all 5 required sections.
