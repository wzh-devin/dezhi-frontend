<script setup lang="ts">
/**
 * 2025/5/21 17:10
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材管理
 * @version 1.0
 * @since 1.0
 */
import { onMounted, reactive, ref, computed } from 'vue'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import useMaterialStore from '@/store/material'
import { errMsgExtract } from '@/global/string-format.ts'
import dayjs from 'dayjs'
import { convertBytesToKb } from '@/utils/convert.ts'
import { ContentHeader, ContentTable } from '@/components/content-cmp'
import type {
  ButtonConfig,
  FilterConfig,
  SearchConfig,
  ColumnConfig,
  PaginationConfig,
  RowSelectionConfig,
} from '@/components/content-cmp'
import { UploadModal } from '@/components/upload-cmp'
import { StatusEnum } from '@/constant/status-enums.ts'
import type { ApiResultObject, FileInfoVO } from '@/service/typings.ts'
import { message } from 'ant-design-vue'

const materialStore = useMaterialStore()
// 选择的行Keys
const selectedRowKeys = ref<(string | number)[]>([])
// 文件类型过滤器
const fileTypeFilter = ref<string>('')
// 上传弹窗显示状态
const uploadModalVisible = ref(false)
// 页面信息
const pageInfo = reactive({
  addition: {
    pageNum: ref(1),
    pageSize: ref(10),
    total: ref(0),
  },
  dataSource: reactive<FileInfoVO[]>([]),
  loading: ref<boolean>(false),
})

// 表格列配置
const tableColumns: ColumnConfig[] = [
  {
    title: '文件展示',
    dataIndex: 'image',
    key: 'image',
    width: 80,
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    key: 'size',
    width: 100,
  },
  {
    title: '文件地址',
    dataIndex: 'url',
    key: 'url',
    ellipsis: true,
    width: 300,
  },
  {
    title: '文件类型',
    dataIndex: 'fileType',
    key: 'fileType',
    width: 120,
  },
  {
    title: '存储类型',
    dataIndex: 'storageType',
    key: 'storageType',
    width: 120,
  },
  {
    title: '上传时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
]

/**
 * 初始化页面
 */
const pageInit = async (addition: { pageNum: number; pageSize: number }) => {
  pageInfo.loading = true
  materialStore.getMaterialListAction({ ...addition, status: StatusEnum.NORMAL }).then(
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
      label: '新增文件',
      type: 'primary' as const,
      icon: PlusOutlined,
      onClick: handleUpload,
    },
    {
      key: 'batch-delete',
      label: '批量删除',
    },
  ] as ButtonConfig[],
  filters: [
    {
      key: 'fileType',
      placeholder: '文件类型',
      width: '120px',
      options: [
        { label: '全部', value: '' },
        { label: '文档', value: 'DOC' },
        { label: '图片', value: 'IMAGE' },
        { label: '压缩包', value: 'ZIP' },
      ],
    },
  ] as FilterConfig[],
  search: {
    placeholder: '请输入文件名称搜索',
    width: '300px',
    onSearch: onSearch,
  } as SearchConfig,
  rightButtons: [
    {
      key: 'recycle',
      label: '回收站',
      type: 'primary' as const,
      danger: true,
      icon: DeleteOutlined,
      onClick: handleRecycleBin,
    },
  ] as ButtonConfig[],
  selectedCount: selectedRowKeys.value.length,
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
    total: pageInfo.addition.total,
    onChange: paginationHandler,
  } as PaginationConfig,
  scrollY: 420,
}))

const handleUpload = () => {
  uploadModalVisible.value = true
}

// 上传成功后的处理
const handleUploadSuccess = () => {
  // 重新加载数据
  pageInit(pageInfo.addition)
  uploadModalVisible.value = false
}

// 批量删除确认处理
const handleBatchDeleteConfirm = async () => {
  pageInfo.loading = true
  try {
    await materialStore.delMaterialAction((selectedRowKeys.value as string[]) ?? [])
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

const handleRecycleBin = () => {
  // 处理回收站逻辑
}

const onSearch = (value: string) => {
  // 处理搜索逻辑
  console.log('搜索:', value)
}

/**
 * 筛选器变化处理
 */
const onFilterChange = (key: string, value: string) => {
  if (key === 'fileType') {
    fileTypeFilter.value = value
  }
  console.log('筛选器变化:', key, value)
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
  <div class="material-management">
    <!-- 头部操作栏 -->
    <ContentHeader
      :left-buttons="headerConfig.leftButtons"
      :filters="headerConfig.filters"
      :search="headerConfig.search"
      :right-buttons="headerConfig.rightButtons"
      :selected-count="headerConfig.selectedCount"
      @filter-change="onFilterChange"
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
      <!-- 文件展示列 -->
      <template #bodyCell-image="{ record }">
        <a-image :width="40" :height="40" :src="record.url" :preview-mask="false" :key="record.id" />
      </template>

      <!-- 文件地址列 -->
      <template #bodyCell-url="{ record }">
        <a :href="record.url" target="_blank" class="file-link">{{ record.url }}</a>
      </template>

      <!-- 文件大小列 -->
      <template #bodyCell-size="{ record }">
        {{ `${convertBytesToKb(record.size)} KB` }}
      </template>

      <!-- 文件类型列 -->
      <template #bodyCell-fileType="{ record }">
        <a-tag
          :class="[
            'file-type-tag',
            record.fileType === 'DOC' ? 'doc-tag' : record.fileType === 'IMAGE' ? 'image-tag' : 'zip-tag',
          ]"
        >
          {{ record.fileType }}
        </a-tag>
      </template>

      <!-- 上传时间列 -->
      <template #bodyCell-createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
    </ContentTable>

    <!-- 上传弹窗 -->
    <UploadModal
      v-model:visible="uploadModalVisible"
      @success="handleUploadSuccess"
      @cancel="uploadModalVisible = false"
    />
  </div>
</template>

<style scoped lang="less">
.material-management {
  padding: 24px;
  height: calc(100vh - 64px - 20px);
  background-color: transparent;
  display: flex;
  flex-direction: column;

  .file-link {
    color: #1677ff;
    text-decoration: none;
    display: inline-flex;
    align-items: center;

    &:hover {
      text-decoration: underline;
    }
  }

  .file-type-tag {
    border-radius: 4px;
    padding: 1px 6px;
    display: inline-flex;
    align-items: center;
    font-size: 12px;

    &.doc-tag {
      color: #1677ff;
      background: #e6f4ff;
      border-color: #91caff;
    }

    &.image-tag {
      color: #52c41a;
      background: #f6ffed;
      border-color: #b7eb8f;
    }

    &.zip-tag {
      color: #faad14;
      background: #fffbe6;
      border-color: #ffe58f;
    }
  }

  :deep(.ant-image) {
    cursor: pointer;

    img {
      object-fit: cover;
      border-radius: 4px;
    }
  }
}
</style>
