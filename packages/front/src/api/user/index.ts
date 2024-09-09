import request from '@/axios'
import {
  DepartmentListResponse,
  DepartmentUserParams,
  DepartmentUserResponse,
  UserItem
} from './types'

export const getDepartmentApi = () => {
  return request.get<DepartmentListResponse>({ url: '/mock/department/list' })
}

export const getUserByIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/mock/department/users', params })
}

export const deleteUserByIdApi = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/user/delete', data: { ids } })
}

export const saveUserApi = (data: any) => {
  return request.post({ url: '/mock/department/user/save', data })
}

export const saveDepartmentApi = (data: any) => {
  return request.post({ url: '/mock/department/save', data })
}

export const deleteDepartmentApi = (ids: string[] | number[]) => {
  return request.post({ url: '/mock/department/delete', data: { ids } })
}

export const getDepartmentTableApi = (params: any) => {
  return request.get({ url: '/mock/department/table/list', params })
}

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

//   ====================================

export const addMenuApi = (data) => {
  return request.post({ url: '/api/menu/add', data })
}

export const editMenuApi = (data) => {
  return request.post({ url: '/api/menu/update', data })
}

export const getMenuListApi2 = () => {
  return request.get({ url: '/api/menu/list' })
}

export const delMenuApi2 = (id) => {
  return request.delete({ url: '/api/menu/' + id })
}

// 根据 部门id 进行分页查询
export const getUserByDepartmentIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/api/user/listByDepartmentId', params })
}

export const addUserApi = (data) => {
  return request.post({ url: '/api/user/add', data })
}

export const editUserApi = (data) => {
  return request.post({ url: '/api/user/update', data })
}

export const delUserApi = (id: number) => {
  return request.delete({ url: '/api/user/' + id })
}

interface DetailUserResponse {
  department: { id: number; name: string }
  roles: { id: number; name: string }[]
}

export const getUserByIdApi2 = (params: { id: number }) => {
  return request.get<DetailUserResponse>({ url: '/api/user/detailById', params })
}

interface PersonResponse {
  userinfo: UserItem
}

//  根据id获取用户个人中心信息  及角色数组
export const getPersonByIdApi = (params: { id: number }) => {
  return request.get<PersonResponse>({ url: '/api/user/personById', params })
}

interface IdResponse {
  id: number
}
export const resetPasswordApi = (data) => {
  return request.post<IdResponse>({ url: '/api/user/resetPassword', data })
}

//  个人中心操作
export const updateInfoApi = (data) => {
  return request.post({ url: '/api/user/updateInfo', data })
}

export const updatePwdApi = (data) => {
  return request.post({ url: '/api/user/updatePwd', data })
}
