<script setup lang="tsx">
import { Form, FormSchema } from '@/components/Form'
import { useForm } from '@/hooks/web/useForm'
import { PropType, reactive, watch } from 'vue'
import { useValidator } from '@/hooks/web/useValidator'
import { ElTag } from 'element-plus'
import { cloneDeep } from 'lodash-es'

const { required } = useValidator()

const props = defineProps({
  currentRow: {
    type: Object as PropType<any>,
    default: () => null
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'name',
    label: '订单编号',
    formItemProps: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type="success">{data.name}</ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'username',
    label: '客户名称',
    formItemProps: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type="success">{data.username}</ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'phone',
    label: '客户手机',
    formItemProps: {
      slots: {
        default: (data: any) => {
          return (
            <>
              <ElTag type="success">{data.phone}</ElTag>
            </>
          )
        }
      }
    }
  },
  {
    field: 'total_money',
    label: '订单总额',
    component: 'Input'
  }
])

const rules = reactive({
  component: [required()],
  path: [required()]
})

const { formRegister, formMethods } = useForm()
const { setValues, getFormData, getElFormExpose } = formMethods

const submit = async () => {
  return
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

watch(
  () => props.currentRow,
  async (value) => {
    if (!value) return
    const currentRow = cloneDeep(value)
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
