import { useCallback, useEffect, useState } from 'react'
import { fetchProtectedData } from '../api/auth'
import { errorMessage } from '../api/client'
import { useAuthStore } from '../store/authStore'
import type { ProtectedData, RequestState } from '../types'

export function CabinetPage() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState<RequestState<ProtectedData>>({ status: 'idle' })

  const load = useCallback(async () => {
    setData({ status: 'loading' })
    try {
      setData({ status: 'success', data: await fetchProtectedData() })
    } catch (err) {
      setData({ status: 'error', error: errorMessage(err) })
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <>
      <h1>Личный кабинет</h1>
      <p>Вы вошли как {user?.name} ({user?.username}).</p>
      <p className="status">
        Защищённые данные запрашиваются с токеном из localStorage. Если access-токен истёк,
        response-interceptor обновит его через refresh-токен и повторит запрос.
      </p>
      <button onClick={() => void load()}>Запросить данные заново</button>
      <section>
        {data.status === 'loading' && <p>Загрузка…</p>}
        {data.status === 'error' && <p className="error">{data.error}</p>}
        {data.status === 'success' && (
          <div className="notice">
            <p>{data.data.message}</p>
            <p>Время сервера: {data.data.server_time}</p>
          </div>
        )}
      </section>
    </>
  )
}
