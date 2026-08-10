---
description: Stage 2 detailed how-to — architecture design method for the Capstone Item Manager stack.
appliesTo: Stage 2 (Architecture)
---

# Phase 2 — Architecture Design (Detailed)

## Objective
Turn `requirements.md` into an implementation-ready `architecture.md` for THIS stack only. Preserve
existing patterns; design the smallest change that satisfies every FR.

## Pre-Reads (mandatory — understand the current system first)
- `backend/src/db/init.ts` — schema + additive-migration idiom (`PRAGMA table_info` guard).
- `backend/src/routes/items.ts`, `backend/src/routes/auth.ts` — current endpoints + response shape.
- `backend/src/middleware/auth.ts` — `AuthRequest`, JWT verification, `req.user`.
- `frontend/src/api/client.ts` — Axios/fetch wrapper + JWT interceptor + error handling.
- `frontend/src/store/authStore.ts`, `frontend/src/types/index.ts` — state + shared types.

## Required Sections
1. **Overview** — what changes and why (1 paragraph).
2. **Component Diagram** — Mermaid `graph` of affected modules and edges.
3. **Sequence Diagrams** — Mermaid `sequenceDiagram` for the happy path AND ≥ 1 error path.
4. **Database Schema Changes** — current relevant tables → proposed additive changes → migration
   strategy (using the `PRAGMA table_info` guard; no DROP).
5. **API Contract Changes** — table: `Method | Path | Auth | Request Body | Response` + Zod rules.
6. **Frontend Changes** — new/modified components (props interface), state changes (Zustand/URL params).
7. **ADRs** — `ADR-01: Title` with Status / Context / Decision / Consequences.
8. **FR Traceability Matrix** — `FR-ID | Architecture Element | Notes`.
9. **Security Analysis** — walk each relevant OWASP Top 10 category for the new surface.
10. **Risks & Mitigations** — table.

## Design Rules (this stack)
- Reuse `authMiddleware` for protected routes; new item endpoints scope by `req.user.id`.
- Follow response contract `{success,data}` / `{success,error}` exactly.
- Additive migrations only. New columns nullable or defaulted.
- No Redis/queues/new frameworks. No new npm dependency unless an ADR justifies it.
- For large responses (e.g. CSV export up to 1000 rows) prefer streaming/`res.setHeader` with
  `text/csv` and `Content-Disposition`; keep memory bounded.

## Do / Do NOT
**Do:** trace every FR; keep it minimal; document trade-offs in ADRs.
**Do NOT:** write code, invent requirements, or propose infra the stack does not use.

## Gate (see gate-validation-checklist.md → Gate 2)
PASS requires: ≥80% FR traceability, diagrams, additive DB plan, complete API contracts, ≥1 ADR,
OWASP analysis, justified dependencies.
