import { defineStore } from 'pinia'
import { store } from '../index'
import { buildTree } from '@/utils/tree'
import { getAllDepartmentListApi, getDepartmentListApi2 } from '@/api/department'
import { DepartmentItem } from '@/api/department/types'

interface UserState {
  departmentList: DepartmentItem[] // 菜单列表
  allDepartmentList: DepartmentItem[] // 菜单列表
}

export const useDepartmentStore = defineStore('department', {
  state: (): UserState => {
    return {
      departmentList: [],
      allDepartmentList: []
    }
  },
  getters: {
    getDepartmentList(): DepartmentItem[] {
      return this.departmentList
    },
    getAllDepartmentList(): DepartmentItem[] {
      return this.allDepartmentList
    }
  },
  actions: {
    async setDepartmentList(params) {
      const res = await getDepartmentListApi2(params)
      this.departmentList = buildTree(res?.data?.list) || []
      return { list: this.departmentList, total: res?.data?.total || 0 }
    },
    async setAllDepartmentList() {
      const res = await getAllDepartmentListApi()
      console.log('🚀 ~ xzz: setAllDepartmentList -> res', res)
      this.allDepartmentList = buildTree(res?.data?.list) || []
      return { list: this.allDepartmentList }
    }
  }
})

export const useDepartmentListStoreWithOut = () => {
  return useDepartmentStore(store)
}
