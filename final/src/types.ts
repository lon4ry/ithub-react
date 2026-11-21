export interface UserInfo {
  username: string
  name: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginResponse extends TokenPair {
  user: UserInfo
}

export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: number
  title: string
  description: string
  priority: TaskPriority
  done: boolean
  created_at: string
}

export interface TaskCreate {
  title: string
  description: string
  priority: TaskPriority
}

export type TaskUpdate = Partial<TaskCreate & { done: boolean }>

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }
