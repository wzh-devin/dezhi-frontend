<script setup lang="ts">
/**
 * 2025/6/8 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 内容表格组件
 * @version 1.0
 * @since 1.0
 */
import { computed } from 'vue'

// 表格筛选器类型
interface TableFilters {
  [key: string]: (string | number | boolean)[] | null
}

// 表格排序器类型
interface TableSorter {
  field?: string
  order?: 'ascend' | 'descend'
  column?: ColumnConfig
  columnKey?: string
}

// 表格分页器类型
interface TablePagination {
  current?: number
  pageSize?: number
  total?: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
}

// 表格列配置接口
interface ColumnConfig {
  key: string
  title: string
  dataIndex: string
  width?: number | string
  ellipsis?: boolean
}

// 分页配置接口
interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
  onChange?: (page: number, pageSize: number) => void
}

// 行选择配置接口
interface RowSelectionConfig {
  type?: 'checkbox' | 'radio'
  selectedRowKeys?: (string | number)[]
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: Record<string, unknown>[]) => void
  onSelectAll?: (
    selected: boolean,
    selectedRows: Record<string, unknown>[],
    changeRows: Record<string, unknown>[],
  ) => void
  onSelect?: (
    record: Record<string, unknown>,
    selected: boolean,
    selectedRows: Record<string, unknown>[],
    nativeEvent: Event,
  ) => void
}

// 组件属性
interface Props {
  // 表格数据
  dataSource: Record<string, unknown>[]
  // 列配置
  columns: ColumnConfig[]
  // 行Key字段
  rowKey: string | ((record: Record<string, unknown>) => string)
  // 加载状态
  loading?: boolean
  // 行选择配置
  rowSelection?: RowSelectionConfig
  // 分页配置
  pagination?: PaginationConfig | false
  // 表格高度（用于滚动）
  scrollY?: number
  // 是否显示边框
  bordered?: boolean
  // 表格大小
  size?: 'large' | 'middle' | 'small'
  // 空数据提示
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  bordered: false,
  size: 'middle',
  scrollY: 420,
  emptyText: '暂无数据',
})

// 事件定义
const emit = defineEmits<{
  rowClick: [record: Record<string, unknown>, index: number]
  rowDoubleClick: [record: Record<string, unknown>, index: number]
  change: [pagination: TablePagination, filters: TableFilters, sorter: TableSorter | TableSorter[]]
}>()

// 处理行点击
const handleRowClick = (record: Record<string, unknown>, index: number) => {
  emit('rowClick', record, index)
}

// 处理行双击
const handleRowDoubleClick = (record: Record<string, unknown>, index: number) => {
  emit('rowDoubleClick', record, index)
}

// 表格变化处理
const handleTableChange = (pagination: TablePagination, filters: TableFilters, sorter: TableSorter | TableSorter[]) => {
  emit('change', pagination, filters, sorter)
}

// 计算分页配置
const computedPagination = computed(() => {
  if (props.pagination === false) {
    return false
  }
  return {
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '25', '30'],
    ...props.pagination,
  }
})

// 自定义行选择配置
const computedRowSelection = computed(() => {
  if (!props.rowSelection) {
    return undefined
  }
  return {
    type: 'checkbox',
    ...props.rowSelection,
  }
})
</script>

<template>
  <div class="content-table">
    <div class="table-wrapper">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :row-key="rowKey"
        :loading="loading"
        :row-selection="computedRowSelection"
        :pagination="false"
        :scroll="{ y: scrollY }"
        :bordered="bordered"
        :size="size"
        class="data-table"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record, index }">
          <!-- 自定义渲染列 -->
          <template v-if="column.customRender">
            <component :is="column.customRender(record, column)" />
          </template>
          <!-- 插槽透传 -->
          <slot :name="`bodyCell-${column.key}`" :record="record" :column="column" :index="index">
            <!-- 默认显示 -->
            <span v-if="!column.customRender">{{ record[column.dataIndex] }}</span>
          </slot>
        </template>

        <!-- 空数据状态 -->
        <template #emptyText>
          <div class="empty-state">
            <a-empty :description="emptyText" />
          </div>
        </template>

        <!-- 自定义行事件 -->
        <template #customRow>
          <template
            v-for="(item, itemIndex) in dataSource"
            :key="typeof rowKey === 'string' ? item[rowKey] : rowKey(item)"
          >
            <tr @click="handleRowClick(item, itemIndex)" @dblclick="handleRowDoubleClick(item, itemIndex)"></tr>
          </template>
        </template>
      </a-table>
    </div>

    <!-- 分页器 -->
    <div v-if="pagination !== false && computedPagination" class="pagination-wrapper">
      <a-pagination
        v-model:current="computedPagination.current"
        v-model:page-size="computedPagination.pageSize"
        :show-size-changer="computedPagination.showSizeChanger"
        :show-quick-jumper="computedPagination.showQuickJumper"
        :total="computedPagination.total"
        :page-size-options="computedPagination.pageSizeOptions"
        @change="computedPagination.onChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.content-table {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  flex: 1;
  display: flex;
  flex-direction: column;

  .table-wrapper {
    padding: 12px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .data-table {
      background-color: transparent;
      border-radius: 0;
      flex: 1;
      display: flex;
      flex-direction: column;

      :deep(.ant-table) {
        background: #fff;
        flex: 1;

        .ant-table-selection-column {
          padding-left: 16px !important;
          padding-right: 0 !important;
          width: 48px !important;
        }

        .ant-checkbox-wrapper {
          margin-inline-start: 0 !important;
        }

        .ant-table-thead > tr > th {
          background: #fafafa;
          white-space: nowrap;
          padding: 12px 16px;
          font-weight: 500;
          color: #1f2329;
          height: 48px;

          &.ant-table-selection-column {
            padding-right: 0;
          }

          &::before {
            display: none;
          }
        }

        .ant-table-tbody > tr > td {
          padding: 8px 16px;
          height: 56px;

          &.ant-table-selection-column {
            padding-right: 0;
          }
        }

        .ant-table-tbody > tr {
          cursor: pointer;
          transition: background-color 0.2s;

          &:hover > td {
            background: #fafafa;
          }
        }

        .ant-table-cell {
          font-size: 14px;

          .anticon {
            font-size: 16px;
            vertical-align: middle;
          }
        }
      }
    }

    .empty-state {
      padding: 24px;
      text-align: center;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 0;
    padding: 16px;
    background-color: transparent;
    border-top: 1px solid #f0f0f0;
    flex-shrink: 0;

    :deep(.ant-pagination) {
      .ant-pagination-item {
        border-radius: 6px;
        margin-inline-end: 8px;
      }

      .ant-pagination-prev,
      .ant-pagination-next {
        border-radius: 6px;
      }

      .ant-pagination-jump-prev,
      .ant-pagination-jump-next {
        border-radius: 6px;
      }
    }
  }
}
</style>
