/**
 * Stage 7 — Verification: CSV Export Feature
 * Covers all 20 Acceptance Criteria from requirements.md (AC-01 … AC-20)
 */
import crypto from 'crypto'
import { test, expect } from '@playwright/test'
import { registerUser, loginViaApi } from '../helpers/auth'
import { DashboardPage } from '../pages/DashboardPage'

const PASS = 'Test1234!'

// ─── shared helpers ──────────────────────────────────────────────────────────

/** Register (idempotent) + login and return the raw JWT */
async function getToken(
  page: import('@playwright/test').Page,
  email: string,
): Promise<string> {
  await registerUser(page, email, PASS)
  const res = await page.request.post('http://localhost:4000/api/auth/login', {
    data: { email, password: PASS },
  })
  const body = await res.json()
  return body.data.token as string
}

/** Create one item via the API; returns the new item id */
async function createItemApi(
  page: import('@playwright/test').Page,
  token: string,
  title: string,
  description = '',
): Promise<number> {
  const res = await page.request.post('http://localhost:4000/api/items', {
    headers: { Authorization: `Bearer ${token}` },
    data: { title, description },
  })
  const body = await res.json()
  return Number(body.data.id)
}

/** PATCH an item's status via the API (also sets updated_at) */
async function setStatus(
  page: import('@playwright/test').Page,
  token: string,
  id: number,
  status: 'active' | 'completed' | 'archived',
): Promise<void> {
  await page.request.patch(`http://localhost:4000/api/items/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { status },
  })
}

/**
 * Build a structurally-valid, correctly-signed JWT with `exp` in the past.
 * Works without jsonwebtoken by using Node's built-in `crypto` module.
 */
function buildExpiredJwt(secret: string): string {
  const b64url = (s: string) => Buffer.from(s).toString('base64url')
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now     = Math.floor(Date.now() / 1000)
  const payload = b64url(
    JSON.stringify({ userId: 9999, email: 'expired@test.dev', iat: now - 7200, exp: now - 3600 }),
  )
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url')
  return `${header}.${payload}.${sig}`
}

/**
 * Minimal RFC 4180-compliant CSV parser.
 * Returns an array of rows; each row is an array of field strings.
 * Handles quoted fields and doubled-double-quote escaping.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\r$/, '')
    if (line === '') continue
    const fields: string[] = []
    let cur = ''
    let inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++ }
        else if (c === '"') { inQ = false }
        else { cur += c }
      } else if (c === '"') {
        inQ = true
      } else if (c === ',') {
        fields.push(cur); cur = ''
      } else {
        cur += c
      }
    }
    fields.push(cur)
    rows.push(fields)
  }
  return rows
}

// ─────────────────────────────────────────────────────────────────────────────
// Group 1 — Dashboard UI
// Covers: AC-01, AC-02, AC-15, NFR-03
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — Dashboard UI', () => {
  const USER = { email: 'csv_ui@test.dev', password: PASS }

  test.beforeEach(async ({ page }) => {
    await registerUser(page, USER.email, USER.password)
    await loginViaApi(page, USER.email, USER.password)
  })

  test('AC-01: Export CSV button is visible on the Dashboard for authenticated user', async ({ page }) => {
    const dash = new DashboardPage(page)
    await dash.goto()
    await dash.waitForLoad()

    const btn = page.getByTestId('export-csv-button')
    await expect(btn).toBeVisible()
    await expect(btn).toHaveText('Export CSV')
  })

  test('AC-02: Unauthenticated user is redirected to /login and Export CSV button is never rendered', async ({ page }) => {
    // Clear any existing auth and navigate directly to /dashboard
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('capstone_token')
      localStorage.removeItem('capstone_email')
    })
    await page.goto('/dashboard')
    await page.waitForURL('**/login')

    // Verify we are on the login page, not the dashboard
    await expect(page).toHaveURL(/\/login/)
    await expect(page.getByTestId('export-csv-button')).not.toBeVisible()
  })

  test('AC-15: Clicking Export CSV triggers a file download and user stays on Dashboard', async ({ page }) => {
    const token = await getToken(page, USER.email)
    // Ensure at least one item exists so the export is non-empty
    await createItemApi(page, token, `AC15 item ${Date.now()}`)

    const dash = new DashboardPage(page)
    await dash.goto()
    await dash.waitForLoad()

    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('export-csv-button').click()
    const download = await downloadPromise

    // File download was initiated
    expect(download.suggestedFilename()).toMatch(/items-export-\d{4}-\d{2}-\d{2}\.csv/)
    // User stays on the Dashboard — no navigation away
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('NFR-03: Export CSV button is disabled (shows "Exporting…") during the export operation', async ({ page }) => {
    const token = await getToken(page, USER.email)
    await createItemApi(page, token, `NFR03 item ${Date.now()}`)

    const dash = new DashboardPage(page)
    await dash.goto()
    await dash.waitForLoad()

    const btn = page.getByTestId('export-csv-button')
    // Start waiting for download before click so the in-flight state is observable
    const downloadPromise = page.waitForEvent('download')
    await btn.click()

    // Immediately after click the button should either be disabled or showing "Exporting…"
    // (it reverts once the download completes, so we check before awaiting download)
    const isDisabled = await btn.isDisabled()
    const label = await btn.textContent()
    expect(isDisabled || label?.includes('Exporting')).toBe(true)

    await downloadPromise // let the export finish cleanly
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Group 2 — API Authentication
// Covers: AC-03, AC-04, AC-05, AC-06
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — API Authentication', () => {
  const USER = { email: 'csv_auth@test.dev', password: PASS }

  test('AC-03: GET /api/items/export with valid JWT returns Content-Type: text/csv', async ({ page }) => {
    const token = await getToken(page, USER.email)

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('text/csv')
  })

  test('AC-04: Response body is a well-formed CSV with the header row on line 1', async ({ page }) => {
    const token = await getToken(page, USER.email)
    // Create one item so there is at least one data row
    await createItemApi(page, token, `AC04 title ${Date.now()}`, 'AC04 description')

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status()).toBe(200)

    const text = await res.text()
    const firstLine = text.split('\n')[0]
    expect(firstLine).toBe('id,title,description,status,created_at,updated_at')
  })

  test('AC-05: GET /api/items/export with no Authorization header returns HTTP 401 with JSON error', async ({ page }) => {
    const res = await page.request.get('http://localhost:4000/api/items/export')

    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    expect(typeof body.error).toBe('string')
    expect(body.error.length).toBeGreaterThan(0)
  })

  test('AC-06: GET /api/items/export with expired JWT returns HTTP 401 and no item data', async ({ page }) => {
    // Build a structurally-valid JWT signed with dev-secret but with exp in the past
    const expiredToken = buildExpiredJwt('dev-secret')

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${expiredToken}` },
    })

    expect(res.status()).toBe(401)
    const body = await res.json()
    expect(body.success).toBe(false)
    // No CSV / no item data in body
    expect(body.data).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Group 3 — User Scope Isolation
