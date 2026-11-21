import { useEffect, useState, type SyntheticEvent } from 'react'
import { RequestView } from '../components/RequestView'
import { TaskCard } from '../components/TaskCard'
import { useTasksStore } from '../store/tasksStore'
import type { Task, TaskPriority } from '../types'
import styles from '../styles.module.css'

type Filter = 'all' | 'active' | 'done'

const filterLabels: Record<Filter, string> = {
  all: 'Все',
  active: 'Активные',
  done: 'Выполненные',
}

export function TasksPage() {
  const list = useTasksStore((s) => s.list)
  const loadTasks = useTasksStore((s) => s.loadTasks)
  const addTask = useTasksStore((s) => s.addTask)
  const patchTask = useTasksStore((s) => s.patchTask)
  const removeTask = useTasksStore((s) => s.removeTask)

  const [filter, setFilter] = useState<Filter>('all')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('medium')

  useEffect(() => {
    void loadTasks()
  }, [loadTasks])

  const handleCreate = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (title.trim().length < 3) return
    await addTask({ title: title.trim(), description: '', priority })
    setTitle('')
  }

  const visible: Task[] =
    list.status === 'success'
      ? list.data.filter((task) => filter === 'all' || (filter === 'done' ? task.done : !task.done))
      : []

  return (
    <>
      <h1 className={styles.pageTitle}>Мои задачи</h1>
      <form className={styles.inlineForm} onSubmit={(e) => void handleCreate(e)}>
        <input
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название задачи (от 3 символов)"
        />
        <select
          className={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
        >
          <option value="low">Низкий приоритет</option>
          <option value="medium">Средний приоритет</option>
          <option value="high">Высокий приоритет</option>
        </select>
        <button className={`${styles.btn} ${styles.btnPrimary}`} type="submit">
          Добавить
        </button>
      </form>

      <div className={styles.filters}>
        {(Object.keys(filterLabels) as Filter[]).map((key) => (
          <button
            key={key}
            className={filter === key ? `${styles.btn} ${styles.filterActive}` : styles.btn}
            onClick={() => setFilter(key)}
          >
            {filterLabels[key]}
          </button>
        ))}
      </div>

      <RequestView state={list} onRetry={() => void loadTasks()}>
        {() =>
          visible.length === 0 ? (
            <p className={styles.muted}>Задач нет.</p>
          ) : (
            <ul className={styles.list}>
              {visible.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={(t) => void patchTask(t.id, { done: !t.done })}
                  onDelete={(t) => void removeTask(t.id)}
                />
              ))}
            </ul>
          )
        }
      </RequestView>
    </>
  )
}
