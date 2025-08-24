<script setup lang="ts">
/**
 * 2025/5/31 21:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章分类
 * @version 1.0
 * @since 1.0
 */
import { onMounted, reactive, ref, computed, nextTick } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import { errMsgExtract } from '@/global/string-format.ts'
import dayjs from 'dayjs'
import { ContentHeader, ContentTable } from '@/components/content-cmp'
import { ColorPicker } from '@/components/color-picker-cmp'
import type {
  ButtonConfig,
  SearchConfig,
  ColumnConfig,
  PaginationConfig,
  RowSelectionConfig,
} from '@/components/content-cmp'
import type { ApiResultObject, FileInfoVO } from '@/service/typings.ts'
import { message } from 'ant-design-vue'
import useCategoryStore from '@/store/article/category'

const categoryStore = useCategoryStore()
// 选择的行Keys
const selectedRowKeys = ref<(string | number)[]>([])
// 页面信息
const pageInfo = reactive({
  addition: {
    pageNum: ref(1),
    pageSize: ref(10),
  },
  total: ref(0),
  dataSource: reactive<FileInfoVO[]>([]),
  loading: ref<boolean>(false),
})

// 模态框相关状态
const modalVisible = ref(false)
const modalLoading = ref(false)
const formRef = ref()
const isEditMode = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  color: '#1890ff',
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入分类名称' },
    { min: 1, max: 20, message: '分类名称长度在1-20个字符之间' },
  ],
}

// 表格列配置
const tableColumns: ColumnConfig[] = [
  {
    title: '分类名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '分类颜色',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    title: '选项',
    dataIndex: 'action',
    key: 'action',
  },
]

/**
 * 初始化页面
 */
const pageInit = async (addition: { pageNum: number; pageSize: number }) => {
  pageInfo.loading = true
  categoryStore.getCategoryListAction({ ...addition }).then(
    (res) => {
      // 重置属性
      pageInfo.dataSource = res.data ?? []
      Object.assign(pageInfo.addition, res.addition ?? {})
      // 停止加载
      pageInfo.loading = false
    },
    (error) => {
      errMsgExtract(error)
      pageInfo.loading = false
    },
  )
}

/**
 * 页面挂载初始化
 */
onMounted(() => {
  pageInit(pageInfo.addition)
})

/**
 * 表格选择处理
 * @param selectedKeys 选中的行key数组
 */
const onSelectChange = (selectedKeys: (string | number)[]) => {
  selectedRowKeys.value = selectedKeys
}

// 头部配置
const headerConfig = computed(() => ({
  leftButtons: [
    {
      key: 'add',
      label: '新增分类',
      type: 'primary' as const,
      icon: PlusOutlined,
      onClick: handleSaveTag,
    },
    {
      key: 'batch-delete',
      type: 'primary' as const,
      danger: true,
      label: '批量删除',
    },
  ] as ButtonConfig[],
  search: {
    placeholder: '请输入分类名称搜索',
    width: '300px',
    onSearch: onSearch,
  } as SearchConfig,
  selectedCount: selectedRowKeys.value.length,
  content: `您确定要删除选中的 ${selectedRowKeys.value.length} 个分类吗？删除后无法恢复。`,
}))

// 表格配置
const tableConfig = computed(() => ({
  dataSource: pageInfo.dataSource,
  columns: tableColumns,
  rowKey: (record: FileInfoVO) => record.id as string,
  loading: pageInfo.loading,
  rowSelection: {
    selectedRowKeys: selectedRowKeys.value,
    onChange: onSelectChange,
  } as RowSelectionConfig,
  pagination: {
    current: pageInfo.addition.pageNum,
    pageSize: pageInfo.addition.pageSize,
    total: pageInfo.total,
    onChange: paginationHandler,
  } as PaginationConfig,
  scrollY: 420,
}))

