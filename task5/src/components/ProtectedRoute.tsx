import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export interface LocationState {
  from?: string
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const restoring = useAuthStore((s) => s.restoring)
  const location = useLocation()

  if (restoring) return <p>Проверка сессии…</p>

  if (!user) {
    const state: LocationState = { from: location.pathname }
    return <Navigate to="/login" replace state={state} />
  }
  return children
}
