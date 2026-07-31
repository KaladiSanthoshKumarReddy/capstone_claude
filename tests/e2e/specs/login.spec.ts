import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { registerUser } from '../helpers/auth'

const USER = { email: 'login_e2e@capstone.dev', password: 'Test1234!' }

test.describe('Login Page — UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders Sign In heading', async ({ page }) => {
    const lp = new LoginPage(page)
    await expect(lp.heading).toBeVisible()
  })

  test('shows email input, password input, and login button', async ({ page }) => {
    const lp = new LoginPage(page)
    await expect(lp.emailInput).toBeVisible()
    await expect(lp.passwordInput).toBeVisible()
    await expect(lp.loginButton).toBeVisible()
  })

  test('email input has type=email', async ({ page }) => {
    await expect(page.getByTestId('email-input')).toHaveAttribute('type', 'email')
  })

  test('password input has type=password', async ({ page }) => {
    await expect(page.getByTestId('password-input')).toHaveAttribute('type', 'password')
  })

  test('login button label is "Login" initially', async ({ page }) => {
    await expect(page.getByTestId('login-button')).toHaveText('Login')
  })
})

test.describe('Login — Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await registerUser(page, USER.email, USER.password)
  })

  test('shows "Invalid credentials" for wrong password', async ({ page }) => {
    const lp = new LoginPage(page)
    await lp.goto()
    await lp.login(USER.email, 'WrongPassword!')
    await expect(lp.errorMessage).toBeVisible()
    await expect(lp.errorMessage).toHaveText('Invalid credentials')
  })

  test('redirects to /dashboard on valid credentials', async ({ page }) => {
    const lp = new LoginPage(page)
    await lp.goto()
    await lp.login(USER.email, USER.password)
    await expect(page).toHaveURL('/dashboard')
  })

  test('stores token in localStorage after login', async ({ page }) => {
    const lp = new LoginPage(page)
    await lp.goto()
    await lp.login(USER.email, USER.password)
    await page.waitForURL('/dashboard')
    const token = await page.evaluate(() => localStorage.getItem('capstone_token'))
    expect(token).toBeTruthy()
  })
})

test.describe('Login — Route Guards', () => {
  test('visiting /dashboard without token redirects to /login', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('404 route shows NotFound page', async ({ page }) => {
    await page.goto('/this-does-not-exist')
    await expect(page.getByText('404')).toBeVisible()
  })
})
