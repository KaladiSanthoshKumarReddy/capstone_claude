---
name: sdlc-orchestrator
description: >
  Single entry point for the 8-stage AI SDLC pipeline of the Capstone Item Manager app.
  Detects pipeline state from artifacts, routes to the correct stage, enforces human gates,
  and never auto-advances. Use when the user says "run the SDLC pipeline", "start SDLC",
  "resume SDLC", "what stage are we on", "@sdlc", or "sdlc status".
---

# Skill: SDLC Orchestrator

## Purpose
Manage the end-to-end 8-stage SDLC pipeline as a single controller. Detect which stage the
project is in, delegate execution to the matching stage agent/skill, print an explicit human
gate, and BLOCK until the human approves or rejects. This skill owns pipeline *routing and
state* — it never writes feature code, requirements, or tests itself.

## App Context (fixed for this repo)
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS (`frontend/`)
- Backend: Node.js + Express 4 + TypeScript (`backend/`)
- Database: SQLite via `@libsql/client` (`backend/src/db/init.ts`)
- Auth: JWT (8h expiry, localStorage), `backend/src/middleware/auth.ts`
- Tests: Playwright E2E (`tests/e2e/`) + Vitest unit (`frontend/`)

## Artifact → Stage Map (state detection)
| Artifact present | Meaning |
|------------------|---------|
| `user-story.md` | Ready to start Stage 1 |
| `requirements.md` | Stage 1 complete |
| `architecture.md` | Stage 2 complete |
| `design-review.md` containing `APPROVED` | Stage 3 complete (approved) |
| `design-review.md` containing `REJECTED` | Stage 3 rejected → loop back to Stage 2 |
| `impl-plan.md` | Stage 4 complete |
| Changes in `backend/src/` or `frontend/src/` newer than `impl-plan.md` | Stage 5 complete |
| Stage 6 review reported PASS (in conversation) | Stage 6 complete |
| `verification-report.md` containing `PASS` | Stage 7 complete |
| `CHANGELOG.md` updated + `sdlc-report.html` present | Stage 8 complete |

## Supported Invocations
| Command | Action |
|---------|--------|
| `/sdlc-start` or "run the SDLC pipeline" | Detect state, run the next incomplete stage, then gate |
| `/sdlc-status` or "what stage are we on" | Print the gate status table only (no stage execution) |
| `/sdlc-resume` or "resume SDLC" | Auto-advance to the next incomplete stage, run it, then gate |
| "resume from stage N" | Jump to Stage N after verifying prerequisites exist |
| `/sdlc-approve` (approve / continue / proceed) | Advance to next stage, run it, then gate |
| `/sdlc-reject` (reject / rework / redo) | Re-run current stage with feedback, then gate |

## Core Steps (every invocation)
1. Use `Glob` to detect every artifact in the Artifact→Stage map.
2. Read `design-review.md` (if present) and check for `APPROVED` vs `REJECTED`.
3. Determine the current stage and the next incomplete stage.
4. Print the **status table** (all 8 stages: ✅ DONE / ▶ NEXT / ⏳ PENDING).
5. Announce the stage about to run, then invoke the matching stage agent
   (`subagent_type: "sdlc-stageN-*"`).
6. After the stage agent reports completion, print the **gate message** and STOP.
7. Update session state (`/memories/session/sdlc-gate-state.md`) and append to
   `/memories/session/orchestrator-log.md`.

## Gate Message Format
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GATE: Stage N — [Stage Name]
Status: COMPLETE — awaiting human review
Artifact: [file(s)]  |  Key metric: [e.g. 12 FRs / 18 ACs]

Review the artifact above. Then:
  • approve / continue / proceed  → advance to Stage N+1
  • reject / rework / redo        → re-run Stage N with feedback
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Non-Negotiable Rules
1. **Never auto-advance.** One stage per approval. Always stop at the gate.
2. **Explicit approval only.** Accept `approve` / `continue` / `proceed` to advance.
3. **Reject → rework.** `reject` / `rework` / `redo` re-runs the *current* stage.
4. **Stage 3 special case.** If `design-review.md` = `REJECTED`, route back to Stage 2
   (not Stage 4), passing the rejection findings as input.
5. **Invalid input.** Any non-keyword input at a gate → re-print the gate and wait.
6. **No fabrication.** Never invent test counts, metrics, or file states — always verify
   with tools first.

## Session State Schema (`/memories/session/sdlc-gate-state.md`)
```yaml
---
last_updated: <ISO timestamp>
current_stage: 3
gate_status: BLOCKED_AWAITING_APPROVAL   # or RUNNING | COMPLETE
last_gate_verdict: PASS                   # PASS | REJECTED
next_stage: 4
pipeline_status: PAUSED_AT_GATE_3         # or COMPLETE
blockers: []
---
```

## Notes
- Detailed per-stage rules live in `.claude/instructions/phase-0N-*.instructions.md`.
- Objective gate rules live in `.claude/instructions/gate-validation-checklist.md`.
- Global policy (secrets, SQL safety, OWASP, no-fabrication) lives in
  `.claude/instructions/sdlc-global.instructions.md`.
