<script setup lang="tsx">
import { reactive, ref, unref } from 'vue'
import { addMenuApi, delMenuApi2, editMenuApi } from '@/api/menu'
import { useTable } from '@/hooks/web/useTable'
import { useI18n } from '@/hooks/web/useI18n'
import { Table, TableColumn } from '@/components/Table'
import { ElMessage } from 'element-plus'
import { Search } from '@/components/Search'
import { FormSchema } from '@/components/Form'
import { ContentWrap } from '@/components/ContentWrap'
import Write from './components/Write.vue'
import Detail from './components/Detail.vue'
import { Dialog } from '@/components/Dialog'
import { BaseButton } from '@/components/Button'
import { getOrderListApi } from '@/api/order'
const { t } = useI18n()

const { tableRegister, tableState, tableMethods } = useTable({
  fetchDataApi: async () => {
    const { pageSize, currentPage } = tableState
    // 根据 部门id 进行分页查询
    const res = await getOrderListApi({
      pageIndex: unref(currentPage),
      pageSize: unref(pageSize),
      ...unref(searchParams)
    })
    return res?.data || { list: [], total: 0 }
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
    field: 'create_date',
    label: '下单时间'
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
    field: 'phone',
    label: '客户手机',
    component: 'Input'
  },
  {
    field: 'name',
    label: '订单号',
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

// const AddAction = () => {
//   dialogTitle.value = t('exampleDemo.add')
//   currentRow.value = undefined
//   dialogVisible.value = true
//   actionType.value = ''
// }

const delAction = async (idx: number) => {
  return
  try {
    const res = await delMenuApi2(idx)
    console.log('🚀 ~ xzz: delAction -> res', res)
    ElMessage.success('删除成功!')
    const id = res?.data?.id
    if (id) {
      dialogVisible.value = false
      ElMessage.success('更新成功!')
      getList()
    }
  } catch (error) {
    console.log(' ~ xzz: delAction -> error', error)
    ElMessage.error('删除失败!')
  }
}

const save = async () => {
  return (dialogVisible.value = false)

  const write = unref(writeRef)
  const formData = await write?.submit()
  const isEdit = actionType.value === 'edit' //  判断是修改还是新增
  if (formData) {
    try {
      formData && delete formData?.children
      //  提交 新增 或者 修改
      saveLoading.value = true
      const res = isEdit ? await editMenuApi(formData) : await addMenuApi(formData)
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
</script>

<template>
  <ContentWrap>
    <Search :schema="searchSchema" @reset="setSearchParams" @search="setSearchParams" />
    <!-- <div class="mb-10px">
      <BaseButton type="primary" @click="AddAction">{{ t('exampleDemo.add') }}</BaseButton>
    </div> -->
    <Table
      :columns="tableColumns"
      :data="dataList"
      :loading="loading"
      :pagination="{ total }"
      @register="tableRegister"
    />
  </ContentWrap>

  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <Write v-if="actionType !== 'detail'" ref="writeRef" :current-row="currentRow" />
    <Detail v-if="actionType === 'detail'" :current-row="currentRow" />
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
