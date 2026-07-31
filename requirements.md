# Requirements — Export Items List to CSV

## Feature Overview

This feature allows authenticated users of the Capstone Item Manager to export their currently filtered items list as a downloadable CSV file directly from the Dashboard. The export respects the active status filter and search query at the time of the request, scoping results exclusively to the requesting user. This enables users to analyze or share their task data in external tools such as spreadsheet applications.

## Functional Requirements

| ID    | Requirement |
|-------|-------------|
| FR-01 | The system SHALL display an "Export CSV" button on the Dashboard page for all authenticated users. |
| FR-02 | The system SHALL expose a `GET /api/items/export` endpoint that returns item data serialized as CSV with `Content-Type: text/csv`. |
| FR-03 | The system SHALL enforce JWT authentication on the `GET /api/items/export` endpoint via `authMiddleware`, rejecting unauthenticated requests with HTTP 401. |
| FR-04 | The system SHALL scope all exported data to the authenticated user's own items, ensuring no items belonging to any other user are included in the response. |
| FR-05 | The system SHALL apply the currently active status filter from the Dashboard to the export request, including only items that match the selected status value. |
| FR-06 | The system SHALL apply the currently active search query from the Dashboard to the export request, including only items whose title or description matches the search text. |
| FR-07 | The system SHALL include a header row as the first line of the CSV output containing exactly the following column names in order: `id`, `title`, `description`, `status`, `created_at`, `updated_at`. |
| FR-08 | The system SHALL support exporting up to 1000 items per request; if the filtered result set exceeds 1000 items, the system SHALL return the first 1000 records. |
| FR-09 | The system SHALL set a `Content-Disposition: attachment` response header with a descriptive filename (e.g., `items-export-YYYY-MM-DD.csv`) so that the browser initiates a file download. |
| FR-10 | The system SHALL return a valid CSV file containing only the header row and no data rows when the active filter and search criteria match zero items. |
| FR-11 | The system SHALL properly escape CSV field values that contain commas, double-quote characters, or newline characters, in accordance with RFC 4180 conventions. |
| FR-12 | The system SHALL pass the current Dashboard filter state (status and search query) as query string parameters when the frontend calls the export endpoint. |
| FR-13 | The system SHALL reuse the existing item-filtering logic applied by the items list endpoint when processing the export endpoint request, ensuring consistent results between the list view and the export. |

## Non-Functional Requirements

| ID     | Category    | Requirement |
|--------|-------------|-------------|
| NFR-01 | Performance | The system SHALL return the complete CSV export response within 3 seconds for a result set of up to 1000 items under normal operating load. |
| NFR-02 | Security    | The system SHALL guarantee that query parameters supplied by the client cannot override user-scope isolation; the exported data SHALL always be restricted to the authenticated user's items regardless of additional parameters in the request. |
| NFR-03 | Usability   | The system SHALL provide a visible loading or disabled state on the Export CSV button from the moment the user clicks it until the browser download is initiated or an error is surfaced, preventing duplicate submissions. |
| NFR-04 | Reliability | The system SHALL return a structured JSON error response using `{ "success": false, "error": "<message>" }` with an appropriate HTTP 4xx or 5xx status code if the export fails, rather than returning a malformed or partial CSV file. |

## Acceptance Criteria

### FR-01 — Export CSV Button on Dashboard
- AC-01: Given an authenticated user is on the Dashboard page, When the page finishes loading, Then an "Export CSV" button is visible within the Dashboard interface.
- AC-02: Given an unauthenticated user attempts to access the Dashboard, When the page loads, Then the user is redirected to the login page and the Export CSV button is never rendered.

### FR-02 — Export Endpoint Returns CSV Content-Type
- AC-03: Given a valid JWT token is present in the Authorization header, When a client sends `GET /api/items/export`, Then the response `Content-Type` header is `text/csv`.
- AC-04: Given a valid JWT token and at least one matching item, When a client sends `GET /api/items/export`, Then the response body is a well-formed CSV document with the header row on line 1.

### FR-03 — Authentication Enforcement on Export Endpoint
- AC-05: Given a request to `GET /api/items/export` with no Authorization header, When the server receives the request, Then the server responds with HTTP 401 and a JSON body of `{ "success": false, "error": "Unauthorized" }`.
- AC-06: Given a request to `GET /api/items/export` with an expired JWT token, When the server receives the request, Then the server responds with HTTP 401 and does not return any item data.

### FR-04 — User Scope Isolation
- AC-07: Given User A and User B each have separate items in the database, When User A sends `GET /api/items/export` with a valid JWT, Then the CSV response contains only User A's items and none of User B's items.

### FR-05 — Status Filter Applied to Export
- AC-08: Given the Dashboard status filter is set to "completed", When the user clicks Export CSV, Then every data row in the downloaded CSV file has the value "completed" in the `status` column.
- AC-09: Given no status filter is active on the Dashboard, When the user clicks Export CSV, Then the downloaded CSV file contains items of all status values belonging to that user.

### FR-06 — Search Query Applied to Export
- AC-10: Given the Dashboard search field contains the text "project alpha", When the user clicks Export CSV, Then the downloaded CSV file contains only items whose `title` or `description` includes the text "project alpha".

