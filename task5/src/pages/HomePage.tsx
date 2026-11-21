import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <>
      <h1>Управление сессией пользователя</h1>
      <p>
        Учебный проект КТ 5: вход по логину и паролю, JWT access- и refresh-токены,
        автоматическое обновление токена при ответе 401 и восстановление сессии после перезагрузки.
      </p>
      <p>
        Тестовый пользователь: <code>student</code> / <code>student123</code>.
      </p>
      <p>
        <Link to="/cabinet">Открыть защищённый раздел</Link>
      </p>
    </>
  )
}
