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
  id: number
  username?: string
  account?: string
}

export interface DepartmentUserItem {
  id: number
  username: string
  account: string
  email: string
  createTime: string
  role: string
  department: DepartmentItem
}

export interface DepartmentUserResponse {
  list: DepartmentUserItem[]
  total: number
}
