import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function Layout() {
  const { user, logout } = useAuth()
  return (
    <>
      <nav className="nav">
        <NavLink to="/" end>Главная</NavLink>
        <NavLink to="/products">Товары</NavLink>
        <NavLink to="/profile">Профиль</NavLink>
        <span className="spacer" />
        {user ? (
          <>
            <span>{user}</span>
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <NavLink to="/login">Войти</NavLink>
        )}
      </nav>
      <main className="main">
        <Outlet />
      </main>
    </>
  )
}
