<script setup lang="ts">
import { useI18n } from '@/hooks/web/useI18n'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'
import { propTypes } from '@/utils/propTypes'
import { ElBadge } from 'element-plus'
const { push } = useRouter()

const userStore = useUserStore()

const { t } = useI18n()

defineProps({
  color: propTypes.string.def('')
})
</script>

<template>
  <div @click="push('/personal/notification')">
    <ElBadge :value="userStore.getUnReadCount" class="item" :show-zero="false" style="height: 18px">
      <Icon :size="18" icon="mingcute:notification-line" class="cursor-pointer !p-0" />
    </ElBadge>
  </div>
</template>

<style scoped lang="less"></style>
