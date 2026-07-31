# Frontend Instructions

These instructions apply to all work inside `frontend/`. They are automatically loaded by Claude Code when working on frontend files.

## Stack

- Framework: React 18 + TypeScript (strict mode)
- Build tool: Vite 5
- Styling: Tailwind CSS v3 — utility classes only, no inline styles
- State: Zustand (`zustand`) — auth store only
- HTTP: Axios via `src/api/client.ts` — never call `fetch()` directly
- Routing: React Router v6 — `<BrowserRouter>` in `main.tsx`

## File Layout

```
frontend/src/
├── api/
│   ├── client.ts       ← Axios instance, JWT interceptor, 401 auto-redirect
│   └── items.ts        ← getItems(), createItem(), updateItem(), deleteItem()
├── components/         ← Reusable UI components (ItemCard, TagPill, etc.)
├── pages/
│   ├── Dashboard.tsx   ← Main app page — URL params for search/status/tag/page
│   ├── Login.tsx       ← Login form
│   └── Register.tsx    ← Registration form
├── store/
│   └── authStore.ts    ← Zustand store: { token, userEmail, setAuth, logout }
├── types/
│   └── index.ts        ← Item, User, ApiResponse interfaces
└── main.tsx            ← React root, BrowserRouter, routes
```

## Conventions

### HTTP calls
- ALL API calls go through `src/api/client.ts` — the Axios instance handles JWT headers automatically
- Never use `fetch()` or create a second Axios instance
- API functions live in `src/api/items.ts` — import from there in components

### Styling
- Tailwind CSS utility classes only — no CSS modules, no styled-components, no inline `style={}`
- Use Tailwind's `cn()` or `clsx()` for conditional classes
- Color palette: `blue-600` (primary), `red-600` (destructive), `gray-*` (neutral)

### Testing selectors — REQUIRED
Every interactive element MUST have a `data-testid` attribute:
```tsx
// Inputs
<input data-testid="item-title-input" ... />
<input data-testid="item-tags-input" ... />
<select data-testid="status-filter" ... />
<select data-testid="tag-filter" ... />

// Buttons
<button data-testid="add-item-button" ... />
<button data-testid={`item-delete-${item.id}`} ... />
<button data-testid={`item-toggle-${item.id}`} ... />

// Display elements
<div data-testid={`item-card-${item.id}`} ... />
<span data-testid={`item-status-${item.id}`} ... />
<span data-testid={`item-title-${item.id}`} ... />
<span data-testid={`item-tag-${item.id}-${tag}`} ... />
```

### State management
- Zustand `authStore` for auth state only — `token`, `userEmail`, `setAuth()`, `logout()`
- Component-local state (`useState`) for UI state (form inputs, loading, error)
- URL search params (`useSearchParams`) for filter/pagination state in Dashboard

### URL params in Dashboard
Dashboard uses URL params for shareable state:
- `?search=` — text search
- `?status=` — active | completed | archived
- `?tag=` — tag filter
- `?page=` — page number

Always read from `useSearchParams()`, not local state.

## What NOT to change

- The Axios instance in `src/api/client.ts` and its JWT interceptor
- The Zustand auth store shape (`token`, `userEmail`, `setAuth`, `logout`)
- The `localStorage` key `capstone_token`
- The React Router setup in `main.tsx`
