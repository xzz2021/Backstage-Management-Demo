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

export const getUserByDepartmentIdApi = (params: DepartmentUserParams) => {
  return request.get<DepartmentUserResponse>({ url: '/api/department/users', params })
}
