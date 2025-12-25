/**
 * 2025/12/25.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 内容管理工具栏组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Button, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons'
import style from './index.less'

interface ContentToolbarProps {
  /** 新增按钮文本 */
  addButtonText: string
  /** 搜索框占位符 */
  searchPlaceholder: string
  /** 是否有选中项 */
  hasSelected: boolean
  /** 选中数量 */
  selectedCount: number
  /** 新增按钮点击事件 */
  onAdd: () => void
  /** 批量删除点击事件 */
  onBatchDelete: () => void
  /** 搜索事件 */
  onSearch: (value: string) => void
  /** 关键词变化事件 */
  onKeywordChange: (value: string) => void
}

const ContentToolbar: FC<ContentToolbarProps> = ({
  addButtonText,
  searchPlaceholder,
  hasSelected,
  selectedCount,
  onAdd,
  onBatchDelete,
  onSearch,
  onKeywordChange,
}) => {
  return (
    <div className={style['content-toolbar']}>
      <div className={style['content-toolbar__left']}>
        <Button
          type="default"
          icon={<PlusOutlined />}
          className={style['add-btn']}
          onClick={onAdd}
        >
          {addButtonText}
        </Button>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          className={style['delete-btn']}
          disabled={!hasSelected}
          onClick={onBatchDelete}
        >
          批量删除{hasSelected && selectedCount > 0 ? ` (${selectedCount})` : ''}
        </Button>
      </div>
      <div className={style['content-toolbar__right']}>
        <Input
          placeholder={searchPlaceholder}
          prefix={<SearchOutlined />}
          className={style['search-input']}
          onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
          onChange={(e) => onKeywordChange(e.target.value)}
          allowClear
        />
        <div className={style['filter-btn']}>
          <FilterOutlined />
        </div>
      </div>
    </div>
  )
}

export default memo(ContentToolbar)

