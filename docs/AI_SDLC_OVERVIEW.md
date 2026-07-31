# AI SDLC Overview — Claude Code Edition

## What Is This?

This project demonstrates a complete **AI-powered Software Development Lifecycle (SDLC)** built on **Claude Code** — Anthropic's official AI coding assistant CLI. The pipeline takes a feature request from raw idea to merged pull request through 8 distinct stages, each driven by a dedicated Claude subagent.

Unlike the GitHub Copilot version (which uses `.github/agents/` and VS Code extension hooks), this implementation uses:
- **Claude Code CLI** (`claude` command) as the primary interface
- **`.claude/agents/`** for subagent definitions (the Claude Code standard)
- **`CLAUDE.md`** as the project-wide AI context file
- **`.claude/settings.json`** for hooks, permissions, and MCP servers
- **Claude Workflows** (`.claude/workflows/`) for multi-agent orchestration

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Claude Code CLI                       │
│                  (claude command)                        │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              SDLC Orchestrator Agent                     │
│         (.claude/agents/sdlc-orchestrator.md)           │
│                                                         │
│  1. Detects pipeline state (which artifacts exist)      │
│  2. Delegates to the correct stage subagent             │
│  3. Shows gate message and STOPS                        │
│  4. Waits for: approve | reject                         │
└──────────────────────────┬──────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   Stage 1-4          Stage 5-6          Stage 7-8
   (Planning)      (Implementation)    (Validation)
