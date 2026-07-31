# Design Review — Export Items List to CSV

**Verdict: APPROVED**

---

## Executive Summary

The architecture for the CSV export feature is well-structured, thorough, and aligns tightly with the 13 functional requirements and 20 acceptance criteria in `requirements.md`. All six review dimensions pass. The design correctly extends the existing authenticated router, reuses the existing Axios client and filter logic, introduces no new npm dependencies, and contains no destructive database migrations. Three ADRs document the key design decisions with appropriate justification.

No CRITICAL findings were identified. Eight WARNING-level findings are documented below. Three of the warnings must be actioned during Stage 5 implementation to prevent subtle bugs; the remainder are improvement notes.

---

## Review Summary

| Dimension | Result | Findings |
|-----------|--------|----------|
| FR Coverage | PASS | 0 uncovered FRs (13/13 traced) |
| AC Coverage | PASS | All 20 ACs testable from the proposed design |
| API Contracts | PASS | Method, path, auth, params, error shapes all specified |
| Database Safety | PASS | No schema changes; no destructive operations; parameterized queries confirmed |
| Security (OWASP) | PASS | All 10 categories evaluated; 2 warnings (CSV injection, no rate limiting) |
| Convention Compliance | PASS | response shape, authMiddleware, api/client.ts, Zod validation, no hardcoded secrets all verified |
| Completeness | PASS | Sequence diagrams, DB changes, API contracts, ADRs, traceability matrix all present |
| NFR Coverage | PASS | NFR-01 through NFR-04 each have a concrete design element |

---

## Detailed Findings

### CRITICAL (blocks APPROVED verdict)

None. No critical findings were identified.

---

### WARNING (noted; does not block approval)

**W-01 — CSV Formula Injection Not Mitigated (OWASP A08)**

The `escapeCsvField()` function handles RFC 4180 field delimiters (comma, double-quote, CR, LF) as required by FR-11. It does not sanitize formula injection payloads — cell values beginning with `=`, `+`, `-`, or `@` are written verbatim. A user whose item `title` contains `=HYPERLINK("http://evil.com","click")` will produce a cell that executes in Microsoft Excel and LibreOffice Calc when the exported file is opened.

The architecture's OWASP A08 discussion correctly notes that data originates from DB rows, but those rows contain user-supplied values validated only for length and type — not for formula prefixes.

Suggested fix for Stage 5: in `escapeCsvField()`, if a field value (after quoting) begins with `=`, `+`, `-`, or `@`, prepend a single tab or space before the value within the quotes. This is the OWASP-recommended defense and is invisible when the file is opened in a plain text editor or a standards-compliant CSV parser.

**W-02 — Blob responseType + JSON Error Body Mismatch**

When Axios issues a request with `responseType: 'blob'`, any error response body (400, 500) also arrives as a Blob, not as a parsed object. In the `ExportCsvButton` catch block, `error.response.data` will be a Blob, not the JSON `{ success: false, error: "..." }` shape. The architecture handles this by showing a generic `"Export failed. Please try again."` message, which is acceptable for MVP, but the specific server error is silently dropped.

Note: the 401 case is not affected — the Axios response interceptor checks `err.response?.status`, not `err.response.data`, so the redirect fires correctly regardless of responseType.

Suggested fix for Stage 5: in the catch block, if `error.response?.data instanceof Blob`, read the Blob as text with `error.response.data.text()` and attempt to parse it as JSON before falling back to the generic message.

**W-03 — Route Ordering Constraint Is Not Enforced**

The risk table documents that `GET /export` must be registered before any future `GET /:id` route. Currently `items.ts` has no `GET /:id` route, so there is no conflict today. If a developer adds one later without awareness of this constraint, Express will match `/export` as `{ id: 'export' }` instead of the export handler.

Suggested fix for Stage 5: add an inline comment directly above the `router.get('/export', ...)` declaration:
```typescript
// IMPORTANT: must remain above any router.get('/:id', ...) route — see architecture.md ADR-03
```

**W-04 — Existing Route Handlers Lack try/catch (No Global Error Handler)**

The new export handler correctly wraps its DB call in try/catch. However, the existing `GET /`, `POST /`, `PATCH /:id`, and `DELETE /:id` handlers in `items.ts` have no try/catch, and `index.ts` registers no Express error-handling middleware (`(err, req, res, next) => {...}`). In Express 4, an async route handler that throws without being caught causes an unhandled promise rejection and may hang the request or crash the process.

This is a pre-existing issue not introduced by this feature. The new handler sets a better pattern. Suggested fix for Stage 5: add a generic Express error handler at the bottom of `index.ts` so unhandled route errors produce a 500 JSON response rather than an unresolved request.

**W-05 — Missing data-testid on Error Message Element in ExportCsvButton**

The frontend `CLAUDE.md` requires `data-testid` attributes on all interactive and display elements. The architecture specifies `data-testid="export-csv-button"` on the button but does not name a `data-testid` for the inline error message paragraph that appears on export failure. Stage 7 E2E tests (AC coverage for error scenarios) will need to locate this element.

