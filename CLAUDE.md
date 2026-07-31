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

## Gate Validation Rules

Each stage has objective PASS/FAIL criteria before the next stage may begin:

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
