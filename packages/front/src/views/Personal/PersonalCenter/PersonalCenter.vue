<script setup lang="ts">
import { ContentWrap } from '@/components/ContentWrap'
import { computed, ref, unref } from 'vue'
import {
  ElDivider,
  ElImage,
  ElTag,
  ElTabPane,
  ElTabs,
  ElButton,
  ElMessage,
  ElSelect,
  ElOption
} from 'element-plus'
import defaultAvatar from '@/assets/imgs/avatar.jpg'
import UploadAvatar from './components/UploadAvatar.vue'
import { Dialog } from '@/components/Dialog'
import EditInfo from './components/EditInfo.vue'
import EditPassword from './components/EditPassword.vue'
import { getPersonByIdApi } from '@/api/user'
import { useUserStore } from '@/store/modules/user'
import { usePermissionStore } from '@/store/modules/permission'

import { UserItem } from '@/api/user/types'
import { switchRoleApi } from '@/api/role'
import { buildTree } from '@/utils/tree'
import defaultRouter from '../../Login/components/defaultRouter'
import { RouteRecordRaw } from 'vue-router'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const permissionStore = usePermissionStore()
const { addRoute } = useRouter()

const userInfo = ref<UserItem>()
const fetchDetailUserApi = async () => {
  // 这里可以调用接口获取用户信息
  const userId = userStore.getUserInfo
  if (!userId?.id) {
    ElMessage.error('请先登录')
    return
  }
  try {
    const res = await getPersonByIdApi({ id: userId?.id })
    userInfo.value = res?.data?.userinfo || { roleList: [] }
  } catch (error) {
    console.log('🚀 ~ xzz: fetchDetailUserApi -> error', error)
    ElMessage.error('获取用户信息失败,请刷新页面!')
  }
}
fetchDetailUserApi()

const curRole = computed(() => {
  if (userInfo.value?.roleList && userInfo.value?.roleList?.length > 0) {
    const { roleList, curRoleId = null } = userInfo.value as UserItem
    return roleList.find((item) => item?.id == curRoleId)?.name || roleList[0].name || '未知'
  }
  return '未知'
})
const activeName = ref('first')

const dialogVisible = ref(false)

const uploadAvatarRef = ref<ComponentRef<typeof UploadAvatar>>()
const avatarLoading = ref(false)
const saveAvatar = async () => {
  try {
    avatarLoading.value = true
    const base64 = unref(uploadAvatarRef)?.getBase64()
    console.log(base64)
    // 这里可以调用修改头像接口
    fetchDetailUserApi()
    ElMessage.success('修改成功')
    dialogVisible.value = false
  } catch (error) {
    console.log(error)
  } finally {
    avatarLoading.value = false
  }
}

const curRoleItem = ref()
const onRoleSwitch = async (value) => {
  userInfo.value && (userInfo.value.curRoleId = value)
  // console.log('🚀 ~ xzz: onRoleSwitch -> userInfo.value', userInfo.value)
  // return
  // 这里可以调用修改角色接口
  try {
    const res = await switchRoleApi({ id: userInfo.value?.id, curRoleId: value })
    if (res?.data?.id) {
      const { menu } = res.data
      await updateRouter(menu)
      ElMessage.success('切换角色成功')
      // 更新路由
    } else {
      ElMessage.error('切换角色失败')
    }
  } catch (error) {
    console.log('🚀 ~ xzz: onRoleSwitch -> error', error)
  }
}

const updateRouter = async (routers) => {
  let treeRouters: any = buildTree(routers) //  转换成树形结构
  // let treeRouters = routers //  转换成树形结构
  if (treeRouters.length == 0) {
    // 若没有路由 就使用默认路由
    treeRouters = defaultRouter
  }
  userStore.setRoleRouters(treeRouters)
  await permissionStore.generateRoutes(treeRouters).catch(() => {}) // 合并生成路由
  permissionStore.getAddRouters.forEach((route) => {
    addRoute(route as RouteRecordRaw) // 动态添加可访问路由表 获得实际 component组件
  })
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <div title="个人信息" class="w-400px">
      <div class="flex justify-center items-center">
        <div
          class="avatar w-[150px] h-[150px] relative cursor-pointer"
          @click="dialogVisible = true"
        >
          <ElImage
            class="w-[150px] h-[150px] rounded-full"
            :src="userInfo?.avatar || defaultAvatar"
            fit="fill"
          />
        </div>
      </div>
      <ElDivider />
      <div class="flex justify-between items-center">
        <div>用户名：</div>
        <div>{{ userInfo?.username }}</div>
      </div>
      <ElDivider />
      <!-- <div class="flex justify-between items-center">
        <div>昵称：</div>
        <div>{{ userInfo?.realName }}</div>
      </div>
      <ElDivider /> -->
      <div class="flex justify-between items-center">
        <div>手机号码：</div>
        <div>{{ userInfo?.phone ?? '-' }}</div>
      </div>
      <ElDivider />
      <!-- <div class="flex justify-between items-center">
        <div>用户邮箱：</div>
        <div>{{ userInfo?.email ?? '-' }}</div>
      </div>
      <ElDivider /> -->
      <div class="flex justify-between items-center">
        <div>所属角色：</div>
        <div>
          <template v-if="userInfo?.roleList?.length">
            <ElTag v-for="item in userInfo?.roleList || []" :key="item?.id" class="ml-2 mb-w"
              >{{ item.name }}
            </ElTag>
          </template>
          <template v-else>-</template>
        </div>
      </div>
      <ElDivider />
      <div v-if="userInfo?.roleList?.length && userInfo?.roleList?.length > 1">
        <div class="flex justify-between items-center">
          <div>当前角色：</div>
          <div>
            <ElTag class="ml-2 mb-w">{{ curRole }} </ElTag>
          </div>
        </div>
        <ElDivider />

        <div class="flex justify-between items-center">
          <div>切换角色：</div>
          <div>
            <ElSelect
              v-model="curRoleItem"
              placeholder="选择角色"
              @change="onRoleSwitch"
              style="width: 120px"
            >
              <ElOption
                v-for="item in userInfo?.roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </ElSelect>
          </div>
        </div>
        <ElDivider />
      </div>
    </div>
    <ContentWrap title="基本资料" class="flex-[3] ml-20px">
      <ElTabs v-model="activeName">
        <ElTabPane label="基本信息" name="first">
          <EditInfo :user-info="userInfo" />
        </ElTabPane>
        <ElTabPane label="修改密码" name="second">
          <EditPassword />
        </ElTabPane>
      </ElTabs>
    </ContentWrap>
  </div>

  <Dialog v-model="dialogVisible" title="修改头像" width="800px">
    <UploadAvatar ref="uploadAvatarRef" :url="userInfo?.avatar || defaultAvatar" />
    <template #footer>
      <ElButton type="primary" :loading="avatarLoading" @click="saveAvatar"> 保存 </ElButton>
      <ElButton @click="dialogVisible = false">关闭</ElButton>
    </template>
  </Dialog>
</template>

<style lang="less" scoped>
.avatar {
  position: relative;

  &::after {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 50px;
    color: #fff;
    background-color: rgb(0 0 0 / 40%);
    border-radius: 50%;
    content: '+';
    opacity: 0;
    justify-content: center;
    align-items: center;
  }

  &:hover {
    &::after {
      opacity: 1;
    }
  }
}
</style>
