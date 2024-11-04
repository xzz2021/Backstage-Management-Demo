// import Mock from 'mockjs'
import { SUCCESS_CODE } from '@/constants'

const timeout = 10

export default [
  // 列表接口
  {
    url: '/mock/order/list',
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
              create_date: '2022-06-15 15:30:00'
            }
          ],
          total: 1
        }
      }
    }
  }
]
