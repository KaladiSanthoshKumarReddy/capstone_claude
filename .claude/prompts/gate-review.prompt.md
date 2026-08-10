# Prompt Template: Gate Review

Use this template to make an objective PASS / FAIL / BLOCKED decision at any SDLC gate.

## Variables
- `{{STAGE}}` — stage number (1–8)
- `{{ARTIFACT}}` — expected artifact for the stage
- `{{CHECKLIST}}` — the matching section of `.claude/instructions/gate-validation-checklist.md`

## Prompt
You are the SDLC gate reviewer for Stage {{STAGE}} of the Capstone Item Manager.

1. Confirm the artifact `{{ARTIFACT}}` exists and is non-empty (use tools; do not assume).
2. Evaluate each required check in {{CHECKLIST}} and mark it PASS or FAIL with concrete evidence
   (counts, file sections, tool output) — never a subjective "looks good".
3. List the evidence reference for each check.
4. Decide the gate verdict:
   - **PASS** — all required checks satisfied.
   - **FAIL** — one or more checks fail (state which).
   - **BLOCKED** — required input artifact missing.
5. If FAIL/BLOCKED, list the exact remediation steps.

## Required Output
```
Stage: {{STAGE}}
Artifact status: PRESENT | MISSING
Checks:
  - <check> : PASS/FAIL — <evidence>
Verdict: PASS | FAIL | BLOCKED
Next action: <advance on approval | re-run stage | provide missing input>
```
Then print the human gate message and STOP — do not advance without explicit approval.
