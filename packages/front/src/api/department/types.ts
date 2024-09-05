export interface DepartmentItem {
  id: number
  name: string
  children?: DepartmentItem[]
  parentId?: number
}

export interface DepartmentListResponse {
  list: DepartmentItem[]
  total: number
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: number | undefined
  username?: string
  account?: string
}

export interface DepartmentUserItem {
  id: number
  username: string
  phone: string
  createdAt: string
  roles: any[]
  roleArr?: any[]
  role: string
  departmentId?: number
  department: DepartmentItem
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}
