import { create } from 'zustand'
import { loginRequest, meRequest } from '../api/auth'
import { clearTokens, getAccessToken, saveTokens } from '../api/client'
import type { UserInfo } from '../types'

const USER_KEY = 'auth_user'

function readCachedUser(): UserInfo | null {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
    if (raw && typeof raw === 'object' && typeof (raw as UserInfo).username === 'string') {
      return raw as UserInfo
    }
  } catch {
    localStorage.removeItem(USER_KEY)
  }
  return null
}

interface AuthState {
  user: UserInfo | null
  restoring: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  restoring: true,

  login: async (username, password) => {
    const data = await loginRequest(username, password)
    saveTokens(data)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    set({ user: data.user, restoring: false })
  },

  logout: () => {
    clearTokens()
    localStorage.removeItem(USER_KEY)
    set({ user: null, restoring: false })
  },

  restoreSession: async () => {
    if (!getAccessToken()) {
      set({ user: null, restoring: false })
      return
    }
    // Сразу показываем пользователя из localStorage, затем проверяем токен на сервере
    set({ user: readCachedUser(), restoring: false })
    try {
      const user = await meRequest()
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ user })
    } catch {
      // 401 без возможности refresh: interceptor уже очистил токены
    }
  },
}))

// Refresh не удался — сессия потеряна; ProtectedRoute уведёт на /login
window.addEventListener('auth:session-expired', () => {
  localStorage.removeItem(USER_KEY)
  useAuthStore.setState({ user: null, restoring: false })
})
