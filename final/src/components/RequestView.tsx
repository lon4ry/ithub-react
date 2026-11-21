import type { ReactNode } from 'react'
import type { RequestState } from '../types'
import styles from '../styles.module.css'

interface RequestViewProps<T> {
  state: RequestState<T>
  onRetry?: () => void
  children: (data: T) => ReactNode
}

export function RequestView<T>({ state, onRetry, children }: RequestViewProps<T>) {
  if (state.status === 'idle') return <p className={styles.muted}>Данные ещё не загружены.</p>
  if (state.status === 'loading') return <p className={styles.muted}>Загрузка…</p>
  if (state.status === 'error') {
    return (
      <div className={styles.errorBox}>
        <p className={styles.errorText}>Ошибка: {state.error}</p>
        {onRetry && (
          <button className={styles.btn} onClick={onRetry}>
            Повторить
          </button>
        )}
      </div>
    )
  }
  return <>{children(state.data)}</>
}
