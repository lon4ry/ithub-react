import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { TokenPair } from '../types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY)

export function saveTokens(pair: TokenPair): void {
  localStorage.setItem(ACCESS_KEY, pair.access_token)
  localStorage.setItem(REFRESH_KEY, pair.refresh_token)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
}

// publicApi — без interceptor-ов: для логина и refresh, чтобы не зациклиться на 401
export const publicApi = axios.create({ baseURL: BASE_URL, timeout: 5000 })

export const api = axios.create({ baseURL: BASE_URL, timeout: 5000 })

// Request interceptor: access-токен автоматически уходит в Authorization
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

// Response interceptor: 401 → один refresh → повтор исходного запроса
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
