# Application Profile: capstone_claude

---

## 1. Executive Summary
* **Application Name:** capstone_claude
* **Service Owner:** Not Specified
* **Business Impact:** Not Specified
* **Description:** Multi-workspace monorepo containing a full-stack application, tests, and Claude Code SDLC automation.

---

## 2. System Architecture & Tech Stack

| Component | Specification |
| :--- | :--- |
| **Language/Runtime** | TypeScript |
| **Frameworks** | Frontend: React 18, Vite 5, Tailwind CSS 3, Zustand, Axios, React Router v6; Backend: Express 4, SQLite via `@libsql/client`, JWT (`jsonwebtoken`), Zod, dotenv, cors |
| **Primary Database** | SQLite via `@libsql/client` |
| **Cloud Provider** | Not Specified |
| **Infrastructure** | Multi-workspace monorepo with frontend, backend, tests, and Claude automation; npm-script-based orchestration |

---

## 3. Integration & Dependencies
* **Upstream Dependencies:** Not Specified
* **Downstream Consumers:** Not Specified
* **External APIs:** GitHub API, Jira REST API, Confluence REST API

---

## 4. Technical Configuration
* **Main Branch:** `main`
* **Build Tool:** npm scripts with TypeScript (`tsc`) and Vite builds
* **Critical Env Variables:** `FRONTEND_PORT`, `BACKEND_PORT`, `DATABASE_PATH`, `JWT_SECRET`, `GIT_REPO_URL`, `GIT_BRANCH`, `GITHUB_TOKEN`, `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, `JIRA_PROJECT_KEY`, `CONFLUENCE_BASE_URL`, `CONFLUENCE_EMAIL`, `CONFLUENCE_API_TOKEN`, `CONFLUENCE_SPACE_KEY`
* **Deployment Pipeline:** Not Specified

---

## 5. Quality & Compliance
* **Test Frameworks:** Vitest with jsdom; Playwright (`@playwright/test`)
* **Code Coverage Goal:** Not Specified
* **Security Scanning:** Not Specified
* **Observation/Logging:** Not Specified

---

## 6. Documentation & Resources
* **GitHub Repository:** [https://github.com/KaladiSanthoshKumarReddy/capstone_claude](https://github.com/KaladiSanthoshKumarReddy/capstone_claude)
* **API Documentation:** Not Found
* **JIRA Board:** Not Found
* **On-Call Rotation:** Not Found

---

## 7. Deployment Status

> **Current Version:** Not Specified
> **Last Updated:** Not Specified *(via ELITEA Automated Sync)*