/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件网格组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Checkbox, Tooltip, Spin, Empty, Pagination, ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import {
  CopyOutlined,
  DeleteOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileZipOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import type { FileVO } from '@/service/typings'
import { PAGINATION_CONFIG } from '@/global/constant/config-constant'
import style from './index.less'

// 文件类型映射
const FILE_TYPE_MAP: Record<string, { icon: React.ReactNode; color: string }> = {
  PDF: { icon: <FilePdfOutlined />, color: '#ff4d4f' },
  ZIP: { icon: <FileZipOutlined />, color: '#faad14' },
  DEFAULT: { icon: <FileOutlined />, color: '#8c8c8c' },
}

interface FileGridProps {
  files: FileVO[]
  loading: boolean
  selectedFiles: string[]
  onFileSelect: (fileId: string, checked: boolean) => void
  onCopyLink: (file: FileVO) => void
  onDelete: (file: FileVO) => void
  // 分页相关
  pageNum: number
  pageSize: number
  total: number
  onPageChange: (page: number, pageSize: number) => void
}

const FileGrid: FC<FileGridProps> = ({
  files,
  loading,
  selectedFiles,
  onFileSelect,
  onCopyLink,
  onDelete,
  pageNum,
  pageSize,
  total,
  onPageChange,
}) => {
  // 格式化文件大小
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '0 B'
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

  // 格式化日期
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  // 判断是否为图片
  const isImage = (file: FileVO): boolean => {
    // 通过 type 字段判断（如 "IMAGE"）
    if (file.type?.toUpperCase() === 'IMAGE') {
      return true
    }
    // 通过 mimeType 判断（如 "image/jpeg"）
    return !!file.type?.startsWith('image/')
  }

  // 获取文件图标
  const getFileIcon = (file: FileVO) => {
    const ext = file.type || 'DEFAULT'
    const typeInfo = FILE_TYPE_MAP[ext] || FILE_TYPE_MAP.default
    return (
      <div className={style['file-card__icon']} style={{ color: typeInfo.color }}>
        {typeInfo.icon}
      </div>
    )
  }

  return (
    <div className={style['file-grid-wrapper']}>
      <Spin spinning={loading}>
        {files.length > 0 ? (
          <div className={style['file-grid']}>
            {files.map((file) => (
              <div key={file.id} className={style['file-card']}>
                <div className={style['file-card__checkbox']}>
                  <Checkbox
                    checked={selectedFiles.includes(file.id!)}
                    onChange={(e) => onFileSelect(file.id!, e.target.checked)}
                  />
                </div>
                <div className={style['file-card__more']}>
                  <EllipsisOutlined />
                </div>
                <div className={style['file-card__preview']}>
                  {isImage(file) && file.url ? (
                    <img src={file.url} alt={file.originalName} />
                  ) : (
                    getFileIcon(file)
                  )}
                  {/* 悬停操作层 */}
                  <div className={style['file-card__overlay']}>
                    <Tooltip title="复制链接">
                      <button
                        className={style['file-card__overlay-btn']}
                        onClick={(e) => {
                          e.stopPropagation()
                          onCopyLink(file)
                        }}
                      >
                        <CopyOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="删除">
                      <button
                        className={style['file-card__overlay-btn']}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(file)
                        }}
                      >
                        <DeleteOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className={style['file-card__info']}>
                  <div className={style['file-card__name']}>{file.originalName}</div>
                  <div className={style['file-card__meta']}>
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.createTime)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Empty description="暂无文件" className={style['file-empty']} />
        )}
      </Spin>

      {/* 分页 */}
      {total > 0 && (
        <div className={style['file-pagination']}>
          <ConfigProvider locale={zhCN}>
            <Pagination
              current={pageNum}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={PAGINATION_CONFIG.pageSizeOptions}
              showTotal={(total) => `共 ${total} 个文件`}
              onChange={onPageChange}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  )
}

export default memo(FileGrid)
