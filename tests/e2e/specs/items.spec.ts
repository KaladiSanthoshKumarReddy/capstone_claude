import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

const USER = { email: 'items_test@capstone.dev', password: 'Test1234!' }

async function ensureUser(page: import('@playwright/test').Page) {
  await page.request.post('http://localhost:4000/api/auth/register', {
    data: { email: USER.email, password: USER.password },
  })
}

test.describe('Item Management', () => {
  test.beforeEach(async ({ page }) => {
    await ensureUser(page)
    const login = new LoginPage(page)
    await login.goto()
    await login.login(USER.email, USER.password)
    await page.waitForURL('**/dashboard')
  })

  test('should add a new item', async ({ page }) => {
    const titleInput = page.getByTestId('item-title-input')
    const addBtn     = page.getByTestId('add-item-button')
    const title = `My first test item ${Date.now()}`

    await titleInput.fill(title)
    await addBtn.click()

    await expect(titleInput).toHaveValue('')
    await expect(page.getByText(title)).toBeVisible()
  })

  test('should delete an item', async ({ page }) => {
    const titleInput = page.getByTestId('item-title-input')
    const addBtn     = page.getByTestId('add-item-button')

    await titleInput.fill('Item to delete')
    await addBtn.click()
    await page.waitForSelector('[data-testid^="item-card-"]')

    const deleteBtn = page.locator('[data-testid^="item-delete-"]').first()
    page.once('dialog', d => d.accept())
    await deleteBtn.click()

    await expect(page.getByText('Item to delete')).not.toBeVisible()
  })

  test('should toggle item status to completed', async ({ page }) => {
    const titleInput = page.getByTestId('item-title-input')
    const addBtn     = page.getByTestId('add-item-button')
    const title = `Toggle me ${Date.now()}`

    await titleInput.fill(title)
    await addBtn.click()
    await expect(page.getByText(title)).toBeVisible()

    const titleEl = page.locator('[data-testid^="item-title-"]').filter({ hasText: title }).first()
    const titleTestId = await titleEl.getAttribute('data-testid')
    const id = titleTestId?.replace('item-title-', '')
    expect(id).toBeTruthy()

    const toggle = page.locator(`[data-testid="item-toggle-${id}"]`)
    await toggle.click()

    await expect(page.locator(`[data-testid="item-status-${id}"]`)).toHaveText('completed')
  })

  test('should add an item with tags and render tag pills', async ({ page }) => {
    const titleInput = page.getByTestId('item-title-input')
    const tagsInput   = page.getByTestId('item-tags-input')
    const addBtn      = page.getByTestId('add-item-button')
    const title = `Tagged item ${Date.now()}`

    await titleInput.fill(title)
    await tagsInput.fill('work, urgent')
    await addBtn.click()

    await expect(page.getByText(title)).toBeVisible()

    const titleEl = page.locator('[data-testid^="item-title-"]').filter({ hasText: title }).first()
    const titleTestId = await titleEl.getAttribute('data-testid')
    const id = titleTestId?.replace('item-title-', '')
    expect(id).toBeTruthy()

    await expect(page.locator(`[data-testid="item-tag-${id}-work"]`)).toBeVisible()
    await expect(page.locator(`[data-testid="item-tag-${id}-urgent"]`)).toBeVisible()
  })
})

test.describe('Search and Filter', () => {
  test.beforeEach(async ({ page }) => {
    await ensureUser(page)
    const login = new LoginPage(page)
    await login.goto()
    await login.login(USER.email, USER.password)
    await page.waitForURL('**/dashboard')
  })

  test('should filter items by status', async ({ page }) => {
    const filter = page.getByTestId('status-filter')
    await filter.selectOption('completed')
    await expect(page).toHaveURL(/status=completed/)
  })

  test('should filter items by tag and clear the filter', async ({ page }) => {
    const titleInput = page.getByTestId('item-title-input')
    const tagsInput   = page.getByTestId('item-tags-input')
    const addBtn      = page.getByTestId('add-item-button')
    const title = `Tag filter item ${Date.now()}`

    await titleInput.fill(title)
    await tagsInput.fill('worktag')
    await addBtn.click()
    await expect(page.getByText(title)).toBeVisible()

    const tagFilter = page.getByTestId('tag-filter')
    await tagFilter.selectOption('worktag')
    await expect(page).toHaveURL(/tag=worktag/)
    await expect(page.getByText(title)).toBeVisible()

    await tagFilter.selectOption('')
    await expect(page).not.toHaveURL(/tag=worktag/)
  })
})
