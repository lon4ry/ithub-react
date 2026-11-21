import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  timeout: 5000,
})

export function errorMessage(err: unknown): string {
  if (axios.isAxiosError<{ detail?: string }>(err)) {
    if (err.response) return `${err.response.status}: ${err.response.data?.detail ?? err.message}`
    return `Сервер недоступен (${err.message})`
  }
  return String(err)
}
