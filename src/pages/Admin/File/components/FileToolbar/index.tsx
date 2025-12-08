/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件工具栏组件（标签+搜索）
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Input } from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import style from './index.less'

// 文件类型标签
const FILE_TABS = [
  { key: 'ALL', label: '全部文件' },
  { key: 'IMAGE', label: '图片 Image' },
  { key: 'PDF', label: 'PDF' },
  { key: 'ZIP', label: '压缩文件 ZIP' },
]

interface FileToolbarProps {
  activeTab: string
  onTabChange: (key: string) => void
  onSearch: (value: string) => void
  onKeywordChange: (value: string) => void
}

const FileToolbar: FC<FileToolbarProps> = ({
  activeTab,
  onTabChange,
  onSearch,
  onKeywordChange,
}) => {
  return (
    <div className={style['file-toolbar']}>
      <div className={style['file-tabs']}>
        {FILE_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${style['file-tabs__item']} ${activeTab === tab.key ? style['file-tabs__item--active'] : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={style['file-toolbar__search']}>
        <Input
          placeholder="搜索文件..."
          prefix={<SearchOutlined />}
          className={style['search-input']}
          onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
      </div>
    </div>
  )
}

export default memo(FileToolbar)
