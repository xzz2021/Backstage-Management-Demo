import request from '@/axios'
import { RoleWithMenuItem } from './types'
import { MenuItem } from '../menu/types'

export const getRoleListApi = () => {
  return request.get({ url: '/mock/role/table' })
}

export const addRoleApi = (data) => {
  return request.post({ url: '/api/role/add', data })
}

export const editRoleApi = (data) => {
  return request.post({ url: '/api/role/update', data })
}

export const delRoleApi2 = (id) => {
  return request.delete({ url: '/api/role/' + id })
}

//  带有权限的列表
// export const getRoleListApi2 = () => {
//   return request.get<RoleListResponse>({ url: '/api/role/list' })
// }

//  只返回简单的角色列表  供 用户管理模块 下拉选择
export const getAllRoleApi = () => {
  return request.get({ url: '/api/role/rolelist' })
}

export const getMenuByIdApi = (params: { id: number }) => {
  return request.get<RoleWithMenuItem>({ url: '/api/role/getMenuById', params })
}

interface SwitchRoleResponse {
  id: number
  menu: MenuItem[]
}
// 切换角色
export const switchRoleApi = (data) => {
  return request.post<SwitchRoleResponse>({ url: '/api/role/switchRole', data })
}
