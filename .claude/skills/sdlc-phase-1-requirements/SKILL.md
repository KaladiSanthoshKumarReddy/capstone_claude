---
name: sdlc-phase-1-requirements
description: >
  SDLC Stage 1 — Requirements Engineering for the Capstone Item Manager. Reads user-story.md
  (and linked Jira/Confluence when available), asks clarifying questions, then writes
  requirements.md with ≥10 FRs, ≥3 NFRs, ≥15 testable acceptance criteria and a traceability
  matrix. Use for "run stage 1", "gather requirements", "write requirements.md".
---

# Skill: Stage 1 — Requirements Engineering

## Purpose
Turn a raw user story into a precise, testable `requirements.md` that is the contract for every
later stage. Requirements always take precedence over architecture and plan if they ever conflict.

## Prerequisites
- `user-story.md` exists (primary input), OR a Jira key / Confluence page / pasted requirement text.

## Clarify-First Protocol (capstone Step 1)
Before writing requirements, scan the user story for ambiguity and **ask the human targeted
clarifying questions** (max ~5). Only proceed once answered or explicitly told to assume.
Typical clarifications for this app:
- Scope: which entities/fields are affected (items: id, title, description, status, tags, timestamps)?
- Auth scope: is the feature per-user (JWT) or global? (default: per-user)
- Limits: pagination, max records, file size, rate limits?
- Non-functional: performance target, browser support, accessibility level?
- Out-of-scope: what should this explicitly NOT do?
Record answers under an "Assumptions" or "Clarifications" section.

## Input Sources (in order)
1. `user-story.md` — always read first.
2. Jira key/URL referenced in the story → fetch via GitHub/Jira MCP or ask user to paste.
3. Confluence page referenced → fetch via MCP or ask user to paste.

## Gate Criteria — PASS (all must hold)
1. `requirements.md` exists and is non-empty.
2. ≥ 10 numbered Functional Requirements written as "The system SHALL…".
3. ≥ 3 Non-Functional Requirements (performance, security, usability…).
4. ≥ 15 testable Acceptance Criteria in Given/When/Then form.
5. Every FR maps to ≥ 1 AC; every AC traces back to ≥ 1 FR (traceability matrix present).
6. Scope section lists in-scope AND out-of-scope items.
7. No vague criteria ("fast", "user-friendly") and no `[TODO]`/placeholder text.

## Gate Criteria — FAIL
- < 10 FRs, or < 15 ACs, or ACs not testable.
- Missing scope/out-of-scope, missing traceability, unresolved ambiguities not captured as assumptions.
- Remediation: re-run this skill after answering clarifying questions / filling gaps.

## Core Steps
1. Read `user-story.md` (and linked sources); extract goal, actors, ACs, technical notes.
2. Ask clarifying questions (Clarify-First Protocol); wait for answers.
3. Derive Functional Requirements (`FR-01…`), Non-Functional Requirements (`NFR-01…`).
4. Convert every AC into `AC-01…` Given/When/Then, testable, tied to an FR.
5. Define scope, constraints (stack: React/Express/SQLite/JWT), and assumptions.
6. Build the FR↔AC traceability matrix.
7. Write `requirements.md`; validate counts (≥10 FR, ≥3 NFR, ≥15 AC).
8. Update `/memories/session/phase-01-state.md` and print the gate message.

## Output — `requirements.md` structure
`# Requirements — <Feature>` → Feature Overview → Functional Requirements (table) →
Non-Functional Requirements (table) → Acceptance Criteria (grouped by FR, G/W/T) →
Clarifications/Assumptions → Out of Scope → Traceability Matrix (AC↔FR↔Test TBD).

## Gate Message
```
✅ STAGE 1 COMPLETE — Requirements
📄 Artifact: requirements.md
📊 <N> FRs · <M> NFRs · <K> ACs
🎯 Next: Stage 2 — Architecture
⏸️  GATE: Review requirements.md → approve / reject
```

## Notes
- Do NOT design solutions or name files here — that is Stage 2 ("what", not "how").
- Detailed extraction technique: `.claude/instructions/phase-01-requirements.instructions.md`.
