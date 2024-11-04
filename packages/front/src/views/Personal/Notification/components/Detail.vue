<script setup lang="tsx">
import { PropType, ref } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag } from 'element-plus'

import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()

defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  }
})

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: '订单号'
  },
  {
    field: 'username',
    label: '客户名称'
  },
  {
    field: 'phone',
    label: '客户手机'
  },
  {
    field: 'total_money',
    label: '订单总额'
  },
  {
    field: 'access_point_address',
    label: '配送地址',
    slots: {
      default: (data: any) => {
        const addressData = data.row?.access_point_address
        const address = addressData ? JSON.parse(addressData) : ''
        if (address?.id) {
          const { province, city, district, street } = address
          return province + city + district + street
        }
        return ''
      }
    }
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.is_read ? 'success' : 'danger'}>
              {data.is_read ? t('userDemo.hasRead') : t('userDemo.unRead')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'note',
    label: '备注信息'
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
