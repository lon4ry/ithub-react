import { create } from 'zustand'
import { errorMessage } from '../api/client'
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from '../api/tasks'
import type { RequestState, Task, TaskCreate, TaskUpdate } from '../types'

interface TasksStore {
  list: RequestState<Task[]>
  details: RequestState<Task>
  loadTasks: () => Promise<void>
  loadTask: (id: number) => Promise<void>
  addTask: (body: TaskCreate) => Promise<Task | null>
  patchTask: (id: number, body: TaskUpdate) => Promise<void>
  removeTask: (id: number) => Promise<void>
}

export const useTasksStore = create<TasksStore>((set, get) => ({
  list: { status: 'idle' },
  details: { status: 'idle' },

  loadTasks: async () => {
    set({ list: { status: 'loading' } })
    try {
      set({ list: { status: 'success', data: await fetchTasks() } })
    } catch (err) {
      set({ list: { status: 'error', error: errorMessage(err) } })
    }
  },

  loadTask: async (id) => {
    set({ details: { status: 'loading' } })
    try {
      set({ details: { status: 'success', data: await fetchTask(id) } })
    } catch (err) {
      set({ details: { status: 'error', error: errorMessage(err) } })
    }
  },

  addTask: async (body) => {
    try {
      const task = await createTask(body)
      const list = get().list
      if (list.status === 'success') {
        set({ list: { status: 'success', data: [task, ...list.data] } })
      }
      return task
    } catch (err) {
      set({ list: { status: 'error', error: errorMessage(err) } })
      return null
    }
  },

  patchTask: async (id, body) => {
    try {
      const updated = await updateTask(id, body)
      const list = get().list
      if (list.status === 'success') {
        set({ list: { status: 'success', data: list.data.map((t) => (t.id === id ? updated : t)) } })
      }
      const details = get().details
      if (details.status === 'success' && details.data.id === id) {
        set({ details: { status: 'success', data: updated } })
      }
    } catch (err) {
      set({ details: { status: 'error', error: errorMessage(err) } })
    }
  },

  removeTask: async (id) => {
    try {
      await deleteTask(id)
      const list = get().list
      if (list.status === 'success') {
        set({ list: { status: 'success', data: list.data.filter((t) => t.id !== id) } })
      }
    } catch (err) {
      set({ details: { status: 'error', error: errorMessage(err) } })
    }
  },
}))
