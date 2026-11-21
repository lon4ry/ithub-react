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

export interface ProtectedData {
  message: string
  server_time: string
}

export type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }
