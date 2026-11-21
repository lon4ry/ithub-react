import type { Task } from '../types'
import { TaskItem } from './TaskItem'

interface TaskBoardProps {
  tasks: Task[]
}

export function TaskBoard({ tasks }: TaskBoardProps) {
  if (tasks.length === 0) {
    return <p className="empty">Задач нет</p>
  }

  return (
    <ul className="board">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  )
}
