import { Link } from 'react-router-dom'
import styles from '../styles.module.css'

export function NotFoundPage() {
  return (
    <>
      <h1 className={styles.pageTitle}>404 — страница не найдена</h1>
      <Link to="/">На главную</Link>
    </>
  )
}
