import { useNavigate } from 'react-router-dom'
import { getAccessToken } from '../api/client'
import { useAuthStore } from '../store/authStore'
import styles from '../styles.module.css'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Профиль</h1>
      <div className={styles.notice}>
        <p>Имя: {user?.name}</p>
        <p>Логин: {user?.username}</p>
        <p>Access-токен в localStorage: {getAccessToken() ? 'есть' : 'нет'}</p>
      </div>
      <p className={styles.muted}>
        Выход удаляет access- и refresh-токены и сбрасывает состояние авторизации в Zustand.
      </p>
      <button className={`${styles.btn} ${styles.btnDanger}`} onClick={handleLogout}>
        Выйти из аккаунта
      </button>
    </>
  )
}
