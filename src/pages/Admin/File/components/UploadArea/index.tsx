/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件上传区域组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useRef, useState } from 'react'
import type { FC } from 'react'
import { Button, Progress } from 'antd'
import { CloudUploadOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import type { UploadTask } from '@/hooks/useChunkUpload'
import { formatFileSize } from '@/utils/file'
import style from './index.less'

interface UploadAreaProps {
  onFilesSelected?: (files: FileList) => void
  onStartUpload?: () => void
  uploadingTasks?: UploadTask[]
  pendingCount?: number
}

const UploadArea: FC<UploadAreaProps> = ({
  onFilesSelected,
  onStartUpload,
  uploadingTasks = [],
  pendingCount = 0,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleFiles = (fileList: FileList) => {
    if (onFilesSelected) {
      onFilesSelected(fileList)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleStartUpload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStartUpload?.()
  }

  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond <= 0) return '--'
    return `${formatFileSize(bytesPerSecond)}/s`
  }

  const isUploading = uploadingTasks.length > 0

  return (
    <div className={style['upload-area']}>
      <div
        className={`${style['upload-dragger']} ${isDragging ? style['upload-dragger--dragging'] : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className={style['upload-dragger__input']}
          multiple
          onChange={handleFileInputChange}
        />

        {/* 上传中状态 - 显示进度 */}
        {isUploading ? (
          <div className={style['upload-progress']}>
            <div className={style['upload-progress__header']}>
              <LoadingOutlined className={style['upload-progress__icon']} spin />
              <span className={style['upload-progress__title']}>
                正在上传 ({uploadingTasks.length} 个文件)
              </span>
            </div>
            <div className={style['upload-progress__list']}>
              {uploadingTasks.map((task) => (
                <div key={task.id} className={style['upload-progress__item']}>
                  <div className={style['upload-progress__info']}>
                    <span className={style['upload-progress__name']} title={task.fileName}>
                      {task.fileName}
                    </span>
                    <span className={style['upload-progress__meta']}>
                      {task.status === 'hashing' ? (
                        `计算哈希 ${task.hashProgress}%`
                      ) : (
                        <>
                          {task.uploadedChunks.length}/{task.totalChunks} 分片 ·{' '}
                          {formatSpeed(task.speed)}
                        </>
                      )}
                    </span>
                  </div>
                  <Progress
                    percent={task.status === 'hashing' ? task.hashProgress : task.progress}
                    size="small"
                    strokeColor={{
                      '0%': '#1890ff',
                      '100%': '#52c41a',
                    }}
                    className={style['upload-progress__bar']}
                  />
                </div>
              ))}
            </div>
            {pendingCount > 0 && (
              <div className={style['upload-progress__pending']}>
                还有 {pendingCount} 个文件等待上传
              </div>
            )}
          </div>
        ) : (
          /* 默认状态 - 拖拽上传提示 */
          <div className={style['upload-dragger__content']}>
            <div className={style['upload-dragger__icon']}>
              <CloudUploadOutlined />
            </div>
            <p className={style['upload-dragger__text']}>点击或拖拽上传文件</p>
            <p className={style['upload-dragger__hint']}>
              支持图片、PDF、压缩包格式，支持断点续传 (Max 100MB)
            </p>
            {pendingCount > 0 && (
              <div className={style['upload-dragger__actions']}>
                <span className={style['upload-dragger__pending']}>
                  {pendingCount} 个文件待上传
                </span>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleStartUpload}
                  className={style['upload-dragger__btn']}
                >
                  开始上传
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 装饰背景 */}
        <div className={style['upload-dragger__pattern']} />
      </div>
    </div>
  )
}

export default memo(UploadArea)
