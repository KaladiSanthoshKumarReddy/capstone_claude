# Raw Repository Facts

## Project Identification
- Repository: `KaladiSanthoshKumarReddy/capstone_claude`
- Primary language: **TypeScript**
- Application type: **Full-stack web app / monorepo**
- Backend framework: **Node.js + Express**
- Frontend framework: **React 18 + Vite**
- Database layer: **SQLite via `@libsql/client`**

## Repository Structure
- `backend/` — TypeScript Express API
- `frontend/` — React TypeScript UI
- `tests/` — Playwright E2E suite
- `.claude/` — Claude Code agents, commands, workflow, and settings
- Root artifacts: `README.md`, `package.json`, `.env.example`, `requirements.md`, `architecture.md`, `impl-plan.md`, `verification-report.md`, `CHANGELOG.md`, `sdlc-report.html`

## Build Tooling
### Root
- `npm run install:all` — install dependencies for backend, frontend, and tests
- `npm run dev` — start backend and frontend concurrently with `concurrently`
- `npm run build` — build backend and frontend
- `npm run test` — run frontend unit tests and Playwright E2E tests
- `npm run test:unit` — run Vitest only
- `npm run test:e2e` — run Playwright only

### Backend
- Dev server: `ts-node-dev --respawn src/index.ts`
- Build: `tsc`
- Start: `node dist/index.js`

### Frontend
- Dev server: `vite`
- Build: `tsc && vite build`
- Preview: `vite preview`

### E2E Tests
- `playwright test`
- `playwright show-report`

## Major Dependencies
### Root
- `concurrently`

### Backend runtime dependencies
- `express`
- `cors`
- `dotenv`
- `jsonwebtoken`
- `zod`
- `@libsql/client`

### Backend dev dependencies
- `typescript`
- `ts-node-dev`
- `@types/express`
- `@types/cors`
- `@types/jsonwebtoken`
- `@types/node`

### Frontend runtime dependencies
- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `zustand`

### Frontend dev dependencies
- `vite`
- `@vitejs/plugin-react`
- `vitest`
- `jsdom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`
- `typescript`
- React type packages

### Test dependencies
- `@playwright/test`
- `typescript`
- `@types/node`

## Testing Frameworks
- Unit tests: **Vitest** in `frontend/`
- E2E tests: **Playwright** in `tests/`
- Vitest environment: `jsdom`
- Playwright target: Chromium desktop

## Main Execution Entry Points
### Backend entry point
- `backend/src/index.ts`
  - Loads env via `dotenv`
  - Configures CORS and JSON middleware
  - Mounts `/api/auth`, `/api/items`, `/api/debug`
  - Exposes `/api/health`
  - Calls `initDb()` and starts Express server

### Frontend entry point
- `frontend/src/main.tsx`
  - Mounts React app inside `BrowserRouter`

### Frontend routing entry
- `frontend/src/App.tsx`
  - Routes `/`, `/login`, `/register`, `/dashboard`, and fallback `*`

### Database initialization entry
- `backend/src/db/init.ts`
  - Creates SQLite client
  - Creates/updates tables with additive migrations

### Auth entry/middleware
- `backend/src/middleware/auth.ts`
  - Validates JWT Bearer tokens for protected routes

### E2E test entry
- `tests/playwright.config.ts`
  - Defines Playwright project, browser, and auto-start web servers

## Environment Variables
From `.env.example` and code usage:
- `FRONTEND_PORT` — default `3000`
- `BACKEND_PORT` — default `4000`
- `DATABASE_PATH` — default `./data/capstone.db`
- `JWT_SECRET` — default `change-me-in-production` / fallback `dev-secret`
- `GIT_REPO_URL`
- `GIT_BRANCH` — default `main`
- `GITHUB_TOKEN`
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT_KEY`
- `CONFLUENCE_BASE_URL`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`
- `CONFLUENCE_SPACE_KEY`
- `NODE_ENV` — used to disable debug routes in production

## Key Configuration Files
- `package.json` — root scripts and workspace orchestration
- `backend/package.json` — backend scripts/dependencies
- `frontend/package.json` — frontend scripts/dependencies
- `tests/package.json` — Playwright scripts/dependencies
- `backend/tsconfig.json` — strict TypeScript compilation target for server
- `frontend/tsconfig.json` — strict TypeScript compilation target for client
- `frontend/vite.config.ts` — dev server port/proxy
- `frontend/vitest.config.ts` — Vitest config
- `tests/playwright.config.ts` — E2E config and webServer startup
- `.env.example` — documented environment variables
- `README.md` — overall architecture, run instructions, and SDLC pipeline description

## Project Language and Framework Summary
- Language: **TypeScript** across backend, frontend, and tests
- Backend framework: **Express**
- Frontend framework: **React 18** with **Vite**
- Testing stack: **Vitest** + **Playwright**
- Styling: **Tailwind CSS**
- State management: **Zustand**
- HTTP client: **Axios**
- Database: **SQLite via @libsql/client**

## Notable Implementation Facts
- Backend uses parameterized SQL in the `{ sql, args }` format.
- Auth uses JWT with a shared `JWT_SECRET`.
- Passwords are SHA-256 hashed.
- Frontend uses a shared Axios client with JWT injection and 401 redirect handling.
- Dashboard state is driven by URL search params.
- Tests rely on `data-testid` selectors and page objects.
- The repo also contains a Claude Code SDLC automation framework in `.claude/`.

## Files Not Present in the Main Branch Scan
- No `pom.xml`
- No `build.gradle`
- No `requirements.txt`
- No Python package manifest detected
