import type { ReactNode } from 'react'
import type { RequestState } from '../types'

interface RequestViewProps<T> {
  state: RequestState<T>
  onRetry?: () => void
  children: (data: T) => ReactNode
}

export function RequestView<T>({ state, onRetry, children }: RequestViewProps<T>) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return <p className="loading">Загрузка…</p>
    case 'error':
      return (
        <p className="error">
          Ошибка: {state.error} {onRetry && <button onClick={onRetry}>Повторить</button>}
        </p>
      )
    case 'success':
      return <>{children(state.data)}</>
  }
}
