import request from '@/axios'

export const getOrderListApi = (params: any) => {
  return request.get({ url: '/mock/order/list', params })
}

// export const getUserByDepartmentIdApi = (params: DepartmentUserParams) => {
//   return request.get<DepartmentUserResponse>({ url: '/api/user/listByDepartmentId', params })
// }
