import { Page, Locator } from '@playwright/test'

export class LoginPage {
  readonly page:          Page
  readonly heading:       Locator
  readonly emailInput:    Locator
  readonly passwordInput: Locator
  readonly loginButton:   Locator
  readonly errorMessage:  Locator

  constructor(page: Page) {
    this.page          = page
    this.heading       = page.getByRole('heading', { name: 'Sign In' })
    this.emailInput    = page.getByTestId('email-input')
    this.passwordInput = page.getByTestId('password-input')
    this.loginButton   = page.getByTestId('login-button')
    this.errorMessage  = page.getByTestId('login-error')
  }

  async goto() {
    await this.page.goto('/login')
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.loginButton.click()
  }
}
