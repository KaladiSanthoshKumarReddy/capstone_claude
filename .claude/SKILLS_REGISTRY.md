# SDLC Registry — Capstone Item Manager (Claude Code)

Quick reference for the complete `.claude/` AI SDLC pipeline: agents, skills, commands,
instructions, prompts, hooks, and templates. All are Claude Code format and app-specific to the
Item Manager (React + Express + SQLite + JWT; Playwright + Vitest).

## 🎯 Entry Points (Commands)
| Command | Purpose |
|---------|---------|
| `/sdlc-start` | Detect state, run the next incomplete stage, then gate |
| `/sdlc-status` | Print the 8-stage gate table (no execution) |
| `/sdlc-resume` | Auto-advance to the next incomplete stage, run it, then gate |
| `/sdlc-approve` | Approve current gate → run next stage → gate |
| `/sdlc-reject` | Reject current gate → re-run current stage with feedback |
| `/sdlc-stage1` … `/sdlc-stage8` | Run a specific stage directly |

## 🤖 Agents (`.claude/agents/`) — execution layer
| Agent | Stage | Output |
|-------|-------|--------|
| `sdlc-orchestrator` | control | routes stages, enforces gates |
| `sdlc-stage1-requirements` | 1 | `requirements.md` |
| `sdlc-stage2-architecture` | 2 | `architecture.md` |
| `sdlc-stage3-design-review` | 3 | `design-review.md` (APPROVED/REJECTED) |
| `sdlc-stage4-impl-plan` | 4 | `impl-plan.md` |
| `sdlc-stage5-implementation` | 5 | code in `backend/` + `frontend/` |
| `sdlc-stage6-review` | 6 | review report + safe fixes |
| `sdlc-stage7-verify` | 7 | tests + `verification-report.md` |
| `sdlc-stage8-pr` | 8 | `CHANGELOG.md` + `sdlc-report.html` + PR |

## 🧠 Skills (`.claude/skills/`) — reusable gate criteria + core steps
`sdlc-orchestrator`, `sdlc-gate-check`, and `sdlc-phase-1` … `sdlc-phase-8`.
Each skill documents PASS/FAIL gate criteria, core steps, output structure, and session state.

## 📖 Instructions (`.claude/instructions/`) — deep how-to reference
`sdlc-global.instructions.md`, `gate-validation-checklist.md`, `README.md`, and
`phase-01` … `phase-08` instruction files (Phase 5 is the deepest — full coding standards).

## 🧩 Prompts (`.claude/prompts/`) — reusable invocation templates
`gate-review`, `phase-execution`, `reject-rework-loop`, `resume-from-gate`.

## 🪝 Hooks (`.claude/settings.json`)
- **SessionStart** — prints pipeline status banner.
- **PreToolUse** — blocks writing/editing `.env`; blocks destructive Bash (DROP/TRUNCATE/force-push/reset --hard).
- **PostToolUse** — prints gate reminder after an artifact is written.

## 📄 Templates (`.claude/templates/`)
`sdlc-report-template.html` — self-contained HTML report filled by Stage 8.

## 🚦 Gate Sequence (blocks between every stage)
```
1 Requirements → 2 Architecture → 3 Design Review → 4 Impl Plan →
5 Implementation → 6 Code Review → 7 Verification → 8 PR & Release
```
Every stage STOPS at a human gate. Advance with `approve/continue/proceed`; rework with
`reject/rework/redo`. Stage 3 `REJECTED` loops back to Stage 2.

## 🗂️ Session State (`/memories/session/`)
- `sdlc-gate-state.md` — master current-stage + verdict.
- `phase-01-state.md` … `phase-08-state.md` — per-stage state.
- `orchestrator-log.md` — timestamped transition log.

## ✅ Capstone 8-Step Coverage
| Capstone Step | Stage | Key guarantee |
|---------------|-------|---------------|
| 1 Requirements | 1 | Clarify-first questions + ≥10 FR / ≥15 AC |
| 2 Architecture | 2 | Diagrams, DB diff, API contracts, ADRs |
| 3 Design Review | 3 | 6-dimension adversarial audit, explicit verdict |
| 4 Impl Planning | 4 | Dependency-ordered tasks + blocked-task flags |
| 5 Implementation | 5 | Full coding standards, tsc-verified per task |
| 6 Review | 6 | 7-area checklist + safe auto-fixes |
| 7 Verify | 7 | Real tests + output content-quality check |
| 8 PR | 8 | PR with Summary/Changes/Test Evidence/Known Limitations/Reviewer Checklist |

**Version**: 2.0 · **Last updated**: 2026-08-10
