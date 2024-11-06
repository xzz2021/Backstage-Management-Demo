import { getRoleMenuApi2 } from '@/api/login'
import { formatToTree } from '@/utils/tree'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'
import { RouteRecordRaw, useRouter } from 'vue-router'

export const useLogin = (redirect) => {
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()
  const { addRoute, push } = useRouter()

  // 获取角色信息
  const getRoleMenu = async () => {
    const res = await getRoleMenuApi2() //  通过token解析 获取角色路由及权限
    //  上面模拟根据角色获取路由
    if (res) {
      // 这里是首次登陆  获取并设定路由信息
      const routers = res?.data || []
      const treeRouters = formatToTree(routers) //  转换成树形结构
      // let treeRouters = routers //  转换成树形结构
      //  if (treeRouters.length == 0) {
      //    // 若没有路由 就使用默认路由
      //    treeRouters = defaultRouter
      //  }
      userStore.setRoleRouters(treeRouters)
      await permissionStore.generateRoutes(treeRouters).catch(() => {}) // 合并生成路由
      permissionStore.getAddRouters.forEach((route) => {
        addRoute(route as RouteRecordRaw) // 动态添加可访问路由表 获得实际 component组件
      })
      permissionStore.setIsAddRouters(true)
      push({ path: redirect.value || permissionStore.addRouters[0].path })
    }
  }

  return {
    getRoleMenu
  }
}
