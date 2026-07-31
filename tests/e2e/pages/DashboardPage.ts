import { Page, Locator } from '@playwright/test'

export class DashboardPage {
  readonly page:          Page
  readonly heading:       Locator
  readonly navBrand:      Locator
  readonly navEmail:      Locator
  readonly logoutButton:  Locator
  readonly itemTitleInput: Locator
  readonly itemDescInput:  Locator
  readonly itemTagsInput:  Locator
  readonly addItemButton:  Locator
  readonly searchInput:    Locator
  readonly statusFilter:   Locator
  readonly tagFilter:      Locator
  readonly emptyState:     Locator
  readonly itemList:       Locator
  readonly loadingState:   Locator

  constructor(page: Page) {
    this.page           = page
    this.heading        = page.getByTestId('dashboard-heading')
    this.navBrand       = page.getByText('Capstone App')
    this.navEmail       = page.getByTestId('nav-email')
    this.logoutButton   = page.getByTestId('logout-button')
    this.itemTitleInput = page.getByTestId('item-title-input')
    this.itemDescInput  = page.getByTestId('item-desc-input')
    this.itemTagsInput  = page.getByTestId('item-tags-input')
    this.addItemButton  = page.getByTestId('add-item-button')
    this.searchInput    = page.getByTestId('search-input')
    this.statusFilter   = page.getByTestId('status-filter')
    this.tagFilter      = page.getByTestId('tag-filter')
    this.emptyState     = page.getByTestId('empty-state')
    this.itemList       = page.getByTestId('item-list')
    this.loadingState   = page.getByTestId('items-loading')
  }

  async goto() {
    await this.page.goto('/dashboard')
  }

  async waitForLoad() {
    await this.heading.waitFor({ state: 'visible' })
    await this.loadingState.waitFor({ state: 'hidden', timeout: 8000 })
  }
}
