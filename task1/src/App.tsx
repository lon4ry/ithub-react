import { TaskBoard } from './components/TaskBoard'
import type { Task } from './types'

const tasks: Task[] = [
  { id: 1, title: 'Установить Node.js и Vite', isCompleted: true },
  { id: 2, title: 'Описать interface Task', isCompleted: true },
  { id: 3, title: 'Собрать компонент TaskBoard', isCompleted: false },
  { id: 4, title: 'Проверить пустое состояние', isCompleted: false },
]

export default function App() {
  return (
    <main>
      <h1>TaskBoard</h1>
      <h2>Список задач</h2>
      <TaskBoard tasks={tasks} />
      <h2>Пустой список</h2>
      <TaskBoard tasks={[]} />
    </main>
  )
}
