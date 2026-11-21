import { Link } from 'react-router-dom'
import type { Task, TaskPriority } from '../types'
import styles from '../styles.module.css'

interface TaskCardProps {
  task: Task
  onToggle: (task: Task) => void
  onDelete: (task: Task) => void
}

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
}

export function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <li className={task.done ? `${styles.card} ${styles.done}` : styles.card}>
      <div className={styles.cardMain}>
        <span className={`${styles.badge} ${styles[`priority_${task.priority}`]}`}>
          {priorityLabels[task.priority]}
        </span>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
        {task.done && <span className={styles.muted}>выполнено</span>}
      </div>
      <div className={styles.cardActions}>
        <button className={styles.btn} onClick={() => onToggle(task)}>
          {task.done ? 'Вернуть в работу' : 'Выполнено'}
        </button>
        <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onDelete(task)}>
          Удалить
        </button>
      </div>
    </li>
  )
}