const handleSaveTag = () => {
  // 重置表单数据
  isEditMode.value = false
  formData.id = ''
  formData.name = ''
  formData.color = '#1890ff'
  // 显示模态框
  modalVisible.value = true
  // 清除表单验证状态
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 编辑分类
const handleEditTag = (record: FileInfoVO & { color?: string }) => {
  isEditMode.value = true
  formData.id = record.id || ''
  formData.name = record.name || ''
  formData.color = record.color || '#1890ff'
  modalVisible.value = true
  // 清除表单验证状态
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

// 确认保存分类
const handleConfirmSave = async () => {
  try {
    await formRef.value?.validate()
    modalLoading.value = true

    if (isEditMode.value) {
      // 编辑模式
      await categoryStore.editCategoryAction({
        id: formData.id,
        name: formData.name,
        color: formData.color,
      })
      message.success('分类更新成功')
    } else {
      // 新增模式
      await categoryStore.saveCategoryAction({
        name: formData.name,
        color: formData.color,
      })
      message.success('分类添加成功')
    }

    modalVisible.value = false

    // 重新加载数据
    await pageInit(pageInfo.addition)
  } catch (error) {
    if (error && typeof error === 'object' && 'errorFields' in error) {
      message.warn('请检查表单信息')
    } else {
      errMsgExtract(error as ApiResultObject)
    }
  } finally {
    modalLoading.value = false
  }
}

// 取消保存
const handleCancelSave = () => {
  modalVisible.value = false
  isEditMode.value = false
  formData.id = ''
  formData.name = ''
  formData.color = '#1890ff'
}

// 批量删除确认处理
const handleBatchDeleteConfirm = async () => {
  pageInfo.loading = true
  try {
    await categoryStore.delCategoryAction((selectedRowKeys.value as string[]) ?? [])
    // 清空选中的行
    selectedRowKeys.value = []
    // 重新加载数据
    await pageInit(pageInfo.addition)
    message.success('删除成功')
  } catch (error) {
    errMsgExtract(error as ApiResultObject)
  } finally {
    pageInfo.loading = false
  }
}

const onSearch = (value: string) => {
  // 处理搜索逻辑
  console.log('搜索:', value)
}

/**
 * 分页点击处理
 * @param page 当前页码
 * @param pageSize 每页数据量
 */
const paginationHandler = (page: number, pageSize: number) => {
  pageInit({ pageNum: page, pageSize: pageSize })
}
</script>

<template>
  <div class="category-management">
    <!-- 头部操作栏 -->
    <ContentHeader
      :left-buttons="headerConfig.leftButtons"
      :search="headerConfig.search"
      :selected-count="headerConfig.selectedCount"
      :content="headerConfig.content"
      @batch-delete-confirm="handleBatchDeleteConfirm"
    />

    <!-- 表格内容 -->
    <ContentTable
      :data-source="tableConfig.dataSource"
      :columns="tableConfig.columns"
      :row-key="tableConfig.rowKey"
      :loading="tableConfig.loading"
      :row-selection="tableConfig.rowSelection"
      :pagination="tableConfig.pagination"
      :scroll-y="tableConfig.scrollY"
    >
      <!-- 分类颜色 -->
      <template #bodyCell-color="{ record }">
        <div class="color-display-cell">
          <div class="color-badge" :style="{ backgroundColor: record.color }"></div>
          <span class="color-text">{{ record.color }}</span>
        </div>
      </template>

      <!-- 创建时间 -->
      <template #bodyCell-createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <!-- 更新时间 -->
      <template #bodyCell-updateTime="{ record }">
        {{ dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>

      <!-- 操作列 -->
      <template #bodyCell-action="{ record }">
        <ASpace>
          <AButton type="link" size="small" @click="handleEditTag(record)">编辑</AButton>
        </ASpace>
      </template>
    </ContentTable>

    <!-- 新增分类模态框 -->
    <AModal
      v-model:open="modalVisible"
      :title="isEditMode ? '编辑分类' : '新增分类'"
      :confirm-loading="modalLoading"
      @ok="handleConfirmSave"
      @cancel="handleCancelSave"
      ok-text="确定"
      cancel-text="取消"
    >
      <AForm ref="formRef" :model="formData" :rules="formRules" layout="vertical">
        <AFormItem label="分类名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入分类名称" maxlength="20" />
        </AFormItem>

        <AFormItem label="分类颜色" name="color">
          <ColorPicker v-model="formData.color" />
        </AFormItem>
      </AForm>
    </AModal>
  </div>
</template>

<style scoped lang="less">
.category-management {
  padding: 24px;
  height: calc(100vh - 64px - 20px);
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

.color-display-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-badge {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  flex-shrink: 0;
}

.color-text {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}
</style>
