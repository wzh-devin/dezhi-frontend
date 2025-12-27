/**
 * 2025/12/25.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 内容管理表格组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { ReactNode } from 'react'
import { Table, Checkbox, Button, Spin, Empty, Pagination, ConfigProvider } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import zhCN from 'antd/locale/zh_CN'
import type { ColumnsType } from 'antd/es/table'
import { PAGINATION_CONFIG } from '@/global/constant/config-constant'
import style from './index.less'

export interface ContentTableColumn<T> {
  key: string
  title: string
  dataIndex?: keyof T | string
  width?: number | string
  render?: (value: any, record: T, index: number) => ReactNode
  align?: 'left' | 'center' | 'right'
}

interface ContentTableProps<T extends { id?: string }> {
  /** 数据源 */
  dataSource: T[]
  /** 列配置 */
  columns: ContentTableColumn<T>[]
  /** 加载状态 */
  loading: boolean
  /** 选中的行ID列表 */
  selectedRowKeys: string[]
  /** 选中变化事件 */
  onSelectChange: (selectedRowKeys: string[]) => void
  /** 编辑事件（当没有自定义 actionRender 时必填） */
  onEdit?: (record: T) => void
  /** 删除事件（当没有自定义 actionRender 时必填） */
  onDelete?: (record: T) => void
  /** 自定义操作列渲染 */
  actionRender?: (record: T) => ReactNode
  /** 操作列宽度 */
  actionWidth?: number
  /** 当前页码 */
  pageNum: number
  /** 每页数量 */
  pageSize: number
  /** 总数 */
  total: number
  /** 分页变化事件 */
  onPageChange: (page: number, pageSize: number) => void
  /** 空状态文本 */
  emptyText?: string
  /** 总数单位文本 */
  totalUnit?: string
}

function ContentTable<T extends { id?: string }>({
  dataSource,
  columns,
  loading,
  selectedRowKeys,
  onSelectChange,
  onEdit,
  onDelete,
  actionRender,
  actionWidth = 180,
  pageNum,
  pageSize,
  total,
  onPageChange,
  emptyText = '暂无数据',
  totalUnit = '条数据',
}: ContentTableProps<T>) {
  // 全选状态
  const isAllSelected = dataSource.length > 0 && selectedRowKeys.length === dataSource.length
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length

  // 处理全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectChange(dataSource.map((item) => item.id!).filter(Boolean))
    } else {
      onSelectChange([])
    }
  }

  // 处理单行选择
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectChange([...selectedRowKeys, id])
    } else {
      onSelectChange(selectedRowKeys.filter((key) => key !== id))
    }
  }

  // 格式化日期
  const formatDateTime = (dateStr?: string): string => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hours}:${minutes}`
  }

  // 构建表格列
  const tableColumns: ColumnsType<T> = [
    {
      title: (
        <Checkbox
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      key: 'selection',
      width: 50,
      align: 'center',
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id!)}
          onChange={(e) => handleSelectRow(record.id!, e.target.checked)}
        />
      ),
    },
    ...columns.map((col) => ({
      title: col.title,
      key: col.key,
      dataIndex: col.dataIndex as string,
      width: col.width,
      align: col.align,
      render: col.render
        ? (value: any, record: T, index: number) => col.render!(value, record, index)
        : col.dataIndex?.toString().includes('Time')
          ? (value: string) => formatDateTime(value)
          : undefined,
    })),
    {
      title: '操作',
      key: 'action',
      width: actionWidth,
      align: 'center',
      render: (_, record) => {
        // 如果提供了自定义渲染函数，使用自定义渲染
        if (actionRender) {
          return (
            <div className={style['action-btns']}>
              {actionRender(record)}
            </div>
          )
        }
        // 默认的编辑/删除按钮
        return (
          <div className={style['action-btns']}>
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              className={style['edit-btn']}
              onClick={() => onEdit?.(record)}
            >
              编辑
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              className={style['delete-btn']}
              onClick={() => onDelete?.(record)}
            >
              删除
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className={style['content-table-wrapper']}>
      <div className={style['table-scroll-container']}>
        <Spin spinning={loading}>
          {dataSource.length > 0 ? (
            <Table
              rowKey="id"
              dataSource={dataSource}
              columns={tableColumns}
              pagination={false}
              className={style['content-table']}
              sticky
            />
          ) : (
            <Empty description={emptyText} className={style['empty-state']} />
          )}
        </Spin>
      </div>

      {/* 分页 */}
      {total > 0 && (
        <div className={style['table-pagination']}>
          <div className={style['table-pagination__info']}>
            共 {total} {totalUnit}
          </div>
          <div className={style['table-pagination__controls']}>
            <ConfigProvider locale={zhCN}>
              <Pagination
                current={pageNum}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
                onChange={onPageChange}
              />
            </ConfigProvider>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(ContentTable) as typeof ContentTable

