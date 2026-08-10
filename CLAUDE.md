# Capstone Claude SDLC — AI Pipeline Instructions

This project demonstrates a complete **8-stage AI-powered SDLC** built on **Claude Code** and the **Claude Agent SDK**. Each stage is driven by a dedicated Claude subagent defined in `.claude/agents/`. Human-in-the-loop gates enforce quality before each stage advances.

## Application

Full-stack CRUD web app — **Capstone Item Manager** — for managing personal items behind JWT authentication.

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend   | Node.js + Express 4 + TypeScript            |
| Database  | SQLite via `@libsql/client`                 |
| Auth      | JWT (8h expiry, localStorage)               |
| Tests     | Playwright (E2E) + Vitest (unit)            |

---

## SDLC Pipeline Overview

```
user-story.md ──► Stage 1 ──► requirements.md
                    │
                    ▼
              Stage 2 ──► architecture.md
                    │
                    ▼
              Stage 3 ──► design-review.md (APPROVED/REJECTED)
                    │
                    ▼
              Stage 4 ──► impl-plan.md
                    │
                    ▼
              Stage 5 ──► Code changes (backend/ + frontend/)
                    │
                    ▼
              Stage 6 ──► Code review + safe fixes
                    │
                    ▼
              Stage 7 ──► tests/e2e/ + verification-report.md
                    │
                    ▼
              Stage 8 ──► CHANGELOG.md + sdlc-report.html + PR
```

Each stage **stops and waits** for explicit human approval before advancing. Type `approve`, `continue`, or `proceed` to advance. Type `reject`, `rework`, or `redo` to send the stage back for revision.

---

## How to Invoke the Pipeline

### Option A — Full Automated Pipeline (Claude Code CLI)

```bash
# Start the full pipeline from user-story.md
claude "Run the SDLC pipeline for the feature in user-story.md"
```

Claude will invoke the `sdlc-orchestrator` agent which checks artifact state and routes to the correct stage automatically.

### Option B — Individual Stage Invocation

Invoke any stage agent directly from Claude Code:

```bash
# Stage 1 — Requirements
claude "Run sdlc-stage1-requirements agent"

# Stage 2 — Architecture
claude "Run sdlc-stage2-architecture agent"

# Stage 3 — Design Review
claude "Run sdlc-stage3-design-review agent"

# Stage 4 — Implementation Plan
claude "Run sdlc-stage4-impl-plan agent"

# Stage 5 — Implementation
claude "Run sdlc-stage5-implementation agent"

# Stage 6 — Code Review
claude "Run sdlc-stage6-review agent"

# Stage 7 — Verification
claude "Run sdlc-stage7-verify agent"

# Stage 8 — PR & Report
claude "Run sdlc-stage8-pr agent"
```

### Option C — Resume from a specific stage

```bash
# Resume from Stage 4 (skipping earlier stages)
claude "Resume SDLC pipeline from Stage 4 — impl-plan.md exists and is approved"
```

---

## Agent Definitions

All agents are in `.claude/agents/`. Each is a self-contained Markdown file with a YAML frontmatter block.

| File | Purpose | Invocation |
|------|---------|-----------|
| `sdlc-orchestrator.md` | Master pipeline controller — detects stage state and delegates | Ask Claude to "run the SDLC pipeline" |
| `sdlc-stage1-requirements.md` | Converts user-story.md → requirements.md (FRs + ACs) | "Run Stage 1 requirements" |
| `sdlc-stage2-architecture.md` | Produces architecture.md (HLD, API contracts, DB schema) | "Run Stage 2 architecture" |
| `sdlc-stage3-design-review.md` | Audits architecture.md → design-review.md (APPROVED/REJECTED) | "Run Stage 3 design review" |
| `sdlc-stage4-impl-plan.md` | Generates impl-plan.md (task list with dependencies) | "Run Stage 4 impl plan" |
| `sdlc-stage5-implementation.md` | Writes code in backend/ and frontend/ from impl-plan.md | "Run Stage 5 implementation" |
| `sdlc-stage6-review.md` | Reviews Stage 5 diff for bugs/security/quality | "Run Stage 6 code review" |
| `sdlc-stage7-verify.md` | Writes E2E tests + verification-report.md | "Run Stage 7 verification" |
| `sdlc-stage8-pr.md` | Creates CHANGELOG.md, sdlc-report.html, opens GitHub PR | "Run Stage 8 PR" |

---

## `.claude/` Pipeline Structure

The pipeline is driven entirely by Claude Code features under `.claude/`, organized in layers:

