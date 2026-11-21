import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RequestView } from '../components/RequestView'
import { useTasksStore } from '../store/tasksStore'
import type { TaskPriority } from '../types'
import styles from '../styles.module.css'

type TaskRouteParams = {
  id: string
}

export function TaskPage() {
  const { id } = useParams<TaskRouteParams>()
  const taskId = Number(id)
  const details = useTasksStore((s) => s.details)
  const loadTask = useTasksStore((s) => s.loadTask)
  const patchTask = useTasksStore((s) => s.patchTask)
  const removeTask = useTasksStore((s) => s.removeTask)
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  useEffect(() => {
    if (Number.isInteger(taskId) && taskId > 0) void loadTask(taskId)
  }, [taskId, loadTask])

  useEffect(() => {
    if (details.status === 'success') {
      setTitle(details.data.title)
      setDescription(details.data.description)
      setPriority(details.data.priority)
    }
  }, [details])

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return <p className={styles.errorText}>Некорректный идентификатор задачи.</p>
  }

  const handleSave = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (title.trim().length < 3) return
    await patchTask(taskId, { title: title.trim(), description, priority })
  }

  const handleDelete = async () => {
    await removeTask(taskId)
    navigate('/tasks')
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Задача #{taskId}</h1>
      <RequestView state={details} onRetry={() => void loadTask(taskId)}>
        {(task) => (
          <form className={styles.taskForm} onSubmit={(e) => void handleSave(e)}>
            <label className={styles.field}>
              Название
              <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <label className={styles.field}>
              Описание
              <textarea
                className={styles.textarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <label className={styles.field}>
              Приоритет
              <select
                className={styles.select}
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </label>
            <p className={styles.muted}>
              Создана: {task.created_at} · Статус: {task.done ? 'выполнена' : 'в работе'}
            </p>
            <div className={styles.cardActions}>
              <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
                Сохранить
              </button>
              <button
                className={styles.btn}
                type="button"
                onClick={() => void patchTask(taskId, { done: !task.done })}
              >
                {task.done ? 'Вернуть в работу' : 'Отметить выполненной'}
              </button>
              <button className={`${styles.btn} ${styles.btnDanger}`} type="button" onClick={() => void handleDelete()}>
                Удалить
              </button>
            </div>
          </form>
        )}
      </RequestView>
      <p>
        <Link to="/tasks">← К списку задач</Link>
      </p>
    </>
  )
}
