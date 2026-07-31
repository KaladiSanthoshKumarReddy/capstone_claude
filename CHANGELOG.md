## [Unreleased] — Export Items List to CSV

### Added
- **Export CSV button** on the Dashboard page for all authenticated users — visible in the filter bar alongside the existing search and status controls.
- **`GET /api/items/export` endpoint** that returns the authenticated user's filtered items as a downloadable RFC 4180-compliant CSV file (`Content-Type: text/csv`, `Content-Disposition: attachment`).
- **Filter-aware export** — the active status filter and search query from the Dashboard are passed as query parameters to the export endpoint, so the downloaded file always matches the current list view.
- **RFC 4180 special-character escaping** — fields containing commas, double-quote characters, carriage returns, or newlines are correctly quoted and escaped in the CSV output.
- **1000-item export cap** — exports are limited to the first 1000 matching records (applied at the SQL layer), keeping response sizes predictable and within the 3-second performance budget.
- **Button loading state** — the Export CSV button is disabled and shows "Exporting..." from the moment the user clicks until the browser download is initiated or an error is displayed, preventing duplicate submissions.

### Changed
- `GET /api/items` list endpoint now delegates its user/search/status WHERE clause construction to a shared `buildItemsWhereClause()` helper, ensuring consistent filter results between the list view and the export endpoint.
- Dashboard filter bar now includes the `ExportCsvButton` component alongside the existing `SearchBar`, `StatusFilter`, and `TagFilter` controls.

### Technical
- **No database schema changes** — the six export columns (`id`, `title`, `description`, `status`, `created_at`, `updated_at`) already exist in the `items` table.
- **No new npm dependencies** — CSV serialization is implemented as two inline pure functions (`escapeCsvField`, `buildCsvRow`) within `backend/src/routes/items.ts` (ADR-01).
- **JWT delivered via Authorization header** (not URL query parameter) through the existing Axios instance with `responseType: 'blob'`, preventing token exposure in server logs or browser history (ADR-02).
- **Global Express error handler** added to `backend/src/index.ts` — unhandled async route errors now produce a structured `{ success: false, error: "Internal server error" }` JSON 500 response rather than leaving requests unresolved.
- **CSV formula injection mitigation** — fields beginning with `=`, `+`, `-`, or `@` are prefixed with a tab character inside the quoted field (OWASP A08 / design-review W-01).
- New file: `frontend/src/components/ExportCsvButton.tsx`
- Modified files: `backend/src/routes/items.ts`, `backend/src/index.ts`, `frontend/src/api/items.ts`, `frontend/src/pages/Dashboard.tsx`

### Testing
- E2E Tests: 37 passing (21 new export-csv tests + 16 pre-existing login/items tests)
- Unit Tests: 0 (no Vitest test files present in this project)
- ACs covered: 20/20 (100%)
