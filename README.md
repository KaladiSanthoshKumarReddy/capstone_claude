# Capstone Claude SDLC

A complete **8-stage AI-powered SDLC pipeline** built on **Claude Code** — Anthropic's official AI coding CLI. This project demonstrates how to take a feature from raw idea to merged pull request using Claude subagents, human-in-the-loop gates, and MCP server integrations.

The underlying application is a full-stack **Capstone Item Manager** (React + Express + SQLite) — a personal task tracker with JWT auth, tags, search, and filtering.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Project Structure](#project-structure)
4. [How to Run the App](#how-to-run-the-app)
5. [The AI SDLC Pipeline](#the-ai-sdlc-pipeline)
6. [Claude Code Agents — Detailed Guide](#claude-code-agents--detailed-guide)
7. [Claude Workflow](#claude-workflow)
8. [CLAUDE.md — The Project Brain](#claudemd--the-project-brain)
9. [Settings & Hooks](#settings--hooks)
10. [MCP Integrations](#mcp-integrations)
11. [Environment Variables](#environment-variables)
12. [Running Tests](#running-tests)
13. [Copilot vs Claude — What Changed](#copilot-vs-claude--what-changed)
14. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 20+ | https://nodejs.org |
| npm | 10+ | Included with Node.js |
| Claude Code CLI | Latest | `npm install -g @anthropic-ai/claude-code` |
| Git | Any | https://git-scm.com |
| gh CLI | Latest (for Stage 8) | https://cli.github.com |

**Verify your setup:**
```bash
node --version     # v20.x.x
claude --version   # claude X.X.X
gh --version       # gh version X.X.X
```

---

## Quick Start

```bash
# 1. Clone and enter the project
git clone https://github.com/KaladiSanthoshKumarReddy/capstone_claude.git capstone-claude-sdlc
cd capstone-claude-sdlc

# 2. Copy the environment template
cp .env.example .env
# Edit .env: set JWT_SECRET to a random string (required for auth)

# 3. Install all dependencies
npm run install:all

# 4. Start the dev servers (backend + frontend concurrently)
npm run dev

# 5. Open the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:4000/api/health

# 6. Open Claude Code in this directory
claude

# 7. Start the SDLC pipeline
# (Edit user-story.md first, then ask Claude:)
# "Run the SDLC pipeline for the feature in user-story.md"
```

---

## Project Structure

```
capstone-claude-sdlc/
│
├── .claude/                        ← Claude Code AI framework
│   ├── agents/                     ← 9 subagent definitions
│   │   ├── sdlc-orchestrator.md    ← Master pipeline controller
│   │   ├── sdlc-stage1-requirements.md
│   │   ├── sdlc-stage2-architecture.md
│   │   ├── sdlc-stage3-design-review.md
│   │   ├── sdlc-stage4-impl-plan.md
│   │   ├── sdlc-stage5-implementation.md
│   │   ├── sdlc-stage6-review.md
│   │   ├── sdlc-stage7-verify.md
│   │   └── sdlc-stage8-pr.md
│   ├── settings.json               ← Hooks, permissions, MCP config
│   └── workflows/
│       └── sdlc-full-pipeline.js   ← Multi-agent workflow script
│
├── CLAUDE.md                       ← Project-wide AI instructions (auto-loaded)
│
├── backend/                        ← Express + TypeScript API
│   └── src/
│       ├── index.ts                ← Express app entry
│       ├── db/init.ts              ← SQLite init + migrations
│       ├── middleware/auth.ts      ← JWT auth middleware
│       └── routes/
│           ├── auth.ts             ← POST /api/auth/login, /register
│           ├── items.ts            ← CRUD /api/items (with tags + filters)
│           └── debug.ts            ← Dev-only debug viewer
│
├── frontend/                       ← React + TypeScript + Vite
│   └── src/
│       ├── api/                    ← Axios client + items API
│       ├── components/             ← UI components
│       ├── pages/                  ← Dashboard, Login, Register
│       ├── store/                  ← Zustand auth store
│       └── types/                  ← TypeScript interfaces
│
├── tests/                          ← Playwright E2E tests
│   ├── e2e/helpers/auth.ts         ← registerUser, loginViaApi helpers
│   ├── e2e/pages/                  ← Page Object Models
│   └── e2e/specs/                  ← Test spec files
│
├── docs/
│   └── AI_SDLC_OVERVIEW.md        ← Deep-dive technical overview
│
│── SDLC Pipeline Artifacts (created by agents during pipeline runs):
├── user-story.md                   ← YOUR INPUT: feature description
├── requirements.md                 ← Stage 1 output
├── architecture.md                 ← Stage 2 output
├── design-review.md                ← Stage 3 output (APPROVED/REJECTED)
├── impl-plan.md                    ← Stage 4 output
├── verification-report.md          ← Stage 7 output
├── CHANGELOG.md                    ← Stage 8 output
└── sdlc-report.html                ← Stage 8 HTML report
```

---

## How to Run the App

### Development (recommended)

```bash
# Start both backend and frontend with hot reload
npm run dev
```

- Backend: `http://localhost:4000`
- Frontend: `http://localhost:3000`
- Debug viewer: `http://localhost:4000/api/debug`

### Individual servers

```bash
# Backend only
cd backend && npm run dev

# Frontend only
cd frontend && npm run dev
```

### Production build

```bash
npm run build
# Then: cd backend && npm start
```

### First-time setup

1. Register an account at `http://localhost:3000/register`
2. Login and explore the dashboard
3. Create items with titles, descriptions, and comma-separated tags (e.g. `work,urgent`)
4. Use the search bar, status filter, and tag filter to find items

---

## The AI SDLC Pipeline

The pipeline converts a feature request into code through 8 stages, each with a mandatory human gate.

### Pipeline Flow

```
user-story.md
     │
     ▼
[STAGE 1] sdlc-stage1-requirements
     │    → requirements.md (≥10 FRs, ≥15 ACs)
     │    GATE: approve/reject
     ▼
[STAGE 2] sdlc-stage2-architecture
     │    → architecture.md (HLD, API contracts, DB schema)
     │    GATE: approve/reject
     ▼
[STAGE 3] sdlc-stage3-design-review
     │    → design-review.md (APPROVED or REJECTED)
     │    GATE: approve (auto-rejects route back to Stage 2)
     ▼
[STAGE 4] sdlc-stage4-impl-plan
     │    → impl-plan.md (TASK-01..TASK-NN with file targets)
     │    GATE: approve/reject
     ▼
[STAGE 5] sdlc-stage5-implementation
     │    → Code in backend/src/ and frontend/src/
     │    GATE: approve/reject
     ▼
[STAGE 6] sdlc-stage6-review
     │    → Findings report + auto-applied fixes
     │    GATE: approve/reject
     ▼
[STAGE 7] sdlc-stage7-verify
     │    → tests/e2e/specs/*.spec.ts + verification-report.md
     │    GATE: approve/reject
     ▼
[STAGE 8] sdlc-stage8-pr
          → CHANGELOG.md + sdlc-report.html + GitHub PR
```

### How to Run the Pipeline

#### Option 1 — Ask the Orchestrator (recommended)

```bash
# Open Claude Code in the project directory
claude

# Then type:
"Run the SDLC pipeline for the feature in user-story.md"
```

The orchestrator will:
1. Check which artifacts already exist
2. Show a status table of all 8 stages
3. Run the next stage
4. Show a gate message and STOP

You type `approve` (or `continue`) to advance, or `reject` (or `rework`) to revise.

#### Option 2 — Run individual stages

```bash
claude "Run sdlc-stage1-requirements agent"
claude "Run sdlc-stage2-architecture agent"
claude "Run sdlc-stage3-design-review agent"
# ... and so on
```

#### Option 3 — Use the Workflow (fully automated, human gates at end)

```bash
claude "Run the sdlc-full-pipeline workflow"
# Or from Claude Code:
# /workflow sdlc-full-pipeline
```

#### Option 4 — Resume from a specific stage

```bash
claude "Resume SDLC pipeline from Stage 4 — design-review.md is APPROVED"
```

---

## Claude Code Agents — Detailed Guide

All agents live in `.claude/agents/`. Each is a Markdown file with YAML frontmatter. They are loaded as subagent types by Claude Code.

### Agent Frontmatter Format

```markdown
---
name: agent-name
description: One-line description (used by Claude to decide when to invoke)
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

## Role
...instructions...
```

---

### `sdlc-orchestrator.md` — Master Pipeline Controller

**Purpose:** Detects which pipeline artifacts exist, determines the next stage, delegates to the correct stage subagent, shows a gate message, and STOPS. Never auto-advances.

**Tools used:** `Read`, `Bash`, `Glob`

**How to invoke:**
```
"Run the SDLC pipeline for user-story.md"
"What stage are we on?"
"Start the SDLC"
```

**What it does:**
1. Globs for artifact files (requirements.md, architecture.md, etc.)
2. Builds a pipeline state table showing DONE / NEXT / PENDING per stage
3. Invokes the appropriate stage subagent
4. Prints a gate message with approve/reject instructions
5. STOPS — will not run the next stage until you type `approve`

**Gate behavior:**
- `approve` / `continue` / `proceed` → advances to next stage
- `reject` / `rework` / `redo` → re-runs current stage with feedback
- If `design-review.md` says REJECTED → automatically routes back to Stage 2

---

### `sdlc-stage1-requirements.md` — Requirements Engineer

**Purpose:** Converts `user-story.md` into a structured `requirements.md` with Functional Requirements and Acceptance Criteria.

**Tools used:** `Read`, `Write`, `Bash`

**How to invoke:**
```
"Run stage 1 requirements"
"Generate requirements from user-story.md"
"Write requirements.md"
```

**Minimum output:**
- ≥ 10 Functional Requirements as "The system SHALL..." statements
- ≥ 15 Acceptance Criteria in Given/When/Then format
- ≥ 3 Non-Functional Requirements
- Assumptions and Out-of-Scope sections

**What it reads:** `user-story.md` (required), Jira ticket (if referenced), Confluence page (if referenced)

**What it writes:** `requirements.md`

---

### `sdlc-stage2-architecture.md` — Solutions Architect

**Purpose:** Analyzes the existing codebase and produces `architecture.md` — a complete technical design.

**Tools used:** `Read`, `Write`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 2 architecture"
"Design the architecture for the requirements"
"Write architecture.md"
```

**Output includes:**
- Mermaid component and sequence diagrams
- Database schema diffs + additive migration SQL
- API contract table (method, path, auth, body, response)
- Frontend component changes
- Architecture Decision Records (ADRs)
- OWASP security analysis
- FR traceability matrix

**Key constraints enforced:**
- Preserves existing auth flow (JWT, Zustand, authMiddleware)
- Preserves existing DB init pattern (additive migrations only)
- No new frameworks or dependencies without ADR justification

---

### `sdlc-stage3-design-review.md` — Adversarial Design Reviewer

**Purpose:** Reviews `architecture.md` across 6 dimensions and produces `design-review.md` with an APPROVED or REJECTED verdict.

**Tools used:** `Read`, `Write`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 3 design review"
"Review the architecture"
"Write design-review.md"
```

**6 review dimensions:**
1. FR coverage — every FR traced to an architecture element
2. API contract correctness — all fields present, correct response shape
3. Database safety — no destructive migrations
4. Security (OWASP Top 10) — injection, auth, data exposure
5. Convention compliance — auth flow, DB init, API client preserved
6. Completeness — all required sections present

**Verdict rules:**
- APPROVED: all 6 dimensions pass (no CRITICAL findings)
- REJECTED: any CRITICAL finding → REJECTED + list of blockers
- On REJECTED: orchestrator routes back to Stage 2 with findings

---

### `sdlc-stage4-impl-plan.md` — Implementation Planner

**Purpose:** Decomposes the APPROVED design into `impl-plan.md` — an ordered task list with file targets, dependencies, and success criteria.

**Tools used:** `Read`, `Write`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 4 implementation plan"
"Create the implementation plan"
"Write impl-plan.md"
```

**Task format (TASK-XX):**
```markdown
### TASK-01: Add tags column to items table
- **File(s)**: `backend/src/db/init.ts`
- **Change type**: Modify
- **Description**: Add additive migration for tags TEXT column
- **Depends on**: none
- **Success criteria**: `PRAGMA table_info(items)` shows tags column
- **FR coverage**: FR-03, FR-04
```

**Rules enforced:**
- DB migrations before routes (topological ordering)
- Backend before frontend
- No task touches `tests/e2e/`
- Every FR covered by at least one task

---

### `sdlc-stage5-implementation.md` — Senior Full-Stack Developer

**Purpose:** Executes every TASK-XX in dependency order, writing actual TypeScript code to `backend/src/` and `frontend/src/`.

**Tools used:** `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 5 implementation"
"Implement the feature"
"Write the code"
```

**Execution protocol:**
1. Read `impl-plan.md` — extract ordered task list
2. Pre-check: run `tsc --noEmit` in both workspaces (must be 0 errors)
3. For each task: read target file → apply minimal diff → run `tsc --noEmit` → fix any errors
4. Report each completed task

**Code standards:**
- Backend: Zod validation before every DB write
- Backend: `authMiddleware` on all protected routes
- Backend: parameterized SQL only (`{sql, args}` format)
- Frontend: all HTTP calls through `frontend/src/api/client.ts`
- Frontend: `data-testid` on every interactive element
- Frontend: Tailwind CSS only (no inline styles)

**Hard prohibitions:**
- Never touches `tests/e2e/` (Stage 7's domain)
- Never hardcodes secrets or API URLs
- Never uses raw string concatenation in SQL

---

### `sdlc-stage6-review.md` — Code Reviewer

**Purpose:** Reviews Stage 5 code changes for bugs, security issues, and convention violations. Applies safe fixes. Reports PASS or BLOCKED.

**Tools used:** `Read`, `Edit`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 6 code review"
"Review the code"
"Code review"
```

**Finding severities:**

| Severity | Examples | Action |
|----------|---------|--------|
| CRITICAL | TypeScript errors, SQL injection, hardcoded secrets, missing auth | Must fix before Stage 7 |
| WARNING | Missing `data-testid`, unused imports | Auto-fix or note |
| INFO | Style inconsistencies | Note only |

**Auto-applies:** Missing `data-testid` attributes, unused imports, null coalescing operators

**Does NOT auto-apply:** Logic changes, API contract changes, DB schema changes

**Output:** In-conversation report with PASS or BLOCKED verdict

---

### `sdlc-stage7-verify.md` — QA Engineer

**Purpose:** Writes Playwright E2E tests for all ACs, runs them against the live app, produces `verification-report.md` with real results.

**Tools used:** `Read`, `Write`, `Bash`, `Glob`, `Grep`

**How to invoke:**
```
"Run stage 7 verification"
"Write the tests"
"Verify the feature"
```

**Pre-checks:**
- Backend running: `curl http://localhost:4000/api/health` → must return `{success:true}`
- Frontend running: `curl http://localhost:3000` → must return HTML
- If not running: reports "Stage 7 blocked" with start instructions

**Test standards:**
- Every AC from `requirements.md` mapped to at least one test
- Tests labeled with AC-ID: `test('AC-01: description', ...)`
- Selector priority: `getByTestId` > `getByRole` > `getByLabel`
- No `waitForTimeout()` — use explicit state waits
- Reuses existing page objects from `tests/e2e/pages/`

**The golden rule:** Never fabricate results. Every number in `verification-report.md` comes from an actual test run.

**Output:**
- New test files in `tests/e2e/specs/`
- `verification-report.md` with real pass/fail counts and AC traceability

---

### `sdlc-stage8-pr.md` — Release Engineer

**Purpose:** Creates `CHANGELOG.md` entry, generates `sdlc-report.html`, and opens a GitHub PR.

**Tools used:** `Read`, `Write`, `Bash`, `Glob`

**How to invoke:**
```
"Run stage 8 PR"
"Create the PR"
"Finalize the release"
```

**Pre-check:** `verification-report.md` must show PASS verdict.

**What it creates:**

1. **CHANGELOG.md entry** — Added/Changed/Technical/Testing sections with real numbers from verification-report.md

2. **sdlc-report.html** — Self-contained HTML page with:
   - Pipeline status for all 8 stages
   - Requirements summary (FR count, AC count)
   - Test results (Playwright + Vitest)
   - Changed files list

3. **GitHub PR** via `gh pr create` with:
   - Conventional commit title (`feat:`, `fix:`, etc.)
   - Summary bullets from CHANGELOG
   - Pipeline status table
   - Real test metrics
   - Changed files list

**If `gh` is not authenticated:** Prints the PR body to console with instructions.

---

## Claude Workflow

The `.claude/workflows/sdlc-full-pipeline.js` script orchestrates all 8 stages using the Claude Code Workflow engine.

### What Is a Claude Workflow?

A Claude Workflow is a JavaScript script that uses special functions (`agent()`, `phase()`, `log()`, `parallel()`, `pipeline()`) to orchestrate multiple subagents. It runs in the Claude Code background engine.

### How to Invoke

```bash
# From Claude Code CLI
claude "Run the sdlc-full-pipeline workflow"
```

Or via Claude's workflow tool: `/workflow sdlc-full-pipeline`

### What the Workflow Does

```javascript
// 1. Check which artifacts exist (schema-typed response)
const stateReport = await agent("check artifacts...", { schema: STATE_SCHEMA })

// 2. Skip completed stages, run the next one
if (!stateReport.hasRequirements) {
  await agent("run stage 1...", { agentType: 'sdlc-stage1-requirements' })
}

// 3. Continue through all 8 stages
// Each stage invokes its dedicated subagent
```

### Phases Display

The workflow shows progress in phases:
```
[State Check]         ✓ Detected: requirements.md exists
[Stage 1 — Reqs]      ✓ Skipped (already done)
[Stage 2 — Arch]      ✓ Skipped (already done)
[Stage 3 — Review]    ▶ Running...
```

---

## CLAUDE.md — The Project Brain

`CLAUDE.md` is automatically loaded by Claude Code for every conversation in this project. It serves as the AI's project-specific instructions.

### What CLAUDE.md Contains

1. **Application overview** — tech stack table, layer descriptions
2. **Pipeline overview** — ASCII flow diagram of all 8 stages
3. **Invocation instructions** — how to trigger each stage
4. **Agent table** — mapping of file names to purposes
5. **Gate validation rules** — minimum pass criteria per stage
6. **Coding conventions** — 10 rules enforced by all agents
7. **MCP integration table** — which servers are used by which stages
8. **Project artifacts table** — what each file is and who creates it

### Why It Matters

Without `CLAUDE.md`, Claude Code would have no project context. With it, every conversation automatically knows:
- What kind of app this is
- How the SDLC pipeline works
- What conventions to follow
- Which agents to use and when

---

## Settings & Hooks

`.claude/settings.json` configures Claude Code's behavior for this project.

### Permissions (allow list)

```json
{
  "permissions": {
    "allow": [
      "Bash(git *)",
      "Bash(npm *)",
      "Bash(npx *)",
      "Bash(node *)",
      "Bash(tsc *)",
      "Bash(gh *)"
    ]
  }
}
```

These allow Claude Code to run git, npm, node, tsc, and gh commands without prompting for each one.

### Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "..."
          }
        ]
      }
    ]
  }
}
```

The `PreToolUse` hook on `Write` blocks any attempt to write to a `.env` file (except `.env.example`). This prevents accidental secret leaks.

### MCP Servers

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```

---

## MCP Integrations

### Playwright MCP
Used by Stage 7 to run browser tests via Claude Code's MCP protocol.

**Setup:** Runs automatically via `npx` (no manual install needed).

**Used by:** `sdlc-stage7-verify`

### GitHub MCP
Used by Stage 8 to create pull requests programmatically.

**Setup:**
```bash
# Authenticate gh CLI
gh auth login
```

**Used by:** `sdlc-stage8-pr`

### Jira MCP (optional)
If your `user-story.md` references a Jira ticket (e.g. `CAP-42`), Stage 1 can fetch the full ticket description.

**Setup:** Set `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` in `.env`

**Used by:** `sdlc-stage1-requirements`

### Confluence MCP (optional)
If your user story references a Confluence page, Stage 1 can fetch its content.

**Setup:** Set `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN` in `.env`

**Used by:** `sdlc-stage1-requirements`

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | `dev-secret` | JWT signing secret (change in production) |
| `FRONTEND_PORT` | No | `3000` | Vite dev server port |
| `BACKEND_PORT` | No | `4000` | Express server port |
| `DATABASE_PATH` | No | `./data/capstone.db` | SQLite file path |
| `GITHUB_TOKEN` | For Stage 8 | — | GitHub PAT for PR creation |
| `GIT_REPO_URL` | For Stage 8 | — | Your repo's HTTPS URL |
| `GIT_BRANCH` | For Stage 8 | `main` | Target branch for PRs |
| `JIRA_BASE_URL` | Optional | — | Jira instance URL |
| `JIRA_EMAIL` | Optional | — | Jira auth email |
| `JIRA_API_TOKEN` | Optional | — | Jira API token |
| `JIRA_PROJECT_KEY` | Optional | — | Jira project key |
| `CONFLUENCE_BASE_URL` | Optional | — | Confluence URL |
| `CONFLUENCE_EMAIL` | Optional | — | Confluence auth email |
| `CONFLUENCE_API_TOKEN` | Optional | — | Confluence API token |
| `CONFLUENCE_SPACE_KEY` | Optional | — | Confluence space key |

---

## Running Tests

### Unit Tests (Vitest)

```bash
# Run once
cd frontend && npm run test

# Watch mode
cd frontend && npm run test:watch
```

Unit tests are in `frontend/src/**/__tests__/`. They test:
- API client functions (`api/items.ts`)
- Zustand auth store
- React components

### E2E Tests (Playwright)

```bash
# Make sure the app is running first:
npm run dev

# Then in a separate terminal:
cd tests && npx playwright test

# Run with visible browser
cd tests && npx playwright test --headed

# Open Playwright UI
cd tests && npx playwright test --ui

# View HTML report
cd tests && npx playwright show-report
```

E2E tests are in `tests/e2e/specs/`. They test:
- Login and registration flows
- Item CRUD operations
- Tag creation and filtering
- Search and status filtering

### Run All Tests

```bash
npm run test
```

### Install Playwright Browsers (first time)

```bash
cd tests && npx playwright install chromium
```

---

## Copilot vs Claude — What Changed

This project is a direct port of `capstone-copilot-clean` from GitHub Copilot to Claude Code.

| Component | GitHub Copilot (old) | Claude Code (this) |
|-----------|---------------------|-------------------|
| **Agent definitions** | `.github/agents/*.agent.md` | `.claude/agents/*.md` |
| **Global instructions** | `.github/copilot-instructions.md` | `CLAUDE.md` |
| **Stage instructions** | `.github/instructions/*.instructions.md` | Embedded in each agent file |
| **Skills (quick routing)** | `.github/skills/*/SKILL.md` | Agent `description:` frontmatter |
| **Hooks** | `.github/hooks/sdlc-gate.json` | `.claude/settings.json` hooks |
| **MCP config** | `.vscode/mcp.json` | `.claude/settings.json` mcpServers |
| **Multi-agent workflow** | Not supported natively | `.claude/workflows/sdlc-full-pipeline.js` |
| **Invocation** | `@sdlc` in VS Code Copilot chat | `claude "run sdlc..."` in terminal |
| **IDE coupling** | VS Code only | Terminal + any IDE |
| **Parallel agents** | No (sequential only) | Yes (via Workflow engine) |
| **Token-efficient routing** | SKILL.md files (250-token summaries) | Agent `description:` (one-liner) |
| **State management** | Session memory files | Artifact detection on disk |

### Key Architectural Differences

1. **CLAUDE.md replaces copilot-instructions.md** — Claude Code auto-loads `CLAUDE.md` from the project root for every conversation, giving the AI full project context without any extension configuration.

2. **Agent descriptions act as routing signals** — In Claude Code, the `description:` field in an agent's frontmatter is what Claude reads when deciding whether to invoke that agent. This replaces the ~300-token SKILL.md files in the Copilot version.

3. **`.claude/settings.json` is the single config file** — Copilot needed `.vscode/mcp.json` for MCP servers and `.github/hooks/sdlc-gate.json` for hooks. Claude Code consolidates everything into one file.

4. **Workflow engine enables true parallelism** — The Copilot version runs stages sequentially in VS Code chat. The Claude Workflow engine can run stages in parallel (e.g., parallel code review + test writing), though this pipeline keeps them sequential for human oversight.

5. **No IDE dependency** — Claude Code runs in any terminal, on any OS, with any editor. The Copilot version required VS Code with the GitHub Copilot extension.

---

## Troubleshooting

### "Cannot connect to backend"
```bash
# Check if backend is running
curl http://localhost:4000/api/health
# Should return: {"success":true,"data":{"status":"ok"}}

# Start backend
cd backend && npm run dev
```

### "Database error on startup"
```bash
# The data/ directory is auto-created. If issues persist:
rm -f data/capstone.db
npm run dev  # Reinitializes the database
```

### "Playwright tests fail: net::ERR_CONNECTION_REFUSED"
The app must be running before E2E tests start. Either:
```bash
# Run in one terminal:
npm run dev

# Run tests in another:
cd tests && npx playwright test
```
Or let Playwright's `webServer` config auto-start it (default behavior).

### "Stage 7 blocked: backend not running"
The `sdlc-stage7-verify` agent checks that both servers are running before writing tests. Start the app with `npm run dev`.

### "gh: command not found" (Stage 8)
```bash
# Install gh CLI
winget install GitHub.cli   # Windows
brew install gh              # Mac

# Authenticate
gh auth login
```

### "TypeScript errors after Stage 5"
The Stage 6 review agent will catch and fix compile errors. If errors persist:
```bash
cd backend && npx tsc --noEmit
cd frontend && npx tsc --noEmit
```

### "Claude agent not found"
Ensure you're running Claude Code from the project root (`capstone-claude-sdlc/`). The agents in `.claude/agents/` are only available when Claude Code is opened in this directory.

### "GATE not showing / pipeline auto-advancing"
The orchestrator agent is designed to stop after each stage. If it continues without showing a gate message, ask Claude explicitly:
```
"Stop and show me the gate message for the current stage"
```

---

## Contributing

The SDLC pipeline itself is the contribution target. To add a new stage or modify an existing agent:

1. Edit the appropriate `.claude/agents/sdlc-stageN-*.md` file
2. Update `CLAUDE.md` to reflect any new invocation patterns
3. Update `docs/AI_SDLC_OVERVIEW.md` with the technical changes
4. Update the workflow in `.claude/workflows/sdlc-full-pipeline.js`

---

## License

MIT
