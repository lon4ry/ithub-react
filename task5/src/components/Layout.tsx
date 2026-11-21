import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function Layout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/cabinet">Кабинет</NavLink>
        <span className="spacer" />
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <NavLink to="/login">Войти</NavLink>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}
