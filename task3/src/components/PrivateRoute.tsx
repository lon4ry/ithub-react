import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export interface LocationState {
  from?: { pathname: string }
}

export function PrivateRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    const state: LocationState = { from: { pathname: location.pathname } }
    return <Navigate to="/login" replace state={state} />
  }
  return children
}
