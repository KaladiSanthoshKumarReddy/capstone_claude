# Prompt Template: Phase Execution

Use this template to execute exactly one SDLC stage end-to-end, then stop at the gate.

## Variables
- `{{STAGE}}` — stage number (1–8)
- `{{AGENT}}` — the stage agent (e.g. `sdlc-stage5-implementation`)
- `{{INPUT}}` — the input artifact(s) for the stage
- `{{OUTPUT}}` — the output artifact(s) the stage must produce

## Prompt
Execute Stage {{STAGE}} of the Capstone Item Manager SDLC pipeline using agent {{AGENT}}.

1. Read the input artifact(s) {{INPUT}} and the matching
   `.claude/instructions/phase-0{{STAGE}}-*.instructions.md`.
2. Follow the global policy in `.claude/instructions/sdlc-global.instructions.md`.
3. Produce {{OUTPUT}} making the **minimum correct change** — do not scope-creep into other stages.
4. Validate against the stage gate in `.claude/instructions/gate-validation-checklist.md`.
5. Update `/memories/session/phase-0{{STAGE}}-state.md`.
6. Print the stage gate message and STOP.

## Rules
- Do exactly one stage. Never auto-advance to the next.
- Respect stage isolation (Stage 5 never edits `tests/e2e/**`; Stage 7 owns tests).
- Never fabricate results — every metric comes from a real tool run.

## Required Output
The stage artifact(s) + the gate message. Nothing else.
