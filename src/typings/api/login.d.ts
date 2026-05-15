import type { RoleType, User } from '@/typings/entities'

export interface ApiLoginInfo extends User {
  id: number
  role: RoleType[]
  accessToken: string
  refreshToken: string
}
