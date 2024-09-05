<script setup lang="tsx">
import { ContentWrap } from '@/components/ContentWrap'
import { useI18n } from '@/hooks/web/useI18n'
import { Table } from '@/components/Table'
import { ref, unref, nextTick, watch, reactive } from 'vue'
import { ElTree, ElInput, ElDivider, ElMessage } from 'element-plus'
import { deleteUserByIdApi } from '@/api/department'
import type { DepartmentItem, DepartmentUserItem } from '@/api/department/types'
import { useTable } from '@/hooks/web/useTable'
import { Search } from '@/components/Search'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { getAllRoleApi } from '@/api/role'
import { CrudSchema, useCrudSchemas } from '@/hooks/web/useCrudSchemas'
import { BaseButton } from '@/components/Button'

import { useDepartmentStore } from '@/store/modules/department'
import {
  addUserApi,
  delUserApi,
  editUserApi,
  getUserByDepartmentIdApi,
  getUserByIdApi2,
  resetPasswordApi
} from '@/api/user'

const departmentStore = useDepartmentStore()

const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    // 根据 部门id 进行分页查询
    const res = await getUserByDepartmentIdApi({
      id: unref(currentNodeKey),
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return {
      list: res.data.list || [],
      total: res.data.total || 0
    }
  },
  fetchDelApi: async () => {
    const res = await deleteUserByIdApi(unref(ids))
    return !!res
  },
  immediate: false
})
const { total, loading, dataList, pageSize, currentPage } = tableState
const { getList, getElTableExpose, delList } = tableMethods
const treeSelectRef = ref<typeof ElTree>()

