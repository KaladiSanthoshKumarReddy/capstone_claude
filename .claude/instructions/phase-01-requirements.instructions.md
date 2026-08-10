---
description: Stage 1 detailed how-to — requirements extraction and clarifying-question technique for the Capstone Item Manager.
appliesTo: Stage 1 (Requirements)
---

# Phase 1 — Requirements Engineering (Detailed)

## Objective
Produce a `requirements.md` that is complete, testable, and traceable, after resolving ambiguity
with the human. Requirements are the contract; get them right before any design.

## Inputs (precedence)
1. `user-story.md` (always read first).
2. Linked Jira issue (e.g. `EPMCDMETST-55846`) — fetch via GitHub/Jira MCP, else ask user to paste.
3. Linked Confluence page — fetch via MCP, else ask user to paste.

## Step A — Clarify First (capstone Step 1 requirement)
Copilot must *ask*, not assume. After reading the story, list up to 5 targeted questions covering:
- **Scope & data**: which fields of `items` (id, title, description, status, tags, created_at,
  updated_at) are involved? New fields?
- **Auth scope**: per-user (JWT) or shared? (default per-user; no cross-user leakage).
- **Limits**: pagination, max records (e.g. 1000), payload/file size, rate limiting.
- **Behavior on edge**: empty list, missing field, invalid input, "Not Found".
- **Non-functional**: performance target, browser support, accessibility, i18n.
Wait for answers (or an explicit "assume defaults"), then capture them under *Clarifications*.

## Step B — Extract Functional Requirements
- One requirement per capability, numbered `FR-01…`, imperative "The system SHALL…".
- Split compound sentences into separate FRs. Aim for ≥ 10.

## Step C — Non-Functional Requirements
- ≥ 3, categorized (Performance, Security, Usability, Reliability, Accessibility). Make them measurable.

## Step D — Acceptance Criteria
- Convert each user-story AC and each FR into `AC-01…` in **Given / When / Then**.
- Every AC must be objectively testable. Cover happy path AND edge cases ('Not Found', empty, invalid).
- Aim for ≥ 15; every AC references its FR.

## Step E — Scope, Constraints, Assumptions
- In-scope vs out-of-scope bullet lists.
- Constraints: fixed stack (React/Vite/Tailwind, Express/TS, SQLite libsql, JWT, Playwright/Vitest).
- Assumptions: anything inferred where the story was silent.

## Step F — Traceability Matrix
`| AC-ID | FR-ID | Test Coverage (TBD Stage 7) |` — one row per AC.

## Do / Do NOT
**Do:** ask before assuming; keep criteria testable; tie every AC to an FR.
**Do NOT:** design solutions, name implementation files, choose libraries, or write tests here.

## Gate (see gate-validation-checklist.md → Gate 1)
PASS requires: ≥10 FR, ≥3 NFR, ≥15 AC, full traceability, scope + out-of-scope, no placeholders.

## Example (this app)
> FR-07: The system SHALL export the currently filtered items list as a CSV download.
> AC-12: Given the user has applied a status filter, When they click "Export CSV", Then the
> downloaded file contains only items matching that filter, with headers
> `id,title,description,status,created_at,updated_at`.
