/* 角色数据库表字段 */
export interface EntityMessage {
  id: number
  type: 0 | 1 | 2
  title: string
  icon: string
  tagTitle?: string
  tagType?: 'error' | 'info' | 'success' | 'warning'
  description?: string
  isRead?: boolean
  date: string
}
