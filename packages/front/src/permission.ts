import router from './router'
import { useAppStoreWithOut } from '@/store/modules/app'
import type { RouteRecordRaw } from 'vue-router'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePermissionStoreWithOut } from '@/store/modules/permission'
import { usePageLoading } from '@/hooks/web/usePageLoading'
import { NO_REDIRECT_WHITE_LIST } from '@/constants'
import { useUserStoreWithOut } from '@/store/modules/user'

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

router.beforeEach(async (to, from, next) => {
  start()
  loadStart()
  // 用户权限路由  app  用户信息store
  const permissionStore = usePermissionStoreWithOut()
  // const appStore = useAppStoreWithOut()
  const userStore = useUserStoreWithOut()
  // 用户信息是否存在
  if (userStore.getUserInfo) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 是否已 动态添加路由表
      if (permissionStore.getIsAddRouters) {
        // const all = router.getRoutes()
        // console.log('🚀 ~ xzz: all', all)
        next()
        return
      }

      // 上面的逻辑是  如果用户登陆过且分配过路由  则直接进入相应路由
      //  如果有用户信息 还存在未分配路由???????动态路由为空  永远跳转404
      // 开发者可根据实际情况进行修改
      const roleRouters = userStore.getRoleRouters || []

      await permissionStore.generateRoutes(roleRouters as AppCustomRouteRecordRaw[])

      // 动态添加可访问路由表
      permissionStore.getAddRouters.forEach((route) => {
        router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
      })
      const redirectPath = from.query.redirect || to.path
      const redirect = decodeURIComponent(redirectPath as string)
      const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect }
      permissionStore.setIsAddRouters(true)
      next(nextData)
    }
  } else {
    // 如果用户未登陆  重定向到白名单页面
    if (NO_REDIRECT_WHITE_LIST.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
