<script setup lang="ts">
/**
 * 2025/5/7 11:21
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 通用弹窗组件
 * @version 1.0
 * @since 1.0
 */
import { defineProps, type PropType, reactive, ref, defineEmits } from 'vue'
import {
  FieldType,
  type FormFieldConfig,
  type ModalPageConfig,
  ModalType,
} from '@components/modal-cmp/common-modal.d.ts'
import EmailCodeButton from '@components/btn-cmp/EmailCodeButton.vue'

const emit = defineEmits(['confirm'])

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  type: {
    type: Number,
    required: true,
    default: ModalType.NORMAL_TEXT,
  },
  content: {
    type: String,
    required: false,
    default: '',
  },
  formItemsConfig: {
    type: Array<FormFieldConfig>,
    required: false,
  },
  formData: {
    type: Object as PropType<{ key: string; value: string }>,
    required: false,
  },
  pageConfig: {
    type: Object as PropType<ModalPageConfig>,
    required: false,
  },
  cancelText: {
    type: String,
    required: false,
    default: '取消',
  },
  confirmText: {
    type: String,
    required: false,
    default: '确定',
  },
})

// 是否显示
const open = ref<boolean>(false)

// 加载状态
const loading = ref<boolean>(props.loading)

// 表单数据
const formData = reactive<{ key: string; value: string }>(props.formData)

/**
 * 确认函数
 */
const confirmHandler = () => {
  emit('confirm', formData)
  hiddenModal()
  clearFormData()
}

/**
 * 取消函数
 */
const cancelHandler = () => {
  hiddenModal()
  clearFormData()
}

// 清空表单
const clearFormData = () => {
  for (const key in formData) {
    formData[key] = ''
  }
}

/**
 * 展示弹窗
 */
const showModal = () => {
  open.value = true
}

/**
 * 隐藏弹窗
 */
const hiddenModal = () => {
  open.value = false
}

defineExpose({
  showModal,
  hiddenModal,
})
</script>

<template>
  <AModal
    v-model:open="open"
    :title="props.title"
    :confirm-loading="loading"
    @ok="confirmHandler"
    :ok-text="props.confirmText"
    :cancel-text="props.cancelText"
    @cancel="cancelHandler"
  >
    <!-- 普通文本类型 -->
    <template v-if="props.type === ModalType.NORMAL_TEXT">
      <div>{{ props?.content ?? '' }}</div>
    </template>
    <!-- 表单类型 -->
    <template v-else-if="props.type === ModalType.FORM">
      <AForm v-model:value="formData">
        <template v-for="(field, index) in props.formItemsConfig" :key="index">
          <!-- 普通输入框 -->
          <AFormItem :name="field.name" :rules="field.rules" v-if="field.type === FieldType.NORMAL_INPUT">
            <AInput v-model:value="formData[field.name]" :placeholder="field.placeholder">
              {{ formData[field.name] }}
              <template #prefix>
                <component :is="field?.icon" />
              </template>
            </AInput>
          </AFormItem>
          <!-- 密码输入框 -->
          <AFormItem :name="field.name" :rules="field.rules" v-if="field.type === FieldType.INPUT_PASSWORD">
            <AInputPassword v-model:value="formData[field.name]" :placeholder="field.placeholder">
              <template #prefix>
                <component :is="field?.icon" />
              </template>
            </AInputPassword>
          </AFormItem>
          <!-- 邮箱验证码样式 -->
          <AFormItem :name="field.name" :rules="field.rules" v-if="field.type === FieldType.EMAIL_CODE">
            <div class="code-row">
              <AInput v-model:value="formData[field.name]" :placeholder="field.placeholder">
                <template #prefix>
                  <component :is="field?.icon" />
                </template>
              </AInput>
              <EmailCodeButton :email="formData[field.name]" />
            </div>
          </AFormItem>
        </template>
      </AForm>
    </template>
  </AModal>
</template>

<style scoped lang="less">
.code-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .ant-input {
    flex: 1;
  }
}
</style>
