import type { EntityUser, RoleType } from '@/typings/entities'

export type ApiLoginInfo = EntityUser & {
  id: number
  role: RoleType[]
  accessToken: string
  refreshToken: string
}
