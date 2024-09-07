import type { MenuItem } from '../menu/types'

export interface RoleListItem {
  id: number
  name: string
  remark?: string
  status: boolean
}

export interface RoleListResponse {
  list: RoleListItem[]
  total: number
}

export interface RoleWithMenuItem extends RoleListItem {
  menu: MenuItem[]
}
