import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import type { LocationState } from '../components/ProtectedRoute'
import { useAuthStore } from '../store/authStore'
import styles from '../styles.module.css'

export function LoginPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? '/tasks'

  if (user) return <Navigate to={from} replace />

  return (
    <>
      <h1 className={styles.pageTitle}>Вход</h1>
      <p className={styles.notice}>После входа откроется страница {from}.</p>
      <LoginForm onSuccess={() => navigate(from, { replace: true })} />
    </>
  )
}
