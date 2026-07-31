import { create } from 'zustand'

interface AuthState {
  token: string | null
  email: string | null
  setAuth: (token: string, email: string) => void
  logout: () => void
}

const TOKEN_KEY = 'capstone_token'
const EMAIL_KEY = 'capstone_email'

export const useAuthStore = create<AuthState>(() => ({
  token: localStorage.getItem(TOKEN_KEY),
  email: localStorage.getItem(EMAIL_KEY),

  setAuth: (token, email) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(EMAIL_KEY, email)
    useAuthStore.setState({ token, email })
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    useAuthStore.setState({ token: null, email: null })
  },
}))
