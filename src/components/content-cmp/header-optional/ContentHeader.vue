<script setup lang="ts">
/**
 * 2025/6/8 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 内容头部操作栏组件
 * @version 1.0
 * @since 1.0
 */
import { ref } from 'vue'
import CommonModal from '@/components/modal-cmp/CommonModal.vue'
import { ModalType } from '@/components/modal-cmp/common-modal'
import { message } from 'ant-design-vue'

// 按钮配置接口
interface ButtonConfig {
  key: string
  label: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  icon?: unknown
  disabled?: boolean
  danger?: boolean
  onClick: () => void
}

// 筛选器配置接口
interface FilterConfig {
  key: string
  placeholder: string
  options: Array<{ label: string; value: string }>
  value?: string
  width?: string
}

// 搜索配置接口
interface SearchConfig {
  placeholder: string
  width?: string
  onSearch: (value: string) => void
}

// 组件属性
interface Props {
  // 左侧按钮配置
  leftButtons?: ButtonConfig[]
  // 筛选器配置
  filters?: FilterConfig[]
  // 搜索配置
  search?: SearchConfig
  // 右侧按钮配置
  rightButtons?: ButtonConfig[]
  // 选中的行数量（用于批量操作按钮的禁用状态）
  selectedCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  leftButtons: () => [],
  filters: () => [],
  rightButtons: () => [],
  selectedCount: 0,
})

// 事件定义
const emit = defineEmits<{
  filterChange: [key: string, value: string]
  searchChange: [value: string]
  batchDeleteConfirm: []
}>()

// 筛选器值
const filterValues = ref<Record<string, string>>({})

// 搜索值
const searchValue = ref<string>('')

// 批量删除弹窗 ref
const batchDeleteModalRef = ref<InstanceType<typeof CommonModal>>()

// 当前触发删除的按钮配置
const currentDeleteButton = ref<ButtonConfig | null>(null)

// 处理筛选器变化
const handleFilterChange = (key: string, value: string) => {
  filterValues.value[key] = value
  emit('filterChange', key, value)
}

// 处理搜索
const handleSearch = (value: string) => {
  searchValue.value = value
  emit('searchChange', value)
  if (props.search?.onSearch) {
    props.search.onSearch(value)
  }
}

// 计算按钮是否禁用（用于需要选中行的批量操作）
const isButtonDisabled = (button: ButtonConfig) => {
  if (button.disabled !== undefined) {
    return button.disabled
  }
  // 如果按钮key包含'batch'，则需要选中行才能使用
  return button.key.includes('batch') && props.selectedCount === 0
}

// 处理按钮点击
const handleButtonClick = (button: ButtonConfig) => {
  // 如果是批量删除按钮，先显示确认弹窗
  if (button.key.includes('batch') && button.key.includes('delete')) {
    if (props.selectedCount === 0) {
      message.warning('请选择要删除的项目')
      return
    }
    currentDeleteButton.value = button
    batchDeleteModalRef.value?.showModal()
  } else {
    // 其他按钮直接执行原来的点击事件
    button.onClick()
  }
}

// 批量删除确认处理
const handleBatchDeleteConfirm = () => {
  // 触发删除确认事件，让父组件处理具体的删除逻辑
  emit('batchDeleteConfirm')
  // 关闭弹窗
  batchDeleteModalRef.value?.hiddenModal()
}
</script>

<template>
  <div class="content-header">
    <div class="left-actions">
      <!-- 左侧按钮 -->
      <a-button
        v-for="button in leftButtons"
        :key="button.key"
        :type="button.type || 'default'"
        :disabled="isButtonDisabled(button)"
        :danger="button.danger"
        class="action-btn"
        @click="handleButtonClick(button)"
      >
        <template v-if="button.icon" #icon>
          <component :is="button.icon" />
        </template>
        {{ button.label }}
      </a-button>

      <!-- 筛选器 -->
      <a-select
        v-for="filter in filters"
        :key="filter.key"
        v-model:value="filterValues[filter.key]"
        :placeholder="filter.placeholder"
        :style="{ width: filter.width || '120px' }"
        class="filter-select"
        @change="(value: string) => handleFilterChange(filter.key, value)"
      >
        <a-select-option v-for="option in filter.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </a-select>
    </div>

    <div class="right-actions">
      <!-- 搜索框 -->
      <a-input-search
        v-if="search"
        v-model:value="searchValue"
        :placeholder="search.placeholder"
        :style="{ width: search.width || '300px' }"
        class="search-input"
        @search="handleSearch"
      />

      <!-- 右侧按钮 -->
      <a-button
        v-for="button in rightButtons"
        :key="button.key"
        :type="button.type || 'default'"
        :disabled="isButtonDisabled(button)"
        :danger="button.danger"
        class="action-btn"
        @click="handleButtonClick(button)"
      >
        <template v-if="button.icon" #icon>
          <component :is="button.icon" />
        </template>
        {{ button.label }}
      </a-button>
    </div>

    <!-- 批量删除确认弹窗 -->
    <CommonModal
      ref="batchDeleteModalRef"
      :type="ModalType.NORMAL_TEXT"
      title="确认删除"
      :content="`您确定要删除选中的 ${selectedCount} 个项目吗？删除后无法恢复。`"
      confirm-text="确认删除"
      cancel-text="取消"
      @confirm="handleBatchDeleteConfirm"
    />
  </div>
</template>

<style scoped lang="less">
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  flex-shrink: 0;

  .left-actions,
  .right-actions {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .action-btn {
    border-radius: 6px;
    display: flex;
    align-items: center;

    :deep(.anticon) {
      font-size: 14px;
      vertical-align: middle;
      margin-right: 6px;
    }

    &[data-type='primary'] {
      background-color: #1677ff;
    }

    &[data-danger='true'] {
      background-color: #ff4d4f;
      border-color: #ff4d4f;

      &:hover {
        background-color: #ff7875;
        border-color: #ff7875;
      }
    }
  }

  .filter-select {
    border-radius: 6px;
  }

  .search-input {
    border-radius: 6px;

    :deep(.ant-input) {
      border-radius: 6px 0 0 6px;
    }

    :deep(.ant-input-search-button) {
      border-radius: 0 6px 6px 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .anticon {
        margin-right: 0;
      }
    }
  }
}
</style>