```

---

## The 8-Stage Pipeline

### Stage 1 — Requirements Engineering
**Agent:** `sdlc-stage1-requirements`
**Input:** `user-story.md`
**Output:** `requirements.md`

Converts a raw user story or Jira ticket into structured Functional Requirements (FRs) and Acceptance Criteria (ACs) in Given/When/Then format.

**Gate criteria:** ≥ 10 FRs, ≥ 15 ACs, all in Given/When/Then format.

---

### Stage 2 — Architecture Design
**Agent:** `sdlc-stage2-architecture`
**Input:** `requirements.md` + current codebase
**Output:** `architecture.md`

Analyzes the existing React + Express + SQLite codebase and produces a complete technical design including:
- Component diagrams (Mermaid)
- Sequence diagrams
- Database schema diffs and migration SQL
- API contract specifications (new/changed endpoints)
- Frontend component changes
- Architecture Decision Records (ADRs)
- FR traceability matrix
- OWASP security analysis

**Gate criteria:** All FRs covered, migration is additive, API contracts complete.

---

### Stage 3 — Design Review
**Agent:** `sdlc-stage3-design-review`
**Input:** `architecture.md` + `requirements.md`
**Output:** `design-review.md` (APPROVED or REJECTED)

An **adversarial** review of the architecture across 6 dimensions:
1. FR coverage completeness
2. API contract correctness
3. Database migration safety
4. Security (OWASP Top 10)
5. Coding convention compliance
6. Document completeness

A single CRITICAL finding causes REJECTED. If REJECTED, the orchestrator automatically routes back to Stage 2 with the findings as input.

**Gate criteria:** APPROVED verdict, all 6 dimensions evaluated.

---

### Stage 4 — Implementation Planning
**Agent:** `sdlc-stage4-impl-plan`
**Input:** APPROVED `design-review.md` + `architecture.md`
**Output:** `impl-plan.md`

Decomposes the approved design into an ordered task list (TASK-01 through TASK-NN) with:
- Specific file targets for each task
- Task dependencies (topological order)
- Success criteria per task
- FR coverage traceability

**Gate criteria:** Every FR covered by a task, all tasks have file targets, no circular dependencies.

---

### Stage 5 — Implementation
**Agent:** `sdlc-stage5-implementation`
**Input:** `impl-plan.md` + existing codebase
**Output:** Modified files in `backend/src/` and `frontend/src/`

Executes each TASK-XX in dependency order, writing TypeScript code. After each task it runs `tsc --noEmit` to verify no compile errors before proceeding to the next task.

**Never touches:** `tests/e2e/` (that's Stage 7's domain).

**Gate criteria:** Zero TypeScript errors, ≥ 80% tasks completed.

---

### Stage 6 — Code Review
**Agent:** `sdlc-stage6-review`
**Input:** Stage 5 code changes
**Output:** In-conversation findings report + applied fixes

Performs an adversarial code review checking for:
- TypeScript compile errors (CRITICAL)
- SQL injection vulnerabilities (CRITICAL)
- Missing `authMiddleware` on protected routes (CRITICAL)
- Hardcoded secrets (CRITICAL)
- XSS vectors (CRITICAL)
- Missing `data-testid` attributes (WARNING — blocks Stage 7 Playwright tests)
- Unused imports, duplicate logic (INFO)

Applies safe mechanical fixes directly (missing testids, unused imports). Reports PASS or BLOCKED.

**Gate criteria:** PASS — all CRITICAL findings resolved.

---

### Stage 7 — Verification
**Agent:** `sdlc-stage7-verify`
**Input:** `requirements.md` ACs + running app
**Output:** `tests/e2e/specs/*.spec.ts` + `verification-report.md`

Writes Playwright E2E tests with 100% AC coverage, runs them against the live app, and produces a verification report with real (not fabricated) pass/fail counts.

**Selector strategy:** `getByTestId()` > `getByRole()` > `getByLabel()`. Never CSS selectors. Never `waitForTimeout()`.

**Gate criteria:** 100% AC coverage, all tests pass, real results only.

---

### Stage 8 — PR & Release
**Agent:** `sdlc-stage8-pr`
**Input:** All pipeline artifacts
**Output:** `CHANGELOG.md` entry + `sdlc-report.html` + GitHub PR

Creates the release documentation and opens a GitHub PR using the `gh` CLI with a structured description including the full pipeline status table and real test metrics.

**Gate criteria:** CHANGELOG and HTML report written with real numbers, PR opened.

---

## Claude Code Integration

### How Claude Code Loads Agents

When you open this project in Claude Code (via `claude` CLI or IDE extension), it reads:
1. `CLAUDE.md` — loaded as global context for every conversation
2. `.claude/agents/*.md` — available as subagent types
3. `.claude/settings.json` — hooks and permissions applied automatically

### Invoking Agents

From the Claude Code CLI:
```bash
# Full pipeline (orchestrator detects and routes)
claude "Run the SDLC pipeline for the feature in user-story.md"

# Specific stage
claude "Run sdlc-stage2-architecture agent on requirements.md"

# Resume from a specific stage
claude "Resume SDLC pipeline from Stage 5 — impl-plan.md is approved"
```

### The Orchestrator Gate Loop

```
User → Claude → Orchestrator
                    │
                    ├─ Checks artifacts
                    ├─ Invokes stage agent
                    ├─ Prints gate message
                    └─ STOPS (waits for human input)

User types: "approve"
                    │
                    ├─ Invokes next stage agent
                    ├─ Prints gate message
                    └─ STOPS again

User types: "reject"
                    │
                    └─ Re-invokes current stage with feedback
```

---

## MCP Server Integration

### Playwright MCP
Used by Stage 7 to run browser tests headlessly via Claude Code.

Configure in `.claude/settings.json`:
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

### GitHub MCP
Used by Stage 1 (fetch issue context) and Stage 8 (open PR) via `gh` CLI.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

---

## Security Architecture

### What the Pipeline Enforces
- No `.env` file writes (blocked by `PreToolUse` hook in `settings.json`)
- Parameterized SQL only (checked at Stage 3 and Stage 6)
- No hardcoded secrets (checked at Stage 6)
- `authMiddleware` required on all protected routes (checked at Stage 3 and Stage 6)
- OWASP Top 10 analysis required at Stage 3 before code is written

### Authentication Flow (preserved by all agents)
```
Login → JWT (8h) → localStorage → Axios interceptor → Bearer token → authMiddleware
```
No agent may change this flow without an explicit ADR in `architecture.md`.

---

## Comparison: Copilot vs Claude Code

| Aspect | GitHub Copilot (old) | Claude Code (this project) |
|--------|---------------------|---------------------------|
| Agent location | `.github/agents/*.agent.md` | `.claude/agents/*.md` |
| Instructions | `.github/instructions/*.instructions.md` | `CLAUDE.md` |
| Skills | `.github/skills/*/SKILL.md` | Built into agent descriptions |
| Invocation | `@sdlc` in VS Code chat | `claude "run sdlc..."` in terminal |
| MCP config | `.vscode/mcp.json` | `.claude/settings.json` |
| Hooks | `.github/hooks/sdlc-gate.json` | `settings.json` hooks array |
| Workflow | Manual per-stage invocation | `.claude/workflows/sdlc-full-pipeline.js` |
| IDE integration | VS Code only | Any IDE + terminal |
| Multi-agent | Sequential (VS Code chat) | True parallel via Workflow engine |
