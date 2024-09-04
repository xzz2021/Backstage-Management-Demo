<script setup lang="ts">
import { Error } from '@/components/Error'
import { usePermissionStore } from '@/store/modules/permission'
// import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

const { push } = useRouter()

const permissionStore = usePermissionStore()
// const userStore = useUserStore()
const errorClick = () => {
  //  当调试出错时 /:path(.*)*  匹配不到任何路由 无法跳转  重新登录
  // console.log(
  //   '🚀 ~ xzz: errorClick -> permissionStore.getRouters?.length',
  //   permissionStore.getRouters
  // )
  // if (permissionStore.getRouters?.length === 0) {
  //   //  清除localstorage
  //   userStore.reset()
  //   //  跳转到登录页
  //   push('/')
  // }
  push(permissionStore.addRouters[0]?.path as string)
}
</script>

<template>
  <Error @error-click="errorClick" />
</template>
