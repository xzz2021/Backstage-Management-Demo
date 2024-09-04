<script setup lang="ts">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { DepartmentItem } from '@/api/department/types'
import { useI18n } from '@/hooks/web/useI18n'
import { getDepartmentApi } from '@/api/department'
import { useDepartmentStore } from '@/store/modules/department'

const departmentStore = useDepartmentStore()
const { required } = useValidator()

const { t } = useI18n()

const props = defineProps({
  currentRow: {
    type: Object as PropType<Nullable<DepartmentItem>>,
    default: () => null
  }
})

const writeSchemas = reactive<FormSchema[]>([
  {
    field: 'parentId',
    label: t('userDemo.superiorDepartment'),
    component: 'TreeSelect',
    componentProps: {
      nodeKey: 'id',
      props: {
        label: 'name'
      },
      highlightCurrent: true,
      expandOnClickNode: false,
      checkStrictly: true,
      checkOnClickNode: true,
      clearable: true
    },
    optionApi: async () => {
      // const res = await getDepartmentApi()
      // return res.data.list
      return await departmentStore.getDepartmentList
    }
  },
  {
    field: 'name',
    label: t('userDemo.departmentName'),
    component: 'Input'
  },
  {
    field: 'status',
    label: t('userDemo.status'),
    component: 'Select',
    value: true,
    componentProps: {
      options: [
        {
          value: false,
          label: t('userDemo.disable')
        },
        {
          value: true,
          label: t('userDemo.enable')
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
  }
])

const rules = reactive({
  // id: [required()],
  name: [required()],
  status: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  const elForm = await getElFormExpose()
  const valid = await elForm?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    return formData
  }
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
  <Form :rules="rules" @register="formRegister" :schema="writeSchemas" />
</template>
