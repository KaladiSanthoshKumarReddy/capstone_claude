---
name: sdlc-phase-2-architecture
description: >
  SDLC Stage 2 — Architecture Design for the Capstone Item Manager. Reads requirements.md and the
  live codebase, then writes architecture.md (HLD, component + sequence diagrams, DB schema diff,
  API contracts, ADRs, FR traceability, OWASP analysis). Use for "run stage 2", "design the
  architecture", "write architecture.md".
---

# Skill: Stage 2 — Architecture Design

## Purpose
Translate validated requirements into an implementation-ready design for THIS stack only
(React+Vite+Tailwind / Express+TS / SQLite libsql / JWT). Preserve existing patterns.

## Prerequisites
- `requirements.md` exists with ≥ 10 FRs (Stage 1 PASS).

## Pre-Reads (understand current system)
- `backend/src/db/init.ts` — current schema + additive-migration pattern.
- `backend/src/routes/items.ts`, `backend/src/routes/auth.ts` — current API shape.
- `backend/src/middleware/auth.ts` — auth flow.
- `frontend/src/api/client.ts` — JWT interceptor; `frontend/src/store/` — Zustand stores.

## Gate Criteria — PASS
1. `architecture.md` exists and covers ALL FRs (≥ 80% direct traceability, 100% preferred).
2. ≥ 1 component diagram (Mermaid) + ≥ 1 sequence diagram (happy + error path).
3. Database changes are **additive only** (ALTER ADD / new CREATE; no DROP, no data loss) with a
   migration strategy matching `backend/src/db/init.ts`.
4. Every new/changed API endpoint documents: method, path, auth, request body, response shape
   (`{success,data}` / `{success,error}`), and Zod validation rules.
5. ≥ 1 ADR documenting a real decision + trade-offs.
6. OWASP Top 10 analysis of the new attack surface.
7. No new npm dependency unless justified by an ADR.

## Gate Criteria — FAIL
- Any FR untraceable, destructive migration, endpoint missing auth/contract, or new dep without ADR.
- Remediation: revise design; re-run Stage 2.

## Core Steps
1. Read `requirements.md`; list every FR/AC to cover.
2. Read the current codebase (pre-reads above).
3. Design components + data flow (Mermaid); define sequence diagrams for main flows.
4. Specify DB schema diff (additive) + migration strategy.
5. Specify API contracts + Zod validation; specify frontend components/state changes.
6. Record ADR(s); run OWASP analysis; build FR traceability matrix; list risks + mitigations.
7. Write `architecture.md`; update `/memories/session/phase-02-state.md`; print gate message.

## Output — `architecture.md` structure
Overview → Component Diagram (Mermaid) → Sequence Diagrams → Database Schema Changes
(current / proposed / migration) → API Contract Changes (table + validation) → Frontend Changes
(new/modified components, state) → ADRs → FR Traceability Matrix → Security Analysis (OWASP)
→ Risks & Mitigations.

## Gate Message
```
✅ STAGE 2 COMPLETE — Architecture
📄 Artifact: architecture.md
📊 <N> components · <E> endpoints · <A> ADRs · FR coverage <x>/<y>
🎯 Next: Stage 3 — Design Review
⏸️  GATE: Review architecture.md → approve / continue / proceed  ·  reject / rework / redo
```

## Notes
- Preserve auth flow, DB init pattern, and API-client interceptor unless an ADR justifies change.
- If Stage 3 REJECTS, you will be re-invoked with the rejection findings as input.
- Detailed guidance: `.claude/instructions/phase-02-architecture.instructions.md`.
