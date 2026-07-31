# Tests Instructions

These instructions apply to all work inside `tests/`. They are automatically loaded by Claude Code when working on test files.

## Stack

- E2E: Playwright (`@playwright/test`)
- Browser: Chromium only (desktop viewport)
- Base URL: `http://localhost:3000`
- API URL: `http://localhost:4000`

## File Layout

```
tests/
├── playwright.config.ts         ← Playwright config, webServer auto-start
└── e2e/
    ├── helpers/
    │   └── auth.ts              ← registerUser(), loginViaApi(), clearAuth()
    ├── pages/
    │   ├── LoginPage.ts         ← Page Object Model for /login
    │   ├── RegisterPage.ts      ← Page Object Model for /register
    │   └── DashboardPage.ts     ← Page Object Model for /dashboard
    └── specs/
        ├── login.spec.ts        ← Auth flow tests
        └── items.spec.ts        ← Item CRUD, tags, search, filter tests
```

## Conventions

### Selector priority
1. `page.getByTestId('data-testid-value')` ← **preferred**
2. `page.getByRole('button', { name: '...' })`
3. `page.getByLabel('...')`
4. **Never** use CSS selectors (`.className`, `#id`) or XPath

### Waiting strategy
- Use explicit state waits: `await expect(locator).toBeVisible()`
- Use `page.waitForURL('**/dashboard')` for navigations
- **Never** use `await page.waitForTimeout(N)` — flaky and fragile

### Test isolation
- Each test must create its own user via `ensureUser()` or `registerUser()`
- Use unique titles with `${Date.now()}` suffix to avoid cross-test pollution
- `test.beforeEach` handles login — don't duplicate login logic in individual tests

### AC traceability
- Stage 7 tests MUST label each test with its AC ID:
  ```typescript
  test('AC-01: User can add item with title', async ({ page }) => { ... })
  ```

### Page Objects
- Page objects live in `tests/e2e/pages/`
- Each POM exposes typed methods (`goto()`, `login()`, `fillTitle()`, etc.)
- Use `page.getByTestId()` inside POMs — not CSS selectors

### Auth helpers
Use helpers from `tests/e2e/helpers/auth.ts`:
```typescript
await registerUser(page, email, password)   // POST to API
await loginViaApi(page, email, password)    // API login + write localStorage
await clearAuth(page)                       // clear localStorage
```

## What NOT to change

- `playwright.config.ts` webServer setup (auto-starts backend and frontend)
- The `baseURL: 'http://localhost:3000'` config
- Page Object Model files — extend them rather than replacing them
- The `tests/e2e/helpers/auth.ts` helper signatures
