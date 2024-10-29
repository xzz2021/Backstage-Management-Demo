import { defineStore } from 'pinia'
// import { store } from '../index'
// import { getOrderListApi } from '@/api/menu'
// import { formatToTree } from '@/utils/tree'

interface UserState {
  curOrderId: number
  orderList: any[] // 菜单列表
}

export const useOrderStore = defineStore('order', {
  state: (): UserState => {
    return {
      curOrderId: 0,
      orderList: []
    }
  },
  getters: {
    getCurMenuId(): number {
      return this.curOrderId
    },
    getMenuList(): any[] {
      return this.orderList
    }
  },
  actions: {
    setCurMenuId(id: number) {
      this.curOrderId = id
    },
    async setMenuList() {
      // const res = await getOrderListApi()
      // console.log("TCL: setMenuList -> res", res)
      // return { list: res.data || [] }
      return { list: [] }
    }
  }
})

// export const useMenuStoreWithOut = () => {
//   return useMenuStore(store)
// }