| Layer | Location | Role |
|-------|----------|------|
| **Commands** | `.claude/commands/*.md` | Human entry points (`/sdlc-start`, `/sdlc-status`, `/sdlc-approve`, `/sdlc-reject`, `/sdlc-resume`, `/sdlc-stage1`…`/sdlc-stage8`) |
| **Agents** | `.claude/agents/*.md` | Execute each stage; orchestrator routes + enforces gates |
| **Skills** | `.claude/skills/<name>/SKILL.md` | Reusable gate criteria + core steps (orchestrator, gate-check, phase-1…8) |
| **Instructions** | `.claude/instructions/*.md` | Deep how-to reference (global policy, gate checklist, phase-01…08; Phase 5 = full coding standards) |
| **Prompts** | `.claude/prompts/*.prompt.md` | Reusable templates (gate-review, phase-execution, reject-rework-loop, resume-from-gate) |
| **Hooks** | `.claude/settings.json` | SessionStart banner; PreToolUse blocks `.env`/destructive Bash; PostToolUse gate reminders |
| **Templates** | `.claude/templates/sdlc-report-template.html` | HTML report filled by Stage 8 |
| **Registry** | `.claude/SKILLS_REGISTRY.md` | Single-page map of the whole pipeline |

Session state persists under `/memories/session/`: `sdlc-gate-state.md` (master), `phase-0N-state.md`
(per stage), and `orchestrator-log.md` (transition log).

### Capstone 8-Step Coverage

| Capstone Step | Stage | Key guarantee added |
|---------------|-------|---------------------|
| 1 Requirements | 1 | Clarify-first questions before writing; ≥10 FR / ≥15 AC + traceability |
| 2 Architecture | 2 | Component/sequence diagrams, DB diff, API contracts, ADRs |
| 3 Design Review | 3 | 6-dimension adversarial audit, explicit APPROVED/REJECTED |
| 4 Impl Planning | 4 | Dependency-ordered tasks + blocked-task flags |
| 5 Implementation | 5 | Full coding standards, `tsc`-verified per task |
| 6 Review | 6 | Exact 7-area checklist + safe auto-fixes |
| 7 Verify | 7 | Real unit + E2E tests **and** output content-quality check |
| 8 PR | 8 | PR body with Summary, Changes Made, Test Evidence, Known Limitations, Reviewer Checklist |

## Gate Validation Rules

Each stage has objective PASS/FAIL criteria before the next stage may begin
(full detail in `.claude/instructions/gate-validation-checklist.md`):

| Stage | Minimum Pass Criteria |
|-------|----------------------|
| Stage 1 | ≥ 10 Functional Requirements, ≥ 15 Acceptance Criteria |
| Stage 2 | Architecture covers all FRs, includes DB schema + API contracts |
| Stage 3 | APPROVED verdict with traceability matrix present |
| Stage 4 | All TASK-XX items have file targets + success criteria |
| Stage 5 | No new compile errors, ≥ 80% tasks from impl-plan.md done |
| Stage 6 | All CRITICAL findings fixed or documented as accepted risk |
| Stage 7 | 100% AC coverage, all tests pass, real results only |
| Stage 8 | PR opened, CHANGELOG + HTML report present |

---

## Coding Conventions (enforced by all agents)

1. **Response shape** — All API responses use `{ success: true, data }` or `{ success: false, error }`.
2. **Auth** — All protected routes go through `backend/src/middleware/auth.ts`.
3. **HTTP client** — All frontend HTTP calls go through `frontend/src/api/client.ts` (JWT interceptor).
4. **State** — Frontend state lives in Zustand stores under `frontend/src/store/`.
5. **Secrets** — No hardcoded secrets, URLs, or tokens. Everything reads from `process.env.*` / `.env`.
6. **SQL safety** — Parameterized queries only. Zod validation before any DB write.
7. **No new dependencies** without documented rationale in architecture.md.
8. **OWASP Top 10** hygiene enforced at Stage 3 (design) and Stage 6 (review).
9. **Stage isolation** — Stage 5 never touches `tests/e2e/**` (Stage 7's domain).
10. **Real results only** — No fabricated test counts, timing, or URLs in any artifact.

---

## MCP Integration

The pipeline connects to external systems via MCP servers configured in `.vscode/mcp.json`:

| Server | Purpose | Stages |
|--------|---------|--------|
| `github` | Read issues, open PRs | Stage 1, Stage 8 |
| `jira` | Source requirements from tickets | Stage 1 |
| `confluence` | Read wiki pages | Stage 1 |
| `playwright` | Run browser tests headlessly | Stage 7 |

Tokens for Jira and Confluence are prompted securely via VS Code input (not stored in files).

---

## Project Artifacts

| File | Created By | Description |
|------|-----------|-------------|
| `user-story.md` | Developer | Input: feature description or user story |
| `requirements.md` | Stage 1 | Functional requirements + acceptance criteria |
| `architecture.md` | Stage 2 | High-level design, API contracts, DB schema |
| `design-review.md` | Stage 3 | Design audit verdict (APPROVED / REJECTED) |
| `impl-plan.md` | Stage 4 | Ordered task list with file targets |
| `verification-report.md` | Stage 7 | Test results with AC traceability |
| `CHANGELOG.md` | Stage 8 | Release notes entry |
| `sdlc-report.html` | Stage 8 | Visual SDLC pipeline summary report |
