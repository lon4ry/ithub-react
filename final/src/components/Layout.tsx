import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import styles from '../styles.module.css'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink

export function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className={styles.shell}>
      <nav className={styles.nav}>
        <NavLink to="/" end className={styles.brand}>
          Задачник
        </NavLink>
        <NavLink to="/tasks" className={navLinkClass}>
          Задачи
        </NavLink>
        <NavLink to="/profile" className={navLinkClass}>
          Профиль
        </NavLink>
        <span className={styles.spacer} />
        {user ? (
          <>
            <span className={styles.userName}>{user.name}</span>
            <button className={styles.btn} onClick={handleLogout}>
              Выйти
            </button>
          </>
        ) : (
          <NavLink to="/login" className={navLinkClass}>
            Войти
          </NavLink>
        )}
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
