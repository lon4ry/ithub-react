import { useState, type SyntheticEvent } from 'react'
import { errorMessage } from '../api/client'
import { useAuthStore } from '../store/authStore'
import styles from '../styles.module.css'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useAuthStore((s) => s.login)
  const [username, setUsername] = useState('student')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (username.trim().length < 3) {
      setError('Логин должен содержать минимум 3 символа')
      return
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }
    setPending(true)
    setError('')
    try {
      await login(username.trim(), password)
      onSuccess()
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setPending(false)
    }
  }

  return (
    <form className={styles.taskForm} onSubmit={(e) => void handleSubmit(e)} noValidate>
      <label className={styles.field}>
        Логин
        <input
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </label>
      <label className={styles.field}>
        Пароль
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </label>
      {error && <p className={styles.errorText}>{error}</p>}
      <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit" disabled={pending}>
        {pending ? 'Вход…' : 'Войти'}
      </button>
      <p className={styles.muted}>Тестовый пользователь: student / student123</p>
    </form>
  )
}
