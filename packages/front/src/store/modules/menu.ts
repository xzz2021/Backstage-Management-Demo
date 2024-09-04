import { defineStore } from 'pinia'
import { store } from '../index'
import { getMenuListApi2 } from '@/api/menu'
import { formatToTree } from '@/utils/tree'

interface UserState {
  curMenuId: number
  menuList: any[] // 菜单列表
}

export const useMenuStore = defineStore('menu', {
  state: (): UserState => {
    return {
      curMenuId: 0,
      menuList: []
    }
  },
  getters: {
    getCurMenuId(): number {
      return this.curMenuId
    },
    getMenuList(): any[] {
      return this.menuList
    }
  },
  actions: {
    setCurMenuId(id: number) {
      this.curMenuId = id
    },
    async setMenuList() {
      const res = await getMenuListApi2()
      this.menuList = formatToTree(res?.data?.list) || []
      return { list: this.menuList }
    }
  }
})

export const useMenuStoreWithOut = () => {
  return useMenuStore(store)
}
