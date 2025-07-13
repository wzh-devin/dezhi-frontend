/**
 * 2025/6/8 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 内容表格组件类型定义
 * @version 1.0
 * @since 1.0
 */

// 按钮配置接口
export interface ButtonConfig {
  key: string
  label: string
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'
  icon?: unknown
  disabled?: boolean
  danger?: boolean
  onClick: () => void
}

// 筛选器配置接口
export interface FilterConfig {
  key: string
  placeholder: string
  options: Array<{ label: string; value: string }>
  value?: string
  width?: string
}

// 搜索配置接口
export interface SearchConfig {
  placeholder: string
  width?: string
  onSearch: (value: string) => void
}

// 表格列配置接口
export interface ColumnConfig {
  key: string
  title: string
  dataIndex: string
  width?: number | string
  ellipsis?: boolean
}

// 分页配置接口
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: string[]
  onChange?: (page: number, pageSize: number) => void
}

// 行选择配置接口
export interface RowSelectionConfig {
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
