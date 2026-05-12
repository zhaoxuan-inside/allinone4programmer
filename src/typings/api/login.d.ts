import type { RoleType, User } from '@/entity'

export interface ApiLoginInfo extends User {
  id: number
  role: RoleType[]
  accessToken: string
  refreshToken: string
}
