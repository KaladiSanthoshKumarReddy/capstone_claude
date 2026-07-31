# Raw Repository Facts

## Scan Scope
- **Repository:** `KaladiSanthoshKumarReddy/capstone_claude`
- **Branch scanned:** `main`
- **Shape:** multi-workspace monorepo with a full-stack app, tests, and Claude Code SDLC automation

## Primary Language and Frameworks
- **Primary language:** TypeScript
- **Frontend:** React 18 + Vite 5 + Tailwind CSS 3 + Zustand + Axios + React Router v6
- **Backend:** Express 4 + SQLite via `@libsql/client` + JWT (`jsonwebtoken`) + Zod + dotenv + cors
- **Unit tests:** Vitest with jsdom
- **E2E tests:** Playwright (`@playwright/test`)

## Key Configuration / Metadata Files
- Root: `package.json`, `README.md`, `.env.example`
- Backend: `backend/package.json`, `backend/tsconfig.json`
- Frontend: `frontend/package.json`, `frontend/vite.config.ts`, `frontend/vitest.config.ts`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`
- Tests: `tests/package.json`, `tests/playwright.config.ts`
- Claude automation: `.claude/settings.json`, `.claude/agents/*`, `.claude/commands/*`, `.claude/workflows/sdlc-full-pipeline.js`

## Major Dependencies
### Root
- `concurrently`

### Backend
- `@libsql/client`
- `cors`
- `dotenv`
- `express`
- `jsonwebtoken`
- `zod`
- Dev: `typescript`, `ts-node-dev`, type packages

### Frontend
- `react`, `react-dom`, `react-router-dom`, `axios`, `zustand`
- Dev: `vite`, `@vitejs/plugin-react`, `typescript`, `vitest`, `jsdom`, `tailwindcss`, `postcss`, `autoprefixer`, `eslint`

### Tests
- `@playwright/test`, `typescript`, `@types/node`

## Build Tooling
- Root npm scripts orchestrate the repo
- Backend build: `tsc`
- Frontend build: `tsc && vite build`
- Backend dev: `ts-node-dev --respawn src/index.ts`
- Frontend dev: `vite`
- Unit tests: `vitest run`
- E2E tests: `playwright test`

## Core Entry Points
### Backend
- `backend/src/index.ts` — boots Express, loads env, mounts routes, starts server
- `backend/src/db/init.ts` — initializes SQLite schema/migrations
- `backend/src/middleware/auth.ts` — JWT bearer auth middleware
- `backend/src/routes/auth.ts` — login/register endpoints
- `backend/src/routes/items.ts` — protected CRUD, filtering, pagination, CSV export
- `backend/src/routes/debug.ts` — dev-only debug endpoints

### Frontend
- `frontend/src/main.tsx` — React root mount + BrowserRouter
- `frontend/src/App.tsx` — route definitions
- `frontend/src/api/client.ts` — Axios client with token injection and 401 redirect
- `frontend/src/api/items.ts` — item API helpers
- `frontend/src/store/authStore.ts` — localStorage-backed auth state

## Environment Variables
From `.env.example`:
- `FRONTEND_PORT` (default `3000`)
- `BACKEND_PORT` (default `4000`)
- `DATABASE_PATH` (default `./data/capstone.db`)
- `JWT_SECRET` (required)
- `GIT_REPO_URL`
- `GIT_BRANCH` (default `main`)
- `GITHUB_TOKEN`
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`
- `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY`

## Testing Frameworks and Locations
- **Vitest**: `frontend/src/**/__tests__/` with `jsdom`
- **Playwright**: `tests/e2e/specs/`
- Playwright config auto-starts backend and frontend web servers

## Pipeline / Automation Notes
- `.claude/settings.json` configures permissions, safety hooks, and MCP servers
- MCP servers: Playwright MCP and GitHub MCP
- Hooks block writing/editing `.env` and block destructive shell/SQL patterns
- No `.github/workflows` directory or workflow files were found in the scanned `main` branch tree

## Concise Summary
- **Language:** TypeScript
- **Frontend stack:** React + Vite + Tailwind + Zustand + Axios
- **Backend stack:** Express + SQLite + JWT + Zod
- **Unit test framework:** Vitest
- **E2E test framework:** Playwright
- **Main runtime entry points:** `backend/src/index.ts`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
