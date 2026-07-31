# Raw Repository Facts

## Scan Scope
- **Repository:** `KaladiSanthoshKumarReddy/capstone_claude`
- **Branch scanned:** `main`
- **Project shape:** TypeScript monorepo with a React frontend, Express backend, Playwright E2E tests, and Claude Code SDLC automation

## Project Language and Frameworks
- **Primary language:** TypeScript
- **Frontend framework:** React 18 with Vite 5
- **Backend framework:** Express 4
- **Database:** SQLite via `@libsql/client`
- **Auth/security:** JWT (`jsonwebtoken`), `cors`, `dotenv`, `zod`
- **UI/state:** React Router v6, Zustand, Axios, Tailwind CSS 3

## Key Configuration / Metadata Files
- **Root:** `package.json`, `README.md`, `.env.example`
- **Backend:** `backend/package.json`, `backend/tsconfig.json`
- **Frontend:** `frontend/package.json`, `frontend/vite.config.ts`, `frontend/vitest.config.ts`, `frontend/tailwind.config.js`, `frontend/postcss.config.js`, `frontend/tsconfig.json`, `frontend/tsconfig.node.json`
- **Tests:** `tests/package.json`, `tests/playwright.config.ts`
- **Automation / SDLC:** `.claude/settings.json`, `.claude/agents/*`, `.claude/commands/*`, `.claude/workflows/sdlc-full-pipeline.js`

## Major Dependencies
### Root
- `concurrently`

### Backend runtime dependencies
- `@libsql/client`
- `cors`
- `dotenv`
- `express`
- `jsonwebtoken`
- `zod`

### Backend dev dependencies
- `typescript`
- `ts-node-dev`
- `@types/*` packages for Node, Express, CORS, and JSON Web Token

### Frontend runtime dependencies
- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `zustand`

### Frontend dev dependencies
- `vite`
- `@vitejs/plugin-react`
- `typescript`
- `vitest`
- `jsdom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`

### E2E test dependencies
- `@playwright/test`
- `typescript`
- `@types/node`

## Build Tooling and Scripts
### Root scripts
- `npm run install:all` installs dependencies for frontend, backend, and tests
- `npm run dev` runs backend and frontend concurrently
- `npm run build` builds backend then frontend
- `npm run test` runs frontend unit tests and Playwright E2E tests
- `npm run test:unit` runs frontend Vitest
- `npm run test:e2e` runs Playwright tests

### Backend scripts
- `dev`: `ts-node-dev --respawn src/index.ts`
- `build`: `tsc`
- `start`: `node dist/index.js`

### Frontend scripts
- `dev`: `vite`
- `build`: `tsc && vite build`
- `test`: `vitest run`
- `test:watch`: `vitest`

### Tests scripts
- `test`: `playwright test`
- `report`: `playwright show-report`

## Core Execution Entry Points
### Backend entry points
- `backend/src/index.ts` — loads env, configures Express, mounts routes, starts server, initializes DB
- `backend/src/db/init.ts` — creates SQLite client, tables, and additive migrations
- `backend/src/middleware/auth.ts` — JWT bearer token middleware
- `backend/src/routes/auth.ts` — `/api/auth/login` and `/api/auth/register`
- `backend/src/routes/items.ts` — authenticated CRUD, filtering, pagination, export CSV endpoint

### Frontend entry points
- `frontend/src/main.tsx` — React root mount with `BrowserRouter`
- `frontend/src/App.tsx` — application routing and protected dashboard route
- `frontend/src/api/client.ts` — Axios client with auth token injection and 401 redirect behavior
- `frontend/src/api/items.ts` — item fetch/create/update/delete/export helpers
- `frontend/src/store/authStore.ts` — localStorage-backed auth state

### Test entry points
- `tests/playwright.config.ts` — Playwright config and web server startup
- `tests/e2e/specs/login.spec.ts` — login/auth route coverage
- `tests/e2e/specs/items.spec.ts` — item CRUD/filtering coverage
- `tests/e2e/specs/export-csv.spec.ts` — CSV export coverage

## Environment Variables Listed in `.env.example`
- `FRONTEND_PORT` (`3000`)
- `BACKEND_PORT` (`4000`)
- `DATABASE_PATH` (`./data/capstone.db`)
- `JWT_SECRET` (`change-me-in-production`)
- `GIT_REPO_URL`
- `GIT_BRANCH` (`main`)
- `GITHUB_TOKEN`
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT_KEY`
- `CONFLUENCE_BASE_URL`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`
- `CONFLUENCE_SPACE_KEY`

## Testing Frameworks and Placement
- **Vitest** for frontend unit tests, configured with `jsdom` in `frontend/vitest.config.ts`
- **Playwright** for E2E tests in `tests/e2e/specs/`
- Playwright web server configuration auto-starts backend on port `4000` and frontend on port `3000`

## Pipeline / Automation Notes
- `.claude/settings.json` contains permissions, safety hooks, and MCP server configuration
- MCP servers include Playwright and GitHub integrations
- Hooks block `.env` file writes/edits and reject destructive shell/SQL patterns
- No `.github/workflows` directory or workflow files were present in the scanned tree

## Clean Technical Summary
- **Language:** TypeScript
- **Build system:** npm scripts with `tsc`, `vite`, `ts-node-dev`, and `playwright`
- **Frontend stack:** React + Vite + Tailwind + Zustand + Axios
- **Backend stack:** Express + SQLite + JWT + Zod
- **Unit testing:** Vitest
- **E2E testing:** Playwright
- **Primary runtime entry points:** `backend/src/index.ts`, `frontend/src/main.tsx`, `frontend/src/App.tsx`
