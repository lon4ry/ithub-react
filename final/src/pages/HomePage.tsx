import { Link } from 'react-router-dom'
import styles from '../styles.module.css'

export function HomePage() {
  return (
    <>
      <h1 className={styles.pageTitle}>Задачник</h1>
      <p>
        Финальный проект курса: React + TypeScript + FastAPI. Задачи хранятся на сервере,
        доступ к ним защищён JWT-токеном, состояние запросов — loading / error / data.
      </p>
      <p className={styles.notice}>
        Демонстрационные данные: пользователь student / student123, три задачи в каталоге.
      </p>
      <p>
        <Link to="/tasks">Перейти к задачам</Link>
      </p>
    </>
  )
}