Suggested fix for Stage 5: add `data-testid="export-csv-error"` to the error display element.

**W-06 — `SELECT *` in Existing List Handler vs Explicit SELECT in Export Handler**

The existing `GET /` handler uses `SELECT * FROM items` (line 72 of `items.ts`), which returns all columns including `user_id` and `tags`. The export handler correctly uses an explicit column list (`SELECT id, title, description, status, created_at, updated_at`). This inconsistency is not a bug in the export feature, but it means any future column added to the `items` table will automatically appear in the list API response (potentially leaking internal fields) while the export will remain unaffected. No action required for this feature, but the inconsistency is noted.

**W-07 — No Rate Limiting on Export Endpoint**

An authenticated user can invoke `GET /api/items/export` in a tight loop. Each call triggers a `SELECT ... LIMIT 1000` query and serializes up to 1000 rows into a response. Neither the architecture nor the requirements specify rate limiting. For a single-user development tool this is acceptable, but it should be documented.

**W-08 — filename Date Computed Independently Server-Side and Client-Side**

The `Content-Disposition` filename is set server-side using the server's `new Date().toISOString().slice(0, 10)`. The anchor element's `download` attribute is set client-side using the client's `new Date().toISOString().slice(0, 10)`. Because `toISOString()` always returns UTC, both produce the same UTC date except within a brief window around UTC midnight when the two calls could land on different calendar dates. The browser uses the `download` attribute for the saved filename, so the `Content-Disposition` filename is cosmetic only. Low-impact but worth aligning.

---

## APPROVED with Conditions

The following conditions must be met during Stage 5 implementation:

1. **Register `GET /export` before any parameterized `GET /:id` route** in `items.ts`. Add the inline comment specified in W-03.

2. **Build the full CSV string in memory before calling `res.setHeader()`**. If `res.setHeader('Content-Type', 'text/csv')` is called before the CSV serialization loop, and the loop subsequently throws, Express cannot replace the already-sent headers with the JSON 500 response (violating NFR-04). The correct pattern: build the CSV string in its entirety inside the try block, then set headers and call `res.send(csvString)` as a single atomic step.

3. **Use an explicit column list in the export SELECT**: `SELECT id, title, description, status, created_at, updated_at FROM items WHERE ...`. Never use `SELECT *` in the export handler.

4. **Zod schema accepts `'all'` as a valid enum value; the handler must also strip it**. The `buildItemsWhereClause()` helper should treat `status === 'all'` identically to `status === undefined/null` — no status WHERE clause added. Verify this matches the behavior of the existing list handler.

5. **Extract `buildItemsWhereClause()` without changing the behavior of the existing `GET /` handler**. Run the existing items-list E2E/unit tests after extraction to confirm no regression.

6. **Stage 7 test data must include items with commas, double-quotes, and embedded newlines** to provide coverage for AC-17 and AC-18. Plain text items will not exercise the RFC 4180 escaping path.

---

## Traceability Verification

| FR-ID | Covered by Architecture | Notes |
|-------|------------------------|-------|
| FR-01 | `ExportCsvButton.tsx` rendered in `Dashboard.tsx` filter bar | `data-testid="export-csv-button"` specified |
| FR-02 | `GET /api/items/export` in `routes/items.ts`; `res.setHeader('Content-Type', 'text/csv')` | CSV built by `escapeCsvField` / `buildCsvRow` |
| FR-03 | `router.use(authMiddleware)` at router level; applies to all routes including `/export` | Returns `{ success: false, error: "..." }` 401 |
| FR-04 | `WHERE user_id = ?` bound to `req.userId` from JWT; `exportQuerySchema` has no `user_id` field | Client-supplied `user_id` param silently discarded |
| FR-05 | `exportQuerySchema.status` (Zod enum); `status = ?` clause in `buildItemsWhereClause()` | `'all'` and `undefined` produce no status clause |
| FR-06 | `exportQuerySchema.search` (Zod string max 200); `(title LIKE ? OR description LIKE ?)` in helper | Parameterized `%search%` LIKE binding |
| FR-07 | Hardcoded header line; SELECT names exactly 6 columns | Order is fixed in code |
| FR-08 | `LIMIT 1000` in SQL inside export handler | Applied at DB layer before serialization |
| FR-09 | `Content-Disposition: attachment` response header; programmatic `<a download>` click | User stays on Dashboard |
| FR-10 | Zero-row query produces only header line; loop over empty rows array produces nothing | No special-case branch needed |
| FR-11 | `escapeCsvField()` wraps fields containing `,`, `"`, `\r`, `\n`; doubles internal `"` | RFC 4180 sections 2.6 and 2.7 |
| FR-12 | `exportItems()` passes `search` and `status` as Axios query params from Dashboard URL state | Consistent with `fetchItems()` |
| FR-13 | `buildItemsWhereClause()` shared helper called by both `GET /` and `GET /export` (ADR-03) | Single implementation; identical filter semantics |

All 13 FRs are fully covered by concrete architecture elements.

