import type { LoginResponse, ProtectedData, UserInfo } from '../types'
import { api, publicApi } from './client'

export async function loginRequest(username: string, password: string): Promise<LoginResponse> {
  const { data } = await publicApi.post<LoginResponse>('/auth/login', { username, password })
  return data
}

export async function meRequest(): Promise<UserInfo> {
  const { data } = await api.get<UserInfo>('/auth/me')
  return data
}

export async function fetchProtectedData(): Promise<ProtectedData> {
  const { data } = await api.get<ProtectedData>('/protected/data')
  return data
}
