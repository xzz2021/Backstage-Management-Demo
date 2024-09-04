import request from '@/axios'
import type { UserRegisterType, UserType, UserType2 } from './types'

interface RoleParams {
  roleName: string
}

export const loginApi = (data: UserType): Promise<IResponse<UserType>> => {
  return request.post({ url: '/mock/user/login', data })
}

export const loginOutApi = (): Promise<IResponse> => {
  return request.get({ url: '/mock/user/loginOut' })
}

export const getUserListApi = ({ params }: AxiosConfig) => {
  return request.get<{
    code: string
    data: {
      list: UserType[]
      total: number
    }
  }>({ url: '/mock/user/list', params })
}

export const getAdminRoleApi = (
  params: RoleParams
): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: '/mock/role/list', params })
}

export const getTestRoleApi = (params: RoleParams): Promise<IResponse<string[]>> => {
  return request.get({ url: '/mock/role/list2', params })
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export const loginApi2 = (data: UserType): Promise<IResponse<any>> => {
  return request.post({ url: 'api/auth/login', data })
}

export const registerApi2 = (data: UserRegisterType): Promise<IResponse<UserType2>> => {
  return request.post({ url: 'api/userinfo/register', data })
}

//  这里是 用户登录后  拿到 角色   根据已分配好的菜单及权限  获取当前 角色所拥有的菜单
export const getRoleMenuApi2 = (): Promise<IResponse<AppCustomRouteRecordRaw[]>> => {
  return request.get({ url: 'api/role/getMenu' })
}

//  检查token是否过期
export const isTokenExpired2 = (): Promise<IResponse> => {
  return request.get({ url: 'api/checkToken' })
}
