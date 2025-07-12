/**
 * 2025/6/8 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 通用内容表格组件入口文件
 * @version 1.0
 * @since 1.0
 */

// 导出组件
export { default as ContentHeader } from './header-optional/ContentHeader.vue'
export { default as ContentTable } from './table/ContentTable.vue'

// 导出类型
export type {
  ButtonConfig,
  FilterConfig,
  SearchConfig,
  ColumnConfig,
  PaginationConfig,
  RowSelectionConfig,
} from './types.ts'
