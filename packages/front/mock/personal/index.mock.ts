// import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const timeout = 10

export default [
  // 列表接口
  {
    url: '/mock/personal/list',
    method: 'get',
    timeout,
    response: () => {
      return {
        code: SUCCESS_CODE,
        data: {
          list: [
            {
              id: 78,
              name: 's203489743985674589',
              username: 'xzz',
              phone: '13888888888',
              total_money: 1000,
              is_read: true
            },
            {
              id: 78,
              name: 's203489743985674589',
              username: 'xzz',
              phone: '13888888888',
              total_money: 1000,
              is_read: false
            }
          ],
          total: 1
        }
      }
    }
  }
]
