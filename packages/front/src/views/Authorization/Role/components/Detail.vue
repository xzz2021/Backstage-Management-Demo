<script setup lang="tsx">
import { PropType, ref, unref, nextTick } from 'vue'
import { Descriptions, DescriptionsSchema } from '@/components/Descriptions'
import { ElTag, ElTree } from 'element-plus'
import { findIndex } from '@/utils'
import { useI18n } from '@/hooks/web/useI18n'

const { t } = useI18n()
const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => undefined
  },
  menuList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const filterPermissionName = (value: string) => {
  //  1. 获取原始菜单上permission数组  遍历值是否存在permissionList中
  //  2. 如果存在，返回label标签名称  如果不存在，返回 ''
  const index = findIndex(unref(currentTreeData)?.permissionList || [], (item) => {
    return item.value === value
  })
  return (unref(currentTreeData)?.permissionList || [])[index].label ?? ''
}

const renderTag = (enable?: boolean) => {
  return <ElTag type={!enable ? 'danger' : 'success'}>{enable ? '启用' : '禁用'}</ElTag>
}

const treeRef = ref<typeof ElTree>()

const currentTreeData = ref()
// currentTreeData 既包含 permission 也包含 permissionList
const nodeClick = (treeData: any) => {
  console.log('🚀 ~ xzz: nodeClick -> treeData', treeData)
  currentTreeData.value = treeData
}

const treeData = ref<any[]>([])
const getMenuList = async () => {
  // const res = await getMenuListApi()
  if (props?.menuList) {
    treeData.value = props.menuList
    await nextTick()
  }
}
getMenuList()

const detailSchema = ref<DescriptionsSchema[]>([
  {
    field: 'name',
    label: '角色名称'
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return renderTag(data.status)
      }
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    span: 24
  },
  {
    field: 'permissionList',
    label: '菜单分配',
    span: 24,
    slots: {
      default: () => {
        return (
          <>
            <div class="flex w-full">
              <div class="flex-1">
                <ElTree
                  ref={treeRef}
                  node-key="id"
                  props={{ children: 'children', label: 'title' }}
                  highlight-current
                  expand-on-click-node={false}
                  data={treeData.value}
                  onNode-click={nodeClick}
                >
                  {{
                    default: (data) => {
                      return <span>{t(data?.data?.meta?.title)}</span>
                    }
                  }}
                </ElTree>
              </div>
              <div class="flex-1">
                {unref(currentTreeData)
                  ? unref(currentTreeData)?.meta?.permission?.map((v: string) => {
                      return <ElTag class="ml-2 mt-2">{filterPermissionName(v)}</ElTag>
                    })
                  : null}
              </div>
            </div>
          </>
        )
      }
    }
  }
])
</script>

<template>
  <Descriptions :schema="detailSchema" :data="currentRow || {}" />
</template>
