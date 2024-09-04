<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch, ref, unref } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { useI18n } from '@/hooks/web/useI18n'
import { delPermissionList, updatePermissionList } from '@/api/menu'
import {
  ElButton,
  ElInput,
  ElMessage,
  ElPopconfirm,
  ElTable,
  ElTableColumn,
  ElTag
} from 'element-plus'
import AddButtonPermission from './AddButtonPermission.vue'
import { BaseButton } from '@/components/Button'
import { cloneDeep } from 'lodash-es'
import { useMenuStore } from '@/store/modules/menu'

const menuStore = useMenuStore()

const { t } = useI18n()

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const handleClose = async (row: any) => {
  const formData1 = await getFormData()
  try {
    const res = await delPermissionList(row?.id)
    const id = res?.data?.id
    if (id) {
      // 删除对应的权限
      setValues({
        permissionList: formData1?.permissionList?.filter((v: any) => v.value !== row.value)
      })
      ElMessage.success('删除成功!')
    }
  } catch (error) {
    console.log('🚀 ~ xzz: error', error)
  }
}

const handleEdit = async (row: any) => {
  // 深拷贝当前行数据到编辑行
  permissionEditingRow.value = { ...row }
}

const handleSave = async () => {
  const formData = await getFormData()
  const index = formData?.permissionList?.findIndex(
    (x) => x.nodeid === permissionEditingRow.value.nodeid
  )
  if (index !== -1) {
    formData.permissionList[index] = { ...permissionEditingRow.value }
    try {
      const { id, label, value, nodeid, menuId } = permissionEditingRow.value
      const res = await updatePermissionList({ id, label, value, nodeid, menuId })
      const idx = res?.data?.id
      if (idx) {
        permissionEditingRow.value = null // 重置编辑状态
      }
    } catch (error) {
      console.log('🚀 ~ xzz: handleSave -> error', error)
    }
  }
}

const showDrawer = ref(false)
// 存储正在编辑的行的数据
const permissionEditingRow = ref<any>(null)

