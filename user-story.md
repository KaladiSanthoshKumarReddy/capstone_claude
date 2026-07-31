# User Story — EPMCDMETST-55846

## Summary
[Enhancement] Export items list to CSV

## Story
As a task-management app user,
I want to export my filtered items list to a CSV file,
So that I can share it or analyze it outside the application.

## Acceptance Criteria (from Jira)
1. Dashboard provides an "Export CSV" action that exports only the currently filtered/search results (respecting status and search query).
2. The CSV file includes headers and the following columns at minimum: id, title, description, status, created_at, updated_at.
3. Export works for up to 1000 items and uses the authenticated user scope (no cross-user data leakage).

## Technical Notes
- **Frontend:** Add an Export CSV button on Dashboard; call export endpoint and trigger browser download.
- **Backend:** Add `GET /api/items/export` endpoint that returns `text/csv`; reuse existing filtering logic; enforce `authMiddleware`.
- **Tests:** Playwright E2E verifies export button triggers download and file contains expected headers/rows; Vitest unit test for CSV serialization.

## Links
- Jira: https://jiraeu.epam.com/browse/EPMCDMETST-55846
- Reporter: Santhoshkumarreddy Kaladi
- Priority: Low
- Status: Open
