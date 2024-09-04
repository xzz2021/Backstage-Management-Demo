<script setup lang="tsx">
import { onMounted, reactive, ref, unref } from 'vue'
import { addRoleApi, delRoleApi2, editRoleApi, getRoleListApi, getRoleListApi2 } from '@/api/role'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElMessage, ElTag } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { formatToTree } from '@/utils/tree'
import { useMenuStore } from '@/store/modules/menu'

const menuStore = useMenuStore()

const menuList = ref<any[]>([])
onMounted(async () => {
  const res = await menuStore.setMenuList()
  menuList.value = res?.list
})
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const res = await getRoleListApi2() //  获取的是 for循环模拟处理的数据  没有permission 也没有permissionList
    // console.log('🚀 ~ xzz: res', res?.data?.list)
    //  此处list需要转换成带children的嵌套结构
    // return {
    //   list: res.data.list || [],
    //   total: res.data.total
    // }
    let newList = res?.data?.list
    if (newList) {
      newList.map((item) => {
        item.menu = formatToTree(item.menu)
      })
      console.log('🚀 ~ xzz: newList', newList)
    } else {
      newList = {
        list: [],
        total: 0
      }
    }
    return {
      list: newList || [],
      total: newList.total
    }
  }
})

const { dataList, loading, total } = tableState
const { getList } = tableMethods

const tableColumns = reactive<TableColumn[]>([
  {
    field: 'index',
    label: t('userDemo.index'),
    type: 'index'
  },
  {
    field: 'name',
    label: t('role.roleName')
  },
  {
    field: 'status',
    label: t('menu.status'),
    slots: {
      default: (data: any) => {
        return (
          <>
            <ElTag type={data.row.status ? 'success' : 'danger'}>
              {data.row.status ? t('userDemo.enable') : t('userDemo.disable')}
            </ElTag>
          </>
        )
      }
    }
  },
  {
    field: 'createdAt',
    label: t('tableDemo.displayTime')
  },
  {
    field: 'remark',
    label: t('userDemo.remark')
  },
  {
    field: 'action',
    label: t('userDemo.action'),
    width: 240,
    slots: {
      default: (data: any) => {
        const row = data.row
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
])

const searchSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: t('role.roleName'),
    component: 'Input'
  }
])

const searchParams = ref({})
const setSearchParams = (data: any) => {
  searchParams.value = data
  getList()
}

const dialogVisible = ref(false)
const dialogTitle = ref('')

const currentRow = ref()
const actionType = ref('')

const writeRef = ref<ComponentRef<typeof Write>>()

const saveLoading = ref(false)

const action = (row: any, type: string) => {
  dialogTitle.value = t(type === 'edit' ? 'exampleDemo.edit' : 'exampleDemo.detail')
  actionType.value = type
  currentRow.value = row
  dialogVisible.value = true
}

const AddAction = () => {
  dialogTitle.value = t('exampleDemo.add')
  currentRow.value = undefined
  dialogVisible.value = true
  actionType.value = ''
}

const save = async () => {
  const write = unref(writeRef)
  const formData = await write?.submit() //  获取提交的数据
  const isEdit = actionType.value === 'edit' //  判断时修改还是新增
  // formData?.menu && (formData.menu = formData?.menu.filter((item) => item.id))
  console.log('🚀 ~ xzz: save -> formData', formData)
  // return
  if (formData) {
    try {
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = isEdit ? await editRoleApi(formData) : await addRoleApi(formData)
      console.log('🚀 ~ xzz: save -> res', res)
      const id = res?.data?.id
      if (id) {
        dialogVisible.value = false
        ElMessage.success('更新成功!')
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
    const res = await delRoleApi2(idx)
    ElMessage.success('删除成功!')
    const id = res?.data?.id
    if (id) {
      dialogVisible.value = false
      ElMessage.success('更新成功!')
      getList()
    }
  } catch (error) {
    console.log('xzz: delAction -> error', error)
    ElMessage.error('删除失败!')
  }
}
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div>
    <Table
      :columns="tableColumns"
      default-expand-all
      node-key="id"
      :data="dataList"
      :loading="loading"
      :pagination="{
        total
      }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write
      v-if="actionType !== 'detail'"
      ref="writeRef"
      :current-row="currentRow"
      :menuList="menuList"
    />
    <Detail v-else :current-row="currentRow" :menuList="menuList" />

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
</template>
