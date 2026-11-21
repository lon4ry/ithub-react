import type { Task } from '../types'

interface TaskItemProps {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <li className={task.isCompleted ? 'task task--done' : 'task'}>
      <input type="checkbox" checked={task.isCompleted} readOnly aria-label="Выполнено" />
      <span>{task.title}</span>
    </li>
  )
}
