export type RoleType = 'super' | 'admin' | 'user'
/* 角色数据库表字段 */
export interface EntityRole {
  /** 用户id */
  id?: number
  /** 用户名 */
  role?: RoleType
}
