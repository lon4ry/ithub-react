import type { Task, TaskCreate, TaskUpdate } from '../types'
import { api } from './client'

export async function fetchTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks')
  return data
}

export async function fetchTask(id: number): Promise<Task> {
  const { data } = await api.get<Task>(`/tasks/${id}`)
  return data
}

export async function createTask(body: TaskCreate): Promise<Task> {
  const { data } = await api.post<Task>('/tasks', body)
  return data
}

export async function updateTask(id: number, body: TaskUpdate): Promise<Task> {
  const { data } = await api.patch<Task>(`/tasks/${id}`, body)
  return data
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
