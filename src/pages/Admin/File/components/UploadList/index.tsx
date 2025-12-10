/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 上传任务列表组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Progress, Tooltip, Button } from 'antd'
import {
  PauseCircleOutlined,
  PlayCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  FileOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { UploadTask, UploadStatus } from '@/hooks/useChunkUpload'
import { formatFileSize } from '@/utils/file'
import style from './index.less'

interface UploadListProps {
  tasks: UploadTask[]
  onPause: (taskId: string) => void
  onResume: (taskId: string) => Promise<void>
  onCancel: (taskId: string) => Promise<void>
  onRetry: (taskId: string) => Promise<void>
  onRemove: (taskId: string) => void
  onStart: (taskId: string) => Promise<void>
}

// 状态文本映射
const STATUS_TEXT: Record<UploadStatus, string> = {
  pending: '等待中',
  hashing: '计算哈希',
  uploading: '上传中',
  paused: '已暂停',
  completed: '已完成',
  failed: '上传失败',
  cancelled: '已取消',
}

// 状态颜色映射
const STATUS_COLOR: Record<UploadStatus, string> = {
  pending: '#8c8c8c',
  hashing: '#1890ff',
  uploading: '#1890ff',
  paused: '#faad14',
  completed: '#52c41a',
  failed: '#ff4d4f',
  cancelled: '#8c8c8c',
}

// 格式化剩余时间
const formatRemainingTime = (seconds: number): string => {
  if (seconds <= 0 || !isFinite(seconds)) return '--'
  if (seconds < 60) return `${Math.round(seconds)}秒`
  if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`
  return `${Math.round(seconds / 3600)}小时`
}

// 格式化速度
const formatSpeed = (bytesPerSecond: number): string => {
  if (bytesPerSecond <= 0) return '--'
  return `${formatFileSize(bytesPerSecond)}/s`
}

const UploadList: FC<UploadListProps> = ({
  tasks,
  onPause,
  onResume,
  onCancel,
  onRetry,
  onRemove,
  onStart,
}) => {
  if (tasks.length === 0) {
    return null
  }

  // 渲染状态图标
  const renderStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: STATUS_COLOR.completed }} />
      case 'uploading':
      case 'hashing':
        return <LoadingOutlined style={{ color: STATUS_COLOR.uploading }} spin />
      case 'failed':
        return <CloseCircleOutlined style={{ color: STATUS_COLOR.failed }} />
      case 'paused':
        return <PauseCircleOutlined style={{ color: STATUS_COLOR.paused }} />
      default:
        return <FileOutlined style={{ color: STATUS_COLOR.pending }} />
    }
  }

  // 渲染操作按钮
  const renderActions = (task: UploadTask) => {
    const { id, status } = task

    switch (status) {
      case 'pending':
        return (
          <>
            <Tooltip title="开始上传">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => onStart(id)}
              />
            </Tooltip>
            <Tooltip title="移除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(id)}
              />
            </Tooltip>
          </>
        )

      case 'uploading':
      case 'hashing':
        return (
          <>
            <Tooltip title="暂停">
              <Button
                type="text"
                size="small"
                icon={<PauseCircleOutlined />}
                onClick={() => onPause(id)}
              />
            </Tooltip>
            <Tooltip title="取消">
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onCancel(id)}
              />
            </Tooltip>
          </>
        )

      case 'paused':
        return (
          <>
            <Tooltip title="继续上传">
              <Button
                type="text"
                size="small"
                icon={<PlayCircleOutlined />}
                onClick={() => onResume(id)}
              />
            </Tooltip>
            <Tooltip title="取消">
              <Button
                type="text"
                size="small"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onCancel(id)}
              />
            </Tooltip>
          </>
        )

      case 'failed':
        return (
          <>
            <Tooltip title="重试">
              <Button
                type="text"
                size="small"
                icon={<ReloadOutlined />}
                onClick={() => onRetry(id)}
              />
            </Tooltip>
            <Tooltip title="移除">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => onRemove(id)}
              />
            </Tooltip>
          </>
        )

      case 'completed':
      case 'cancelled':
        return (
          <Tooltip title="移除">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => onRemove(id)}
            />
          </Tooltip>
        )

      default:
        return null
    }
  }

  // 渲染进度信息
  const renderProgressInfo = (task: UploadTask) => {
    const { status, progress, hashProgress, speed, remainingTime, uploadedChunks, totalChunks } =
      task

    if (status === 'hashing') {
      return (
        <div className={style['upload-item__progress-info']}>
          <span>计算文件哈希: {hashProgress}%</span>
        </div>
      )
    }

    if (status === 'uploading') {
      return (
        <div className={style['upload-item__progress-info']}>
          <span>
            {uploadedChunks.length}/{totalChunks} 分片
          </span>
          <span className={style['upload-item__speed']}>{formatSpeed(speed)}</span>
          <span className={style['upload-item__time']}>
            剩余 {formatRemainingTime(remainingTime)}
          </span>
        </div>
      )
    }

    if (status === 'paused') {
      return (
        <div className={style['upload-item__progress-info']}>
          <span>
            已完成 {uploadedChunks.length}/{totalChunks} 分片
          </span>
        </div>
      )
    }

    if (status === 'failed' && task.error) {
      return <div className={style['upload-item__error']}>{task.error}</div>
    }

    return null
  }

  return (
    <div className={style['upload-list']}>
      <div className={style['upload-list__header']}>
        <span className={style['upload-list__title']}>上传任务</span>
        <span className={style['upload-list__count']}>{tasks.length} 个文件</span>
      </div>
      <div className={style['upload-list__content']}>
        {tasks.map((task) => (
          <div key={task.id} className={style['upload-item']}>
            <div className={style['upload-item__icon']}>{renderStatusIcon(task.status)}</div>
            <div className={style['upload-item__info']}>
              <div className={style['upload-item__header']}>
                <span className={style['upload-item__name']} title={task.fileName}>
                  {task.fileName}
                </span>
                <span className={style['upload-item__size']}>{task.fileSizeFormatted}</span>
              </div>
              <Progress
                percent={task.status === 'hashing' ? task.hashProgress : task.progress}
                size="small"
                showInfo={false}
                strokeColor={STATUS_COLOR[task.status]}
                trailColor="#f0f0f0"
                className={style['upload-item__progress']}
              />
              <div className={style['upload-item__footer']}>
                <span
                  className={style['upload-item__status']}
                  style={{ color: STATUS_COLOR[task.status] }}
                >
                  {STATUS_TEXT[task.status]}
                  {(task.status === 'uploading' || task.status === 'hashing') &&
                    ` ${task.status === 'hashing' ? task.hashProgress : task.progress}%`}
                </span>
                {renderProgressInfo(task)}
              </div>
            </div>
            <div className={style['upload-item__actions']}>{renderActions(task)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(UploadList)
