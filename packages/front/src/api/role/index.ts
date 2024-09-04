import request from '@/axios'

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
export const getRoleListApi2 = () => {
  return request.get({ url: '/api/role/list' })
}

//  只返回简单的角色列表  供 下拉选择
export const getAllRoleApi = () => {
  return request.get({ url: '/api/role/rolelist' })
}
