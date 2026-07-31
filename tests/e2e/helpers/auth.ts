import type { Page } from '@playwright/test'

const TOKEN_KEY = 'capstone_token'
const EMAIL_KEY = 'capstone_email'

export async function registerUser(page: Page, email: string, password: string) {
  await page.request.post('http://localhost:4000/api/auth/register', {
    data: { email, password },
  })
  // 201 on first call, 409 (already exists) on subsequent — both are fine
}

export async function loginViaApi(page: Page, email: string, password: string) {
  const res  = await page.request.post('http://localhost:4000/api/auth/login', {
    data: { email, password },
  })
  const body = await res.json()
  await page.goto('/login')
  await page.evaluate(
    ({ token, em, tokenKey, emailKey }) => {
      localStorage.setItem(tokenKey, token)
      localStorage.setItem(emailKey, em)
    },
    { token: body.data.token, em: body.data.email, tokenKey: TOKEN_KEY, emailKey: EMAIL_KEY },
  )
}

export async function clearAuth(page: Page) {
  await page.evaluate(
    ({ tokenKey, emailKey }) => {
      localStorage.removeItem(tokenKey)
      localStorage.removeItem(emailKey)
    },
    { tokenKey: TOKEN_KEY, emailKey: EMAIL_KEY },
  )
}
