import request from '@/axios'

export const getNotificationListApi = (params: any) => {
  return request.get({ url: '/mock/personal/list', params })
}