const getResetTime = ref(99)
const resetPwding = ref(false)
const newPwd = ref('')
const resetPwd = async () => {
  resetPwding.value = true
  const timer = setInterval(() => {
    getResetTime.value--
    if (getResetTime.value <= 0) {
      clearInterval(timer)
      getResetTime.value = 60
      resetPwding.value = false
    }
  }, 1000)
  //  发起后端请求
  try {
    if (currentRow.value) {
      const { id, phone } = currentRow.value
      const res = await resetPasswordApi({ id, phone, newPwd: newPwd.value.trim() || '123456' })
      const idx = res?.data?.id
      if (idx) {
        return ElMessage.success('重置成功!')
      }
    }
    return ElMessage.error('重置失败!')
  } catch (error) {
    console.log('🚀 ~ xzz: resetPwd -> error', error)
  }
}
const crudSchemas = reactive<CrudSchema[]>([
  {
    field: 'selection',
    search: {
      hidden: true
    },
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'selection'
    }
  },
  {
    field: 'index',
    label: t('userDemo.index'),
    form: {
      hidden: true
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      type: 'index'
    }
  },
  {
    field: 'username',
    label: t('userDemo.username')
  },
  {
    field: 'phone',
    label: t('login.phone')
  },
  {
    field: 'departmentId',
    label: t('userDemo.department'),
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    form: {
      component: 'TreeSelect',
      componentProps: {
        // value: 'department.id',
        nodeKey: 'id',
        props: {
          label: 'name'
        }
      },
      optionApi: async () => {
        //  这里每次打开编辑都会触发, 但是下面角色却不会????
        // const res = await getAllDepartmentListApi()
        // return res.data.list
        return await departmentStore.getAllDepartmentList
      }
    },
    table: {
      hidden: true
    }
  },

  {
    field: 'roles',
    label: t('userDemo.role'),
    search: {
      hidden: true
    },
    table: {
      hidden: true,
      slots: {
        default: (data: any) => {
          return <>{data?.row?.roles.map((v) => v.name).join(',')}</>
        }
      }
    },
    detail: {
      //  不生效
      slots: {
        default: (data: any) => {
          return <>{data?.roleArr.map((v) => v.name).join(',')}</>
        }
      }
    },
    form: {
      component: 'Select',
      // value: 'roles.id',
      // value: (data: any) => {
      //   console.log('🚀 ~ xzz: data', data)
      //   return data?.roles
      // },
      componentProps: {
        // 'value-key': 'name',
        multiple: true,
        collapseTags: true,
        maxCollapseTags: 1
      },
      optionApi: async () => {
        const res = await getAllRoleApi()
        return res.data?.list?.map((v) => ({
          label: v.name,
          value: v.id
        }))
      }
    }
  },
  {
    field: 'resetPwd',
    form: {
      formItemProps: {
        slots: {
          default: (data) => {
            if (!data?.id) return null
            return (
              <div class="w-[100%] flex mt-60">
                <ElInput v-model={newPwd.value} placeholder="请输入重置密码,默认为123456" />
                <BaseButton
                  type="primary"
                  disabled={unref(resetPwding)}
                  class="ml-10px"
                  onClick={resetPwd}
                >
                  重置密码
                  {unref(resetPwding) ? `(${unref(getResetTime)})` : ''}
                </BaseButton>
              </div>
            )
          }
        }
      }
    },
    search: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    table: {
      hidden: true
    }
  },
  {
    field: 'department',
    label: t('userDemo.department'),
    // form: {
    //   hidden: true
    // },
    form: {
      hidden: true,
      component: 'TreeSelect',
      componentProps: {
        ref: 'treeSelectRef',
        // value: 'department.id',
        // data: 'department',
        nodeKey: 'id',
        'value-key': 'id',
        'value-format': 'object',
        on: {
          change: (_val) => {
            unref(treeSelectRef)?.setCurrentKey([_val])
          }
        },
        props: {
          label: 'name',
          children: 'children'

          // value: 'id'
        }
        // highlightCurrent: true,
        // expandOnClickNode: true,
        // checkStrictly: true,
        // checkOnClickNode: true,
        // clearable: true,
        // currentNodeKey: 'department.id'
      },
      optionApi: async () => {
        return await departmentStore.getAllDepartmentList
      }
    },
    search: {
      hidden: true
    },
    detail: {
      slots: {
        default: (data: any) => {
          return <>{data?.department?.name}</>
        }
      }
    },
    table: {
      hidden: true,
      slots: {
        default: (data: any) => {
          return <>{data?.row?.department?.name}</>
        }
      }
    }
  },
  {
    field: 'createdAt',
    label: t('userDemo.createTime'),
    // form: {
    //   component: 'Input'
    // },
    search: {
      hidden: true
    },
    form: {
      hidden: true
    }
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    form: {
      hidden: true
    },
    detail: {
      hidden: true
    },
    search: {
      hidden: true
    },
    table: {
      width: 240,
      slots: {
        default: (data: any) => {
          const row = data.row as DepartmentUserItem

          return (
            <>
              <BaseButton type="primary" onClick={() => action(row, 'edit')}>
                {t('exampleDemo.edit')}
              </BaseButton>
              <BaseButton type="success" onClick={() => action(row, 'detail')}>
                {t('exampleDemo.detail')}
              </BaseButton>
              <BaseButton type="danger" onClick={() => delAction(row.id)}>
                {t('exampleDemo.del')}
              </BaseButton>
            </>
          )
        }
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const searchParams = ref({})
const setSearchParams = (params: any) => {
  currentPage.value = 1
  searchParams.value = params
  getList()
}

const treeEl = ref<typeof ElTree>()

const currentNodeKey = ref<number>(0)
const departmentList = ref<DepartmentItem[]>([])
const fetchDepartment = async () => {
  // const res = await getDepartmentApi()
  const res = await departmentStore.setAllDepartmentList()
  const list = res.list || []
  departmentList.value = list
  // currentNodeKey.value = (list[0] && list[0]?.children && list[0].children[0].id) || 0
  currentNodeKey.value = (list[0] && list[0].id) || 0
  await nextTick()
  unref(treeEl)?.setCurrentKey(currentNodeKey.value)
}

fetchDepartment()

const currentDepartment = ref('')
watch(
  () => currentDepartment.value,
  (val) => {
    unref(treeEl)!.filter(val)
  }
)

const currentChange = (data: DepartmentItem) => {
  // if (data.children) return
  currentNodeKey.value = data.id
  currentPage.value = 1
  getList()
}

const filterNode = (value: string, data: DepartmentItem) => {
  if (!value) return true
  return data.name.includes(value)
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref<DepartmentUserItem>()
const actionType = ref('')

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const delLoading = ref(false)
const ids = ref<string[]>([])

const delData = async (row?: DepartmentUserItem) => {
  const elTableExpose = await getElTableExpose()
  ids.value = row
    ? [row.id]
    : elTableExpose?.getSelectionRows().map((v: DepartmentUserItem) => v.id) || []
  delLoading.value = true

  await delList(unref(ids).length).finally(() => {
    delLoading.value = false
  })
}
// const getUserInfo = async (id) => {

// }

// const detailLoading = ref(false)
// const editLoading = ref(false)
const action = async (row: DepartmentUserItem, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  // type === 'edit' ? (editLoading.value = true) : (detailLoading.value = true)
  try {
    //   详细数据应当通过单个ip去查询处理
    const res = await getUserByIdApi2({ id: row.id })
    const userDetail = res?.data
    currentRow.value = {
      ...row,
      departmentId: userDetail?.department?.id, // id 用于下拉回显
      roles: userDetail.roles.map((v) => v.id), // id数组用于下拉回显
      roleArr: JSON.parse(JSON.stringify(userDetail.roles)), // 用于详情页展示
      department: unref(treeEl)?.getCurrentNode() || {} // id 用于表单下拉数据
    } //getCurrentNode返回当前被选中节点的数据
    dialogVisible.value = true
  } catch (error) {
    console.log('🚀 ~ xzz: action -> error', error)
  } finally {
    // type === 'edit' ? (editLoading.value = false) : (detailLoading.value = false)
  }
  // unref(treeSelectRef)?.setCheckedKeys([row.department.id], true) //  自动选中相应部门
  // unref(treeSelectRef)?.setCurrentKey(row.department.id) //  自动选中相应部
}

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit()
  console.log('🚀 ~ xzz: save -> formData', JSON.parse(JSON.stringify(formData)))
  // return
  const isEdit = actionType.value === 'edit' //  判断时修改还是新增
  if (formData) {
    try {
      // formData.departmentId = formData?.department?.id || null
      delete formData?.department
      delete formData?.roleArr
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = isEdit ? await editUserApi(formData) : await addUserApi(formData)
      const id = res?.data?.id
      if (id) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
        currentPage.value = 1
        getList()
      }
    } catch (error) {
      console.log('🚀 ~ xzz: save -> error', error)
    } finally {
      saveLoading.value = false
    }
  }
}

const delAction = async (idx: number) => {
  try {
    const res = await delUserApi(idx)
    const id = res?.data?.id
    if (id) {
      dialogVisible.value = false
      ElMessage.success('删除成功!')
      getList()
    }
  } catch (error) {
    console.log('xzz: delAction -> error', error)
    ElMessage.error('删除失败!')
  }
}
</script>

<template>
  <div class="flex w-100% h-100%">
    <ContentWrap class="w-250px">
      <div class="flex justify-center items-center">
        <div class="flex-1">{{ t('userDemo.departmentList') }}</div>
        <ElInput
          v-model="currentDepartment"
          class="flex-[2]"
          :placeholder="t('userDemo.searchDepartment')"
          clearable
        />
      </div>
      <ElDivider />
      <ElTree
        ref="treeEl"
        :data="departmentList"
        default-expand-all
        :expand-on-click-node="false"
        node-key="id"
        :current-node-key="currentNodeKey"
        :props="{
          label: 'name'
        }"
        :filter-node-method="filterNode"
        @current-change="currentChange"
      >
        <template #default="{ data }">
          <div :title="data.name" class="whitespace-nowrap overflow-ellipsis overflow-hidden">
            {{ data.name }}
          </div>
        </template>
      </ElTree>
    </ContentWrap>
    <ContentWrap class="flex-[3] ml-20px">
      <Search
        :schema="allSchemas.searchSchema"
        @reset="setSearchParams"
        @search="setSearchParams"
      />

      <div class="mb-10px">
        <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
        <BaseButton :loading="delLoading" type="danger" @click="delData()">
          {{ t('exampleDemo.del') }}
        </BaseButton>
      </div>
      <Table
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :columns="allSchemas.tableColumns"
        :data="dataList"
        :loading="loading"
        @register="tableRegister"
        :pagination="{
          total
        }"
      />
    </ContentWrap>

    <Dialog v-model="dialogVisible" :title="dialogTitle">
      <Write
        v-if="actionType !== 'detail'"
        ref="writeRef"
        :form-schema="allSchemas.formSchema"
        :current-row="currentRow"
      />

      <Detail
        v-if="actionType === 'detail'"
        :detail-schema="allSchemas.detailSchema"
        :current-row="currentRow"
      />

      <template #footer>
        <BaseButton
          v-if="actionType !== 'detail'"
          type="primary"
          :loading="saveLoading"
          @click="save"
        >
          {{ t('exampleDemo.save') }}
        </BaseButton>
        <BaseButton @click="dialogVisible = false">{{ t('dialogDemo.close') }}</BaseButton>
      </template>
    </Dialog>
  </div>
</template>
