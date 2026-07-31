import { Page, Locator } from '@playwright/test'

export class RegisterPage {
  readonly page:           Page
  readonly heading:        Locator
  readonly emailInput:     Locator
  readonly passwordInput:  Locator
  readonly registerButton: Locator
  readonly errorMessage:   Locator

  constructor(page: Page) {
    this.page           = page
    this.heading        = page.getByRole('heading', { name: 'Create Account' })
    this.emailInput     = page.getByTestId('register-email-input')
    this.passwordInput  = page.getByTestId('register-password-input')
    this.registerButton = page.getByTestId('register-button')
    this.errorMessage   = page.getByTestId('register-error')
  }

  async goto() {
    await this.page.goto('/register')
  }

  async register(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.registerButton.click()
  }
}
