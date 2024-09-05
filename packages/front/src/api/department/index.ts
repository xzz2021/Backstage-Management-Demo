import request from '@/axios'
import { DepartmentListResponse, DepartmentUserParams, DepartmentUserResponse } from './types'

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

export const addDepartmentApi = (data) => {
  return request.post({ url: '/api/department/add', data })
}

export const editDepartmentApi = (data) => {
  return request.post({ url: '/api/department/update', data })
}

export const getAllDepartmentListApi = () => {
  return request.get<DepartmentListResponse>({ url: '/api/department/alllist' })
}
//  此处后端合并了处理分页查询和 带id过滤的分页查询
export const getDepartmentListApi2 = (params: any) => {
  return request.get<DepartmentListResponse>({ url: '/api/department/list', params })
}

export const delDepartmentApi2 = (id) => {
  return request.delete({ url: '/api/department/' + id })
}
