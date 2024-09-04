<script setup lang="ts">
import { FormSchema, Form } from '@/components/Form'
import { ElDrawer } from 'element-plus'
import { reactive } from 'vue'
import { useForm } from '@/hooks/web/useForm'
import { useValidator } from '@/hooks/web/useValidator'
import { addPermissionList } from '@/api/menu'
import { useMenuStore } from '@/store/modules/menu'

const menuStore = useMenuStore()

const modelValue = defineModel<boolean>()

const { required } = useValidator()

const props = defineProps({
  menuId: {
    type: Number,
    default: 0
  }
})

const formSchema = reactive<FormSchema[]>([
  {
    field: 'label',
    label: '名称',
    component: 'Input',
    colProps: {
      span: 24
    }
  },
  {
    field: 'value',
    label: '值',
    component: 'Input',
    colProps: {
      span: 24
    }
  }
])

const { formRegister, formMethods } = useForm()
const { getFormData, getElFormExpose } = formMethods

const emit = defineEmits(['confirm'])

const rules = reactive({
  label: [required()],
  value: [required()]
})

const confirm = async () => {
  const elFormExpose = await getElFormExpose()
  if (!elFormExpose) return
  const valid = await elFormExpose?.validate().catch((err) => {
    console.log(err)
  })
  if (valid) {
    const formData = await getFormData()
    formData.nodeid = Date.now().toString()
    try {
      console.log('🚀 ~ xzz: confirm -> props?.menuId', props?.menuId)
      menuStore?.getCurMenuId && (formData.menuId = menuStore?.getCurMenuId)
      const res = await addPermissionList(formData)
      const id = res?.data?.id
      if (id) {
        modelValue.value = false
        emit('confirm', formData)
      }
    } catch (error) {
      console.log('🚀 ~ xzz: confirm -> error', error)
    }
    // 清空表单
    // formMethods.resetForm()
  }
}
</script>

<template>
  <ElDrawer v-model="modelValue" title="新增按钮权限">
    <template #default>
      <Form :rules="rules" @register="formRegister" :schema="formSchema" />
    </template>
    <template #footer>
      <div>
        <BaseButton @click="() => (modelValue = false)">取消</BaseButton>
        <BaseButton type="primary" @click="confirm">确认</BaseButton>
      </div>
    </template>
  </ElDrawer>
</template>
