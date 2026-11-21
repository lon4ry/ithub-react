import { useAuth } from '../auth/AuthContext'

export function ProfilePage() {
  const { user } = useAuth()
  return (
    <>
      <h1>Профиль</h1>
      <p>Защищённая страница. Пользователь: <b>{user}</b></p>
    </>
  )
}