### FR-07 — CSV Column Headers and Data Values
- AC-11: Given an authenticated user exports any set of items, When the CSV file is opened, Then the first row contains exactly and only the column headers: `id`, `title`, `description`, `status`, `created_at`, `updated_at` in that order.
- AC-12: Given an authenticated user exports items with at least one result, When the CSV file is opened, Then each subsequent row contains the correct corresponding values for all six columns, matching the stored data for that item.

### FR-08 — 1000 Item Export Limit
- AC-13: Given a user has exactly 1000 items matching the current filter, When the user clicks Export CSV, Then the CSV file contains all 1000 data rows without truncation.
- AC-14: Given a user has 1500 items matching the current filter, When the user clicks Export CSV, Then the CSV file contains exactly 1000 data rows and the server does not error out.

### FR-09 — Browser File Download Triggered
- AC-15: Given an authenticated user clicks the Export CSV button on the Dashboard, When the server responds successfully, Then the browser initiates a file download and the user remains on the Dashboard page without any navigation.

### FR-10 — Empty Result Produces Headers-Only CSV
- AC-16: Given the active status filter and search query together match zero items, When the user clicks Export CSV, Then the downloaded CSV file contains exactly one line (the header row) and no data rows.

### FR-11 — CSV Special Character Escaping
- AC-17: Given an item's `title` contains a comma (e.g., "Buy milk, eggs"), When that item is included in a CSV export, Then the `title` field value is enclosed in double quotes in the CSV output so that CSV parsers correctly identify it as a single field.
- AC-18: Given an item's `description` contains a double-quote character (e.g., He said "hello"), When that item is included in a CSV export, Then the double-quote character is escaped as two consecutive double-quote characters (`""`) within the quoted field.

### FR-12 — Filter Parameters Sent as Query String
- AC-19: Given the Dashboard has a status filter of "active" and a search query of "widget", When the user clicks Export CSV, Then the frontend sends a request to `/api/items/export?status=active&search=widget` (or equivalent parameter names used by the existing filter logic).

### FR-13 — Export Reuses Existing Filtering Logic
- AC-20: Given a user has applied the same status and search filters on both the Dashboard list view and the export request, When both requests are fulfilled, Then the set of items returned by the export matches the set displayed in the Dashboard list view (subject to the 1000-item export cap).

## Assumptions

- The item data model used by the Dashboard list view is the same data model that will be serialized for export; no additional fields beyond the six specified columns are required at this time.
- "Currently filtered/search results" means the filter state (status value and search text) that is active in the Dashboard UI at the exact moment the user clicks Export CSV.
- A hard cap of 1000 items per export is acceptable to users for this initial release; streaming or multi-file chunked downloads are not required.
- The CSV filename does not need to be user-configurable; a system-generated name including the export date is sufficient.
- The CSV format follows RFC 4180 conventions (comma delimiter, double-quote escaping, CRLF or LF line endings).
- The Export CSV button does not need to be hidden when the result set is empty; an export with headers only is an acceptable outcome.
- The existing JWT authentication mechanism and `authMiddleware` require no modification to support this feature.
- The `created_at` and `updated_at` values will be serialized as ISO 8601 UTC timestamps in the CSV output.

## Out of Scope

- Export to formats other than CSV (e.g., Excel .xlsx, JSON, PDF, XML).
- Scheduled, automated, or email-delivered exports.
- Export of items belonging to other users, including any admin-level cross-user export view.
- User-configurable column selection; the six columns defined in FR-07 are fixed for this feature.
- Import of CSV files back into the application.
- Pagination within a single export file or multi-part export downloads.
- Export of soft-deleted or archived items.
- Progress indicators for very large exports beyond the button disabled state described in NFR-03.
- Any changes to the existing Dashboard filter or search UI components beyond wiring the current filter state into the export request.

## Traceability

| AC-ID | FR-ID | Test Coverage |
|-------|-------|---------------|
| AC-01 | FR-01 | TBD (Stage 7) |
| AC-02 | FR-01 | TBD (Stage 7) |
| AC-03 | FR-02 | TBD (Stage 7) |
| AC-04 | FR-02 | TBD (Stage 7) |
| AC-05 | FR-03 | TBD (Stage 7) |
| AC-06 | FR-03 | TBD (Stage 7) |
| AC-07 | FR-04 | TBD (Stage 7) |
| AC-08 | FR-05 | TBD (Stage 7) |
| AC-09 | FR-05 | TBD (Stage 7) |
| AC-10 | FR-06 | TBD (Stage 7) |
| AC-11 | FR-07 | TBD (Stage 7) |
| AC-12 | FR-07 | TBD (Stage 7) |
| AC-13 | FR-08 | TBD (Stage 7) |
| AC-14 | FR-08 | TBD (Stage 7) |
| AC-15 | FR-09 | TBD (Stage 7) |
| AC-16 | FR-10 | TBD (Stage 7) |
| AC-17 | FR-11 | TBD (Stage 7) |
| AC-18 | FR-11 | TBD (Stage 7) |
| AC-19 | FR-12 | TBD (Stage 7) |
| AC-20 | FR-13 | TBD (Stage 7) |
