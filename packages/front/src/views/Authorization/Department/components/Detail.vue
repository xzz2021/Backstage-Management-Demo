<script setup lang="ts">
import { h, PropType, reactive } from 'vue'
import { DepartmentItem } from '@/api/department/types'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTag } from 'element-plus'

defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  }
})
const { t } = useI18n()
const renderTag = (enable?: boolean) => {
  return h(ElTag, { type: !enable ? 'danger' : 'success' }, () => (enable ? '启用' : '禁用'))
}
const detailSchema = reactive<DescriptionsSchema[]>([
  {
    field: 'name',
    label: t('userDemo.departmentName')
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    slots: {
      default: (data: any) => {
        const status = data?.row?.status
        return renderTag(status)
      }
    }
  },
  {
    field: 'createTime',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'remark',
    label: t('userDemo.remark')
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
