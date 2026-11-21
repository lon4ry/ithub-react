import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { TokenPair } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const getAccessToken = () => localStorage.getItem('access_token')
export const getRefreshToken = () => localStorage.getItem('refresh_token')

export function saveTokens(pair: TokenPair): void {
  localStorage.setItem('access_token', pair.access_token)
  localStorage.setItem('refresh_token', pair.refresh_token)
}

export function clearTokens(): void {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// publicApi — без interceptor-ов: логин и refresh не должны рекурсивно обновлять токен
export const publicApi = axios.create({ baseURL: BASE_URL, timeout: 5000 })
export const api = axios.create({ baseURL: BASE_URL, timeout: 5000 })

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let refreshing: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    try {
      const { data } = await publicApi.post<TokenPair>('/auth/refresh', { refresh_token: refreshToken })
      saveTokens(data)
      return data.access_token
    } catch {
      // refresh недействителен — сессия потеряна
    }
  }
  clearTokens()
  window.dispatchEvent(new Event('auth:session-expired'))
  return null
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined
    if (error.response?.status !== 401 || !config || config._retried) {
      return Promise.reject(error)
    }
    config._retried = true
    refreshing ??= refreshAccessToken().finally(() => {
      refreshing = null
    })
    const token = await refreshing
    if (!token) return Promise.reject(error)
    config.headers.Authorization = `Bearer ${token}`
    return api(config)
  },
)

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError<{ detail?: string }>(err)) {
    if (err.response) return `${err.response.status}: ${err.response.data?.detail ?? err.message}`
    return `Сервер недоступен (${err.message})`
  }
  return String(err)
}
