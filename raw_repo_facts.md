# Raw Repository Facts

## Repository Snapshot
- **Repository:** `KaladiSanthoshKumarReddy/capstone_claude`
- **Primary branch scanned:** `main`
- **Project type:** Full-stack web application plus SDLC automation tooling
- **Top-level focus:** React frontend, Express/TypeScript backend, Playwright E2E tests, Claude Code pipeline artifacts

## Project Language and Frameworks
### Main languages
- **TypeScript** is the dominant language across backend, frontend, and tests.
- **React** is used on the frontend.
- **Node.js** powers the backend and repository-level orchestration scripts.

### Frontend framework/tooling
- **React 18**
- **Vite 5** as build/dev tool
- **Tailwind CSS 3** for styling
- **Zustand** for auth state
- **Axios** for HTTP calls
- **React Router v6** for routing
- **Vitest + jsdom** for unit tests

### Backend framework/tooling
- **Express 4** API server
- **SQLite** via `@libsql/client`
- **JWT** authentication with `jsonwebtoken`
- **Zod** validation
- **ts-node-dev** for dev runtime
- **TypeScript** compilation for production build

### Test framework
- **Playwright** for end-to-end tests
- Playwright config runs Chromium and auto-starts backend/frontend web servers.

## Root Metadata and Repository Scripts
### Root `package.json`
Key scripts:
- `install:all` — installs dependencies in `frontend`, `backend`, and `tests`
- `dev` — runs backend and frontend concurrently
- `build` — builds backend then frontend
- `test` — runs frontend unit tests and Playwright E2E tests
- `test:unit` — frontend Vitest suite only
- `test:e2e` — Playwright suite only
- `test:report` — opens Playwright report

Root dev dependency:
- `concurrently`

## Major Dependencies
### Backend dependencies (`backend/package.json`)
- `@libsql/client`
- `cors`
- `dotenv`
- `express`
- `jsonwebtoken`
- `zod`

Backend dev dependencies:
- `ts-node-dev`
- `typescript`
- Type definitions for Node/Express/CORS/JWT

### Frontend dependencies (`frontend/package.json`)
- `axios`
- `react`
- `react-dom`
- `react-router-dom`
- `zustand`

Frontend dev dependencies:
- `vite`
- `@vitejs/plugin-react`
- `vitest`
- `jsdom`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- `eslint`
- `typescript`

### Tests dependencies (`tests/package.json`)
- `@playwright/test`
- `typescript`
- `@types/node`

## Build Tools
- **Root orchestration:** `npm` scripts + `concurrently`
- **Backend build:** `tsc`
- **Frontend build:** `tsc && vite build`
- **Frontend dev server:** `vite`
- **E2E runner:** `playwright test`
- **Unit test runner:** `vitest run`

## Environment Variables
### From `.env.example`
Application/runtime:
- `FRONTEND_PORT` (default `3000`)
- `BACKEND_PORT` (default `4000`)
- `DATABASE_PATH` (default `./data/capstone.db`)
- `JWT_SECRET` (required for auth; example uses placeholder)

GitHub / release automation:
- `GIT_REPO_URL`
- `GIT_BRANCH`
- `GITHUB_TOKEN`

Jira / Confluence (optional Stage 1 integrations)
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT_KEY`
- `CONFLUENCE_BASE_URL`
- `CONFLUENCE_EMAIL`
- `CONFLUENCE_API_TOKEN`
- `CONFLUENCE_SPACE_KEY`

## Core Execution Entry Points
### Backend entry point
- `backend/src/index.ts`
  - Boots Express app
  - Applies CORS and JSON middleware
  - Mounts `/api/auth`, `/api/items`, and debug routes
  - Exposes `/api/health`
  - Initializes DB via `initDb()` and starts listening on `BACKEND_PORT`

### Frontend entry point
- `frontend/src/main.tsx`
  - Mounts React root
  - Wraps app in `BrowserRouter`
  - Loads global styles
- `frontend/src/App.tsx`
  - Defines routes for `/`, `/login`, `/register`, `/dashboard`, and fallback `*`

### Data/auth API entry points
- `frontend/src/api/client.ts`
  - Central Axios client with JWT header injection and 401 redirect handling
- `frontend/src/api/items.ts`
  - Item CRUD and CSV export API functions
- `frontend/src/store/authStore.ts`
  - Persists auth token/email in localStorage

### Backend logical entry points
- `backend/src/db/init.ts`
  - Initializes SQLite schema and additive migrations
- `backend/src/middleware/auth.ts`
  - JWT verification middleware
- `backend/src/routes/auth.ts`
  - Login/register endpoints
- `backend/src/routes/items.ts`
  - Auth-protected item CRUD and CSV export endpoints
- `backend/src/routes/debug.ts`
  - Dev-only debug HTML/data endpoints

## Database and Runtime Notes
- Database is a **local SQLite file** managed through `@libsql/client`.
- Schema initialization creates `users` and `items` tables.
- Additive migrations add `updated_at` and `tags` columns if missing.
- Auth uses SHA-256 password hashing and JWTs with 8-hour expiry.
- Protected item routes require `Authorization: Bearer <token>`.

## Testing Setup
### Unit tests
- Located in `frontend/src/**/__tests__/`
- Run via `vitest`
- Environment: `jsdom`

### E2E tests
- Located in `tests/e2e/specs/`
- Run via `@playwright/test`
- Base URL: `http://localhost:3000`
- Backend URL: `http://localhost:4000`
- Playwright `webServer` config auto-starts both services when needed

## Pipeline / Automation / Metadata Files
### SDLC automation framework
- `.claude/agents/*` — SDLC agent definitions
- `.claude/commands/*` — Claude slash commands
- `.claude/workflows/sdlc-full-pipeline.js` — orchestration workflow
- `.claude/settings.json` — permissions, hooks, MCP servers
- `CLAUDE.md` — root project instructions
- `backend/CLAUDE.md`, `frontend/CLAUDE.md`, `tests/CLAUDE.md` — scoped instructions

### Documentation artifacts
- `README.md`
- `architecture.md`
- `design-review.md`
- `impl-plan.md`
- `requirements.md`
- `verification-report.md`
- `CHANGELOG.md`
- `sdlc-report.html`
- `docs/AI_SDLC_OVERVIEW.md`

## Pipeline / CI Configuration
- `.github/workflows` directory was checked and **no workflow files were present** in the repository tree returned by the scan.

## Notable Project Characteristics
- This is not a single-app repo; it combines:
  - a production-style item manager app
  - Claude Code SDLC automation assets
  - unit and E2E test suites
- The codebase is strongly typed, lintable, and designed around explicit testability with `data-testid` attributes and URL-driven dashboard state.
