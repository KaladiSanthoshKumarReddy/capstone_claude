# Prompt Template: Reject / Rework Loop

Use this template when a gate is rejected — especially Stage 3 (design review) REJECTED, which loops
back to Stage 2 (architecture).

## Variables
- `{{STAGE}}` — the stage being reworked
- `{{FINDINGS}}` — the CRITICAL findings / rejection feedback to address
- `{{REWORK_TARGET}}` — which stage to re-run (Stage 3 REJECT → Stage 2; all others → same stage)

## Prompt
A gate was rejected. Perform a targeted rework for the Capstone Item Manager.

1. Collect the rejection feedback {{FINDINGS}} (from `design-review.md` or the human's reject message).
2. Convert each failed check / CRITICAL finding into a concrete rework task, mapped to a specific
   file or artifact section.
3. Re-run {{REWORK_TARGET}} addressing every task — change only what the findings require.
4. Re-validate against `.claude/instructions/gate-validation-checklist.md` for that stage.
5. If {{REWORK_TARGET}} was Stage 2, re-run Stage 3 afterward to re-evaluate the verdict.
6. Print the updated gate message and STOP.

## Rules
- Address every finding; do not silently drop any.
- Do not introduce unrelated changes while reworking.
- Stage 3 REJECTED always loops to Stage 2, never re-runs Stage 3 first.

## Required Output
The revised artifact + a short "Rework applied" list mapping each finding → the fix + the new gate message.
