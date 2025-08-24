<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 保存文章设置弹窗
 * @version 1.0
 * @since 1.0
 */
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import type { ArticleSaveVO } from '@/service/typings.ts'

interface Props {
  modelValue: boolean
  initialData?: Partial<{
    title: string
    summary: string
    content: string
    categoryId: string
    tagIdList: string[]
    isStick: number
    categoryOptional: Array<{ label: string; value: string }>
    tagOptional: Array<{ label: string; value: string }>
    status: 'DRAFT' | 'IS_PUBLISHED'
  }>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void

  (e: 'confirm', data: ArticleSaveVO): void
}

const props = withDefaults(defineProps<Props>(), {
  initialData: () => ({}),
})

const emit = defineEmits<Emits>()

const formRef = ref()
const loading = ref(false)

// 是否置顶的开关状态
const isStickEnabled = ref(false)

const form = ref({
  title: '',
  summary: '',
  content: '',
  categoryId: '',
  tagIdList: [] as string[],
  isStick: 0,
  status: 'DRAFT' as 'DRAFT' | 'IS_PUBLISHED',
})

// 表单验证规则
const formRules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度应在1-100字符之间', trigger: 'blur' },
  ],
  status: [{ required: true, message: '请选择文章状态', trigger: 'change' }],
}

// 确认保存
const handleConfirm = () => {
  formRef.value
    ?.validate()
    .then(() => {
      loading.value = true
      setTimeout(() => {
        // 将开关状态同步到表单数据
        const submitData = {
          ...form.value,
          isStick: isStickEnabled.value ? 1 : 0,
        }
        emit('confirm', submitData)
        emit('update:modelValue', false)
        loading.value = false
      }, 500)
    })
    .catch(() => {
      message.warn('请检查信息是否填写合规！')
    })
}

// 取消处理
const handleCancel = () => {
  emit('update:modelValue', false)
  formRef.value?.resetFields()
}

// 监听初始数据变化
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        title: newData.title || '',
        categoryId: newData.categoryId || '',
        tagIdList: newData.tagIdList || [],
        status: newData.status || 'DRAFT',
        summary: newData.summary || '',
        content: newData.content || '',
        isStick: newData.isStick || 0,
      }
      // 同步置顶开关状态
      isStickEnabled.value = Boolean(newData.isStick)
    }
  },
  { immediate: true },
)

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (visible) => {
    if (visible && props.initialData) {
      form.value = {
        title: props.initialData.title || '',
        categoryId: props.initialData.categoryId || '',
        tagIdList: props.initialData.tagIdList || [],
        status: props.initialData.status || 'DRAFT',
        summary: props.initialData.summary || '',
        content: props.initialData.content || '',
        isStick: props.initialData.isStick || 0,
      }
      // 同步置顶开关状态
      isStickEnabled.value = Boolean(props.initialData.isStick)
    }
  },
)
</script>

<template>
  <AModal
    :open="modelValue"
    title="📝 保存文章设置"
    width="600px"
    :confirm-loading="loading"
    ok-text="保存文章"
    cancel-text="取消"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <AForm :model="form" :rules="formRules" ref="formRef" layout="vertical">
      <AFormItem label="文章标题" name="title">
        <AInput v-model:value="form.title" placeholder="请输入文章标题" :maxlength="100" show-count />
      </AFormItem>

      <AFormItem label="文章摘要" name="summary">
        <ATextarea
          v-model:value="form.summary"
          placeholder="请输入文章摘要（可选）"
          :maxlength="200"
          :rows="3"
          show-count
        />
      </AFormItem>

      <AFormItem label="分类" name="categoryId">
        <ASelect
          v-model:value="form.categoryId"
          placeholder="选择分类"
          style="width: 100%"
          :options="initialData?.categoryOptional || []"
        >
        </ASelect>
      </AFormItem>

      <AFormItem label="标签" name="tagIdList">
        <ASelect
          v-model:value="form.tagIdList"
          mode="multiple"
          placeholder="选择标签（最多5个）"
          style="width: 100%"
          :max-tag-count="5"
          :options="initialData?.tagOptional || []"
        >
        </ASelect>
      </AFormItem>

      <AFormItem label="发布状态" name="status">
        <ARadioGroup v-model:value="form.status">
          <ARadioButton value="DRAFT">
            <span style="display: flex; align-items: center; gap: 4px">📝 草稿</span>
          </ARadioButton>
          <ARadioButton value="IS_PUBLISHED">
            <span style="display: flex; align-items: center; gap: 4px">🚀 发布</span>
          </ARadioButton>
        </ARadioGroup>
      </AFormItem>

      <AFormItem label="文章设置" name="settings">
        <div class="article-settings">
          <div class="setting-item">
            <ASwitch v-model:checked="isStickEnabled" size="small" />
            <span class="setting-label">📌 置顶文章</span>
          </div>
        </div>
      </AFormItem>

      <!-- 提示信息 -->
      <AAlert
        v-if="form.status === 'IS_PUBLISHED'"
        message="发布后文章将对所有用户可见"
        type="info"
        show-icon
        style="margin-top: 16px"
      />
    </AForm>
  </AModal>
</template>

<style scoped lang="less">
// 保持与CommonModal一致的样式
:deep(.ant-modal-body) {
  padding: 24px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
  color: #374151;

  > label {
    font-size: 14px;
    height: auto;

    &::before {
      display: none;
    }
  }
}

:deep(.ant-form-item) {
  margin-bottom: 24px;
}

:deep(.ant-input),
:deep(.ant-select-selector) {
  border-radius: 8px;
  border-color: #d1d5db;

  &:hover {
    border-color: #3b82f6;
  }

  &:focus,
  &.ant-select-focused .ant-select-selector {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
}

:deep(.ant-radio-group) {
  width: 100%;

  .ant-radio-button-wrapper {
    flex: 1;
    text-align: center;
    border-radius: 8px;

    &:first-child {
      border-radius: 8px 0 0 8px;
    }

    &:last-child {
      border-radius: 0 8px 8px 0;
    }

    &.ant-radio-button-wrapper-checked {
      background: #3b82f6;
      border-color: #3b82f6;
      color: white;

      &:hover {
        background: #2563eb;
        border-color: #2563eb;
      }
    }
  }
}

:deep(.ant-select-selection-overflow) {
  flex-wrap: wrap;
  max-height: 80px;
  overflow-y: auto;
}

:deep(.ant-tag) {
  margin: 2px;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.article-settings {
  .setting-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 0;

    .setting-label {
      font-size: 14px;
      color: #374151;
      user-select: none;
    }
  }
}
</style>