const formSchema = reactive<FormSchema[]>([
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButton',
    value: 0,
    colProps: {
      span: 24
    },
    componentProps: {
      options: [
        {
          label: '目录',
          value: 0
        },
        {
          label: '菜单',
          value: 1
        }
      ],
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          if (val === 1) {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: false
              }
            ])
            setValues({
              component: unref(cacheComponent)
            })
          } else {
            setSchema([
              {
                field: 'component',
                path: 'componentProps.disabled',
                value: true
              }
            ])

            if (formData.parentId === void 0) {
              setValues({
                component: '#'
              })
            } else {
              setValues({
                component: '##'
              })
            }
          }
        }
      }
    }
  },
  {
    field: 'parentId',
    label: '父级菜单',
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        label: (item: any) => {
          return t(item?.meta?.title)
        },
        value: 'id',
        children: 'children'
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true,
      on: {
        change: async (val: number) => {
          const formData = await getFormData()
          if (val && formData.type === 0) {
            setValues({
              component: '##'
            })
          } else if (!val && formData.type === 0) {
            setValues({
              component: '#'
            })
          } else if (formData.type === 1) {
            setValues({
              component: unref(cacheComponent) ?? ''
            })
          }
        }
      }
    },
    optionApi: async () => {
      return menuStore.getMenuList
    }
  },
  {
    field: 'meta.title',
    label: t('menu.menuName'),
    component: 'Input'
  },
  {
    field: 'component',
    label: '组件',
    component: 'Input',
    value: '#',
    componentProps: {
      disabled: true,
      placeholder: '#为顶级目录，##为子目录',
      on: {
        change: (val: string) => {
          cacheComponent.value = val
        }
      }
    }
  },
  {
    field: 'name',
    label: t('menu.name'),
    component: 'Input'
  },
  {
    field: 'meta.icon',
    label: t('menu.icon'),
    component: 'Input'
  },
  {
    field: 'path',
    label: t('menu.path'),
    component: 'Input'
  },
  {
    field: 'redirect',
    label: t('menu.redirect'),
    component: 'Input'
  },

  {
    field: 'status',
    label: t('menu.status'),
    component: 'Select',
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
    field: 'permissionList',
    label: t('menu.permission'),
    component: 'CheckboxGroup',
    colProps: {
      span: 24
    },
    formItemProps: {
      slots: {
        default: (data: any) => (
          <>
            <BaseButton
              class="m-t-5px"
              type="primary"
              size="small"
              onClick={() => (showDrawer.value = true)}
              disabled={!data?.id}
            >
              添加权限
            </BaseButton>
            <ElTable data={data?.permissionList}>
              <ElTableColumn type="index" prop="nodeid" />
              <ElTableColumn
                prop="value"
                label="值"
                v-slots={{
                  default: ({ row }: any) =>
                    permissionEditingRow.value &&
                    permissionEditingRow.value.nodeid === row.nodeid ? (
                      <ElInput v-model={permissionEditingRow.value.value} size="small" />
                    ) : (
                      <span>{row.value}</span>
                    )
                }}
              />
              <ElTableColumn
                prop="label"
                label="名称"
                v-slots={{
                  default: ({ row }: any) =>
                    permissionEditingRow.value &&
                    permissionEditingRow.value.nodeid === row.nodeid ? (
                      <ElInput v-model={permissionEditingRow.value.label} size="small" />
                    ) : (
                      <ElTag class="mr-1" key={row.value}>
                        {row.label}
                      </ElTag>
                    )
                }}
              />
              <ElTableColumn
                label="操作"
                width="180"
                v-slots={{
                  default: ({ row }: any) =>
                    permissionEditingRow.value &&
                    permissionEditingRow.value.nodeid === row.nodeid ? (
                      <ElButton size="small" type="primary" onClick={handleSave}>
                        确定
                      </ElButton>
                    ) : (
                      <>
                        <ElButton size="small" type="primary" onClick={() => handleEdit(row)}>
                          编辑
                        </ElButton>
                        {/* <ElPopconfirm
                          title="Are you sure to delete this?"
                          onConfirm={() => handleClose(row)}
                        > */}
                        <ElPopconfirm title="确定要删除吗?" onConfirm={() => handleClose(row)}>
                          {{
                            reference: () => (
                              <ElButton size="small" type="danger">
                                删除
                              </ElButton>
                            )
                          }}
                        </ElPopconfirm>
                      </>
                    )
                }}
              />
            </ElTable>
          </>
        )
      }
    }
  },
  {
    field: 'meta.hidden',
    label: t('menu.hidden'),
    component: 'Switch'
  },
  {
    field: 'meta.alwaysShow',
    label: t('menu.alwaysShow'),
    component: 'Switch',
    value: false
  },
  {
    field: 'meta.activeMenu',
    label: t('menu.activeMenu'),
    component: 'Switch'
  },
  {
    field: 'meta.noCache',
    label: t('menu.noCache'),
    component: 'Switch'
  },
  {
    field: 'meta.breadcrumb',
    label: t('menu.breadcrumb'),
    component: 'Switch'
  },
  {
    field: 'meta.affix',
    label: t('menu.affix'),
    component: 'Switch'
  },
  {
    field: 'meta.noTagsView',
    label: t('menu.noTagsView'),
    component: 'Switch'
  },
  {
    field: 'meta.canTo',
    label: t('menu.canTo'),
    component: 'Switch'
  }
])

const rules = reactive({
  component: [required()],
  path: [required()],
  'meta.title': [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose, setSchema } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    console.log('🚀 ~ xzz: submit -> formData', formData)
    return formData
  }
}

const cacheComponent = ref('')

watch(
  () => props.currentRow,
  async (value) => {
    if (!value) return
    const currentRow = cloneDeep(value)
    await menuStore.setCurMenuId(currentRow.id)
    cacheComponent.value = currentRow.type === 1 ? currentRow.component : ''
    if (currentRow.parentId === 0) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    }
    if (currentRow.type === 1) {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: false
        }
      ])
    } else {
      setSchema([
        {
          field: 'component',
          path: 'componentProps.disabled',
          value: true
        }
      ])
    }
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

const confirm = async (data: any) => {
  // 将 id 替换成 nodeid   避免数据库自增id冲突
  // const newData = { ...data, nodeid: data.id }
  // delete newData.id
  const formData = await getFormData()
  setValues({
    permissionList: [...(formData?.permissionList || []), data]
  })
}
</script>

<template>
  <Form :rules="rules" @register="formRegister" :schema="formSchema" />
  <AddButtonPermission v-model="showDrawer" @confirm="confirm" />
</template>