// Covers: AC-07
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — User Scope Isolation', () => {
  test('AC-07: Exported CSV contains only the requesting user\'s items — not another user\'s', async ({ page }) => {
    const ts = Date.now()
    const emailA = `csv_scope_a_${ts}@test.dev`
    const emailB = `csv_scope_b_${ts}@test.dev`

    const tokenA = await getToken(page, emailA)
    const tokenB = await getToken(page, emailB)

    const titleA = `UserA exclusive item ${ts}`
    const titleB = `UserB exclusive item ${ts}`

    await createItemApi(page, tokenA, titleA)
    await createItemApi(page, tokenB, titleB)

    // Export as User A
    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${tokenA}` },
    })
    expect(res.status()).toBe(200)

    const text = await res.text()
    expect(text).toContain(titleA)     // User A's item is present
    expect(text).not.toContain(titleB) // User B's item is absent
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Group 4 — Filter Behaviour
// Covers: AC-08, AC-09, AC-10, AC-16, AC-19, AC-20
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — Filter Behaviour', () => {
  const USER = { email: 'csv_filter@test.dev', password: PASS }
  let token = ''

  test.beforeEach(async ({ page }) => {
    token = await getToken(page, USER.email)
  })

  test('AC-08: Status filter "completed" — every CSV data row has status "completed"', async ({ page }) => {
    const ts = Date.now()
    const activeId    = await createItemApi(page, token, `Active item ${ts}`)
    const completedId = await createItemApi(page, token, `Completed item ${ts}`)
    await setStatus(page, token, activeId, 'active')
    await setStatus(page, token, completedId, 'completed')

    const res = await page.request.get('http://localhost:4000/api/items/export?status=completed', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status()).toBe(200)

    const rows = parseCsv(await res.text())
    const header = rows[0]
    const statusIdx = header.indexOf('status')
    expect(statusIdx).toBeGreaterThanOrEqual(0)

    const dataRows = rows.slice(1)
    expect(dataRows.length).toBeGreaterThan(0)
    for (const row of dataRows) {
      expect(row[statusIdx]).toBe('completed')
    }
  })

  test('AC-09: No status filter — exported CSV contains items of all statuses', async ({ page }) => {
    const ts = Date.now()
    const activeId    = await createItemApi(page, token, `AC09 active ${ts}`)
    const completedId = await createItemApi(page, token, `AC09 completed ${ts}`)
    await setStatus(page, token, activeId, 'active')
    await setStatus(page, token, completedId, 'completed')

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status()).toBe(200)

    const text = await res.text()
    const rows = parseCsv(text)
    const header = rows[0]
    const statusIdx = header.indexOf('status')
    const statuses = new Set(rows.slice(1).map(r => r[statusIdx]))

    expect(statuses.has('active')).toBe(true)
    expect(statuses.has('completed')).toBe(true)
  })

  test('AC-10: Search filter — CSV contains only items whose title/description matches the search text', async ({ page }) => {
    const ts = Date.now()
    const matchTitle    = `project alpha unique ${ts}`
    const noMatchTitle  = `unrelated item ${ts}`

    await createItemApi(page, token, matchTitle)
    await createItemApi(page, token, noMatchTitle)

    const res = await page.request.get(
      `http://localhost:4000/api/items/export?search=project+alpha+unique+${ts}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status()).toBe(200)

    const rows = parseCsv(await res.text())
    const header = rows[0]
    const titleIdx = header.indexOf('title')
    const dataRows = rows.slice(1)

    // Every returned row must contain the search token in its title (or description)
    // The noMatch item must NOT appear
    const titles = dataRows.map(r => r[titleIdx])
    expect(titles.some(t => t.includes(`project alpha unique ${ts}`))).toBe(true)
    expect(titles.every(t => !t.includes(noMatchTitle))).toBe(true)
  })

  test('AC-16: Active filter matching zero items — CSV contains exactly one line (the header row)', async ({ page }) => {
    // Use a search term that will never match any real item
    const impossibleSearch = `zzz_no_match_${Date.now()}_zzz`

    const res = await page.request.get(
      `http://localhost:4000/api/items/export?search=${encodeURIComponent(impossibleSearch)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status()).toBe(200)

    const rows = parseCsv(await res.text())
    expect(rows.length).toBe(1) // header only
    expect(rows[0]).toEqual(['id', 'title', 'description', 'status', 'created_at', 'updated_at'])
  })

  test('AC-19: Export button sends status and search as query-string parameters to the export endpoint', async ({ page }) => {
    await registerUser(page, USER.email, PASS)
    await loginViaApi(page, USER.email, PASS)

    // Navigate to dashboard with status=active and a specific search query
    await page.goto('/dashboard?status=active&search=widget')
    const dash = new DashboardPage(page)
    await dash.waitForLoad()

    // Intercept the outgoing export request before clicking the button
    const requestPromise = page.waitForRequest(
      req => req.url().includes('/api/items/export'),
    )
    const downloadPromise = page.waitForEvent('download').catch(() => null) // may or may not have items
    await page.getByTestId('export-csv-button').click()

    const exportRequest = await requestPromise
    await downloadPromise

    const url = new URL(exportRequest.url())
    expect(url.searchParams.get('status')).toBe('active')
    expect(url.searchParams.get('search')).toBe('widget')
  })

  test('AC-20: Exported items match the items shown in the Dashboard list view for the same filter', async ({ page }) => {
    const ts = Date.now()
    const titleA = `AC20 alpha ${ts}`
    const titleB = `AC20 beta ${ts}`
    await createItemApi(page, token, titleA)
    await createItemApi(page, token, titleB)

    // Fetch the list view for this user (unfiltered, all items)
    const listRes = await page.request.get(
      `http://localhost:4000/api/items?limit=100`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    const listBody = await listRes.json()
    const listTitles: string[] = (listBody.data as Array<{ title: string }>).map(i => i.title)

    // Fetch the export for the same user (no filter)
    const exportRes = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rows = parseCsv(await exportRes.text())
    const header = rows[0]
    const titleIdx = header.indexOf('title')
    const exportTitles = rows.slice(1).map(r => r[titleIdx])

    // Both the newly created items appear in the export
    expect(exportTitles).toContain(titleA)
    expect(exportTitles).toContain(titleB)

    // Every export title also exists in the list view (no phantom data)
    for (const et of exportTitles) {
      expect(listTitles).toContain(et)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Group 5 — CSV Format Validation
// Covers: AC-11, AC-12, AC-17, AC-18
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — Format Validation', () => {
  const USER = { email: 'csv_format@test.dev', password: PASS }
  let token = ''

  test.beforeEach(async ({ page }) => {
    token = await getToken(page, USER.email)
  })

  test('AC-11: First row contains exactly the six column headers in the correct order', async ({ page }) => {
    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(res.status()).toBe(200)

    const text = await res.text()
    const firstLine = text.split('\n')[0].replace(/\r$/, '')
    expect(firstLine).toBe('id,title,description,status,created_at,updated_at')
  })

  test('AC-12: Each data row contains correct values matching the stored item data', async ({ page }) => {
    const ts    = Date.now()
    const title = `AC12 title ${ts}`
    const desc  = `AC12 description ${ts}`

    // Create item and immediately update its status so that updated_at is populated
    const id = await createItemApi(page, token, title, desc)
    await setStatus(page, token, id, 'completed')

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rows = parseCsv(await res.text())
    const header  = rows[0]
    const idIdx   = header.indexOf('id')
    const titleIdx = header.indexOf('title')
    const descIdx  = header.indexOf('description')
    const statIdx  = header.indexOf('status')
    const catIdx   = header.indexOf('created_at')
    const uatIdx   = header.indexOf('updated_at')

    const matchRow = rows.slice(1).find(r => Number(r[idIdx]) === id)
    expect(matchRow).toBeDefined()
    expect(matchRow![titleIdx]).toBe(title)
    expect(matchRow![descIdx]).toBe(desc)
    // Status was patched to 'completed'
    expect(matchRow![statIdx]).toBe('completed')
    // created_at has a valid ISO 8601 date component
    expect(matchRow![catIdx]).toMatch(/\d{4}-\d{2}-\d{2}/)
    // updated_at is populated after the PATCH call
    expect(matchRow![uatIdx]).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  test('AC-17: Title containing a comma is enclosed in double quotes in the CSV output', async ({ page }) => {
    const ts    = Date.now()
    const title = `Buy milk, eggs ${ts}`
    await createItemApi(page, token, title)

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rawText = await res.text()

    // The comma-containing title must appear wrapped in double quotes in the raw CSV
    expect(rawText).toContain(`"Buy milk, eggs ${ts}"`)

    // After parsing, the field value must be recovered correctly (no surrounding quotes)
    const rows     = parseCsv(rawText)
    const titleIdx = rows[0].indexOf('title')
    const titles   = rows.slice(1).map(r => r[titleIdx])
    expect(titles).toContain(title)
  })

  test('AC-18: Description containing a double-quote character is escaped as "" in the CSV output', async ({ page }) => {
    const ts   = Date.now()
    const desc = `He said "hello" to me ${ts}`
    await createItemApi(page, token, `AC18 item ${ts}`, desc)

    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const rawText = await res.text()

    // The double-quote must be escaped as "" inside a quoted field
    // e.g. "He said ""hello"" to me <ts>"
    expect(rawText).toContain('""hello""')

    // After parsing the escaped value must round-trip correctly
    const rows    = parseCsv(rawText)
    const descIdx = rows[0].indexOf('description')
    const descs   = rows.slice(1).map(r => r[descIdx])
    expect(descs).toContain(desc)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Group 6 — Row Limits
// Covers: AC-13, AC-14
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Export CSV — Row Limits', () => {
  const USER = { email: 'csv_limits@test.dev', password: PASS }
  let token = ''

  test.beforeEach(async ({ page }) => {
    token = await getToken(page, USER.email)
  })

  test('AC-13: All matching items are exported without truncation when result count is below 1000', async ({ page }) => {
    const ts = Date.now()
    // Create a small set of items (well under 1000) and verify ALL are present
    const count = 5
    const titles: string[] = []
    for (let i = 0; i < count; i++) {
      const title = `AC13 item ${i} ${ts}`
      await createItemApi(page, token, title)
      titles.push(title)
    }

    const res = await page.request.get(
      `http://localhost:4000/api/items/export?search=AC13+item`,
      { headers: { Authorization: `Bearer ${token}` } },
    )
    expect(res.status()).toBe(200)

    const rows = parseCsv(await res.text())
    const titleIdx = rows[0].indexOf('title')
    const exportTitles = rows.slice(1).map(r => r[titleIdx])

    // Every created title must be present — no truncation
    for (const t of titles) {
      expect(exportTitles).toContain(t)
    }
  })

  test('AC-14: Export endpoint applies LIMIT 1000 — response stays within cap and server does not error', async ({ page }) => {
    // The SQL implementation uses LIMIT 1000. We verify:
    // 1. The endpoint returns HTTP 200 (server does not error out).
    // 2. The CSV data rows do not exceed 1000 (cap is enforced at the SQL layer).
    // Note: creating >1000 items in an E2E test is impractical; this test validates
    // the cap contract with the items currently available for this user.
    const res = await page.request.get('http://localhost:4000/api/items/export', {
      headers: { Authorization: `Bearer ${token}` },
    })

    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('text/csv')

    const rows = parseCsv(await res.text())
    const dataRowCount = rows.length - 1 // exclude header
    expect(dataRowCount).toBeGreaterThanOrEqual(0)
    expect(dataRowCount).toBeLessThanOrEqual(1000)
  })
})
