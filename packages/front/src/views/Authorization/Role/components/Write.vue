<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref, nextTick } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { ElTree, ElCheckboxGroup, ElCheckbox } from 'element-plus'
import { getMenuListApi } from '@/api/menu'
import { filter, eachTree } from '@/utils/tree'
import { findIndex } from '@/utils'

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  },
  menuList: {
    type: Array as PropType<any[]>,
    default: () => []
  }
})

const treeRef = ref<typeof ElTree>()

const formSchema = ref<FormSchema[]>([
  {
    field: 'name',
    label: t('role.roleName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
    value: true,
    componentProps: {
      options: [
        {
          label: t('userDemo.disable'),
          value: false
        },
        {
          label: t('userDemo.enable'),
          value: true
        }
      ]
    }
  },
  {
    field: 'remark',
    label: t('userDemo.remark'),
    component: 'Input',
    componentProps: {
      type: 'textarea',
      rows: 5
    },
    colProps: {
      span: 24
    }
  },
  {
    field: 'menu',
    label: t('role.menu'),
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: () => {
          return (
            <>
              <div class="flex w-full">
                <div class="flex-1">
                  <ElTree
                    ref={treeRef}
                    show-checkbox
                    node-key="id"
                    highlight-current
                    check-strictly={false}
                    expand-on-click-node={false}
                    data={treeData.value}
                    onNode-click={nodeClick}
                  >
                    {{
                      default: (data) => {
                        return <span>{t(data.data.meta.title)}</span>
                      }
                    }}
                  </ElTree>
                </div>
                <div class="flex-1">
                  {unref(currentTreeData) && unref(currentTreeData)?.permissionList ? (
                    <ElCheckboxGroup v-model={unref(currentTreeData).meta.permission}>
                      {unref(currentTreeData)?.permissionList.map((v: any) => {
                        return <ElCheckbox label={v.label} value={v.value}></ElCheckbox>
                      })}
                    </ElCheckboxGroup>
                  ) : null}
                </div>
              </div>
            </>
          )
        }
      }
    }
  }
])

const currentTreeData = ref()
const nodeClick = (treeData: any) => {
  console.log('🚀 ~ xzz: nodeClick -> treeData', treeData)
  currentTreeData.value = treeData
}

const rules = reactive({
  name: [required()],
  role: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const treeData = ref<any[]>([])
const getMenuList = async () => {
  // const res = props.menuList
  if (props.menuList) {
    // 1. 先获取整颗菜单列表树 permission为[] permissionList存在
    treeData.value = props.menuList
    if (!props.currentRow) return
    await nextTick() //   等待dom更新
    // 2.  把所有需要勾选的项找出来   {id: menuid, permission: ['permission1', 'permission2']}
    const checked: any[] = []
    // console.log('🚀 ~ xzz: getMenuList -> props.currentRow.menu', props.currentRow)
    eachTree(props.currentRow.menu, (v) => {
      checked.push({
        id: v.id, //  当前菜单项id
        permission: v.meta?.permission || [] //  当前菜单项权限数组
      })
    })
    eachTree(treeData.value, (v) => {
      const index = findIndex(checked, (item) => {
        return item.id === v.id
      })
      //  treeData 是数据中permission是空[], 所以需要在此手动赋值
      if (index > -1) {
        const meta = { ...(v.meta || {}) }
        meta.permission = checked[index].permission
        v.meta = meta
      }
    })
    for (const item of checked) {
      //  此处使用了element plus tree组件的设置节点是否被选中方法
      //  这里只是 菜单项被 勾选
      unref(treeRef)?.setChecked(item.id, true, false)
    }
    // unref(treeRef)?.setCheckedKeys(
    //   checked.map((v) => v.id),
    //   false
    // )
  }
}
getMenuList()

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    const checkedKeys = unref(treeRef)?.getCheckedKeys() || []
    const data = filter(unref(treeData), (item: any) => {
      return checkedKeys.includes(item.id)
    })
    // formData.menu = data || []
    // const menuStorage = data.map((v: any) => {
    const storePermission = getMenuIdAndPermission(data)
    formData.menu = storePermission || []
    return formData
  }
}

const getMenuIdAndPermission = (data) => {
  const menuIdAndPermission: { id: Number; permission?: String[] }[] = []
  eachTree(data, (v) => {
    // eachTree函数会自动递归
    if (v.meta?.permission && v.meta.permission.length > 0) {
      menuIdAndPermission.push({
        id: v.id,
        permission: v.meta.permission
      })
    } else {
      menuIdAndPermission.push({ id: v.id })
    }
    // if (v.children && v.children.length > 0) {
    //   const childArr = getMenuIdAndPermission(v.children)
    //   menuIdAndPermission.push(...childArr)
    // }
  })
  return menuIdAndPermission
}

watch(
  () => props.currentRow,
  (currentRow) => {
    if (!currentRow) return
    setValues(currentRow)
  },
  {
    deep: true,
    immediate: true
  }
)

defineExpose({
  submit
})
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
</template>