---

## AC Coverage Verification

All 20 acceptance criteria are testable from the proposed design:

- **AC-01, AC-02** (FR-01): `ExportCsvButton` rendered in `Dashboard.tsx`; `ProtectedRoute` handles redirect for unauthenticated users.
- **AC-03, AC-04** (FR-02): `Content-Type: text/csv` header; well-formed CSV body with header on line 1.
- **AC-05, AC-06** (FR-03): `authMiddleware` returns 401 `{ success: false, error: "..." }` for missing/expired tokens.
- **AC-07** (FR-04): `WHERE user_id = ?` isolation; testable with two separate user accounts.
- **AC-08, AC-09** (FR-05): Status filter applied via shared helper; omitted when value is `all`.
- **AC-10** (FR-06): Search filter via LIKE parameterized query.
- **AC-11, AC-12** (FR-07): Fixed header row; explicit 6-column SELECT.
- **AC-13, AC-14** (FR-08): `LIMIT 1000` at SQL layer; tested with 1000 and 1500 rows.
- **AC-15** (FR-09): Programmatic anchor download; browser stays on Dashboard (no navigation).
- **AC-16** (FR-10): Empty query result produces headers-only CSV.
- **AC-17, AC-18** (FR-11): `escapeCsvField()` wraps comma-containing fields and doubles internal quotes.
- **AC-19** (FR-12): `exportItems()` builds query string from Dashboard URL params.
- **AC-20** (FR-13): Shared `buildItemsWhereClause()` guarantees identical results for same inputs.

---

## NFR Coverage Verification

| NFR-ID | Category | Design Element | Assessment |
|--------|----------|---------------|------------|
| NFR-01 | Performance | `LIMIT 1000` at SQL layer; single SQLite file I/O; in-memory CSV serialization; no streaming required | PASS — design inherently meets 3-second budget for 1000 rows |
| NFR-02 | Security | `exportQuerySchema` has no `user_id` field; `WHERE user_id = ?` bound exclusively from `req.userId` (JWT); explicitly documented in A01 | PASS |
| NFR-03 | Usability | `isExporting` state disables button from click; `finally` block resets it; loading label shown | PASS |
| NFR-04 | Reliability | `try/catch` in export handler; full CSV built in memory before headers set; JSON error responses on 400/401/500 | PASS — with condition that headers are set only after full CSV build (see implementation condition 2 above) |

---

## Security Sign-off

Each OWASP Top 10 (2021) category was evaluated against the new attack surface introduced by this feature:

| Category | Evaluation | Result |
|----------|-----------|--------|
| A01 Broken Access Control | `user_id` sourced from JWT only; `exportQuerySchema` contains no `user_id` field; client parameter silently discarded | PASS |
| A02 Cryptographic Failures | No new cryptographic operations; JWT verification unchanged | PASS |
| A03 Injection | All query params passed as bound args in `{ sql, args }` format; `status` constrained to Zod enum; `search` bounded to 200 chars and LIKE-wrapped in code | PASS |
| A04 Insecure Design | `LIMIT 1000` at DB layer; 200-char search cap; user-scoped results only | PASS |
| A05 Security Misconfiguration | `router.use(authMiddleware)` at router level; export route inherits auth automatically | PASS |
| A06 Vulnerable and Outdated Components | No new npm packages introduced (ADR-01) | PASS |
| A07 Identification and Authentication Failures | `jwt.verify()` on every request; expired/invalid tokens receive 401 with no data | PASS |
| A08 Software and Data Integrity Failures | RFC 4180 field escaping present; **CSV formula injection not mitigated (W-01)** | PASS with WARNING |
| A09 Security Logging and Monitoring Failures | `try/catch` with `console.error` before 500 response | PASS |
| A10 SSRF | No outbound HTTP requests in export handler; local SQLite read only | N/A — not applicable |

---

## Reviewer Notes for Stage 4 and Stage 5

1. The `buildItemsWhereClause()` extraction (ADR-03) is the highest-risk implementation task. It refactors existing code that is currently passing. Stage 4 must assign this its own task item with a "verify existing list endpoint unchanged" success criterion.

2. The existing items.ts route handlers have no try/catch and the app has no global Express error handler. The export handler's try/catch establishes a better pattern. Stage 4 should optionally include a task to add a global error handler in `index.ts`.

3. The `exportItems()` function must strip `status === 'all'` before building query params. The architecture documents this, but it is subtle — if status is `'all'`, no `status` param should appear in the URL (not `?status=all`), consistent with how `fetchItems()` works.

4. Stage 7 test data must include at least one item with: (a) a comma in the title, (b) a double-quote in the description, (c) a newline in the description, to provide AC-17 and AC-18 coverage.

5. The component unmounts on 401 redirect without needing cleanup. However, `URL.revokeObjectURL()` must still be called in the `finally` block for the success path to prevent memory leaks.

6. The Blob download mechanism (ADR-02) is the correct security choice. Do not revert to the query-parameter JWT approach under any circumstances — it would expose tokens in server logs and browser history.
