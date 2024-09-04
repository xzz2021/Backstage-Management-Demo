import request from '@/axios'

export const getMenuListApi = () => {
  return request.get({ url: '/mock/menu/list' })
}

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

export const addPermissionList = (data) => {
  return request.post({ url: '/api/permissionList/add', data })
}

export const delPermissionList = (id) => {
  return request.delete({ url: '/api/permissionList/' + id })
}

export const updatePermissionList = (data) => {
  return request.post({ url: '/api/permissionList/update', data })
}
