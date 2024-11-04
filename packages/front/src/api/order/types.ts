// model Meta {
//   id                  Int      @id @default(autoincrement())
//   title               String?
//   icon                String?
//   affix               Boolean  @default(false)
//   activeMenu          Boolean  @default(false)
//   alwaysShow          Boolean  @default(false)
//   breadcrumb          Boolean  @default(false)
//   canTo               Boolean  @default(false)
//   hidden              Boolean  @default(false)
//   noCache             Boolean  @default(false)
//   noTagsView          Boolean  @default(false)
//   deleted             Boolean  @default(false)
//   createdAt           DateTime @default(now())
//   updatedAt           DateTime @updatedAt
//   deleteAt            DateTime?
//   menu                Menu @relation(fields: [menuId], references: [id], onDelete: Cascade) //  一对一
//   menuId              Int   @unique  //  关联外键  // 一对一
//   permission          Json @default("[]")
// }

export interface Meta {
  id: number
  title?: string
  icon?: string
  affix?: boolean
  activeMenu?: boolean
  alwaysShow?: boolean
  breadcrumb?: boolean
  canTo?: boolean
  hidden?: boolean
  noCache?: boolean
  noTagsView?: boolean
}

export interface PermissionList {
  id: number
  nodeid: string
  label: string
  value: string
}

export interface MenuItem {
  id: number
  name: string
  path: string
  redirect?: string
  component: string
  title?: string
  sort?: number
  parentId?: number
  meta?: Meta
  permissionList?: PermissionList[]
  permission?: string[]
  children?: MenuItem[]
  status?: boolean
  deleted?: boolean
  createdAt?: string
  updatedAt?: string
  deleteAt?: string
  type?: number
}

export interface DepartmentUserParams {
  pageSize: number
  pageIndex: number
  id: number | undefined
  username?: string
  account?: string
}

export interface MenuListResponse {
  list: MenuItem[]
  total: number
}
