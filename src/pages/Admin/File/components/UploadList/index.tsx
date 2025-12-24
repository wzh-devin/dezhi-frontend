/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 上传任务列表组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, {memo} from 'react'
import type {FC} from 'react'
import {Progress, Tooltip, Button} from 'antd'
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
import type {UploadTask} from '@/hooks/useChunkUpload'
import {FileStatusEnum, TEXT_MAP, COLOR_MAP} from '@/global/enums/file-enums'
import {formatFileSize} from '@/utils/file'
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
    const renderStatusIcon = (status: FileStatusEnum) => {
        switch (status) {
            case FileStatusEnum.COMPLETED:
                return <CheckCircleOutlined style={{color: COLOR_MAP.COMPLETED}}/>
            case FileStatusEnum.UPLOADING:
            case FileStatusEnum.HASHING:
                return <LoadingOutlined style={{color: COLOR_MAP.UPLOADING}} spin/>
            case FileStatusEnum.FAILED:
                return <CloseCircleOutlined style={{color: COLOR_MAP.FAILED}}/>
            case FileStatusEnum.STOP:
                return <PauseCircleOutlined style={{color: COLOR_MAP.STOP}}/>
            default:
                return <FileOutlined style={{color: COLOR_MAP.PENDING}}/>
        }
    }

    // 渲染操作按钮
    const renderActions = (task: UploadTask) => {
        const {id, status} = task

        switch (status) {
            case FileStatusEnum.PENDING:
                return (
                    <>
                        <Tooltip title="开始上传">
                            <Button
                                type="text"
                                size="small"
                                icon={<PlayCircleOutlined/>}
                                onClick={() => onStart(id)}
                            />
                        </Tooltip>
                        <Tooltip title="移除">
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined/>}
                                onClick={() => onRemove(id)}
                            />
                        </Tooltip>
                    </>
                )

            case FileStatusEnum.UPLOADING:
            case FileStatusEnum.HASHING:
                return (
                    <>
                        <Tooltip title="暂停">
                            <Button
                                type="text"
                                size="small"
                                icon={<PauseCircleOutlined/>}
                                onClick={() => onPause(id)}
                            />
                        </Tooltip>
                        <Tooltip title="取消">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<CloseCircleOutlined/>}
                                onClick={() => onCancel(id)}
                            />
                        </Tooltip>
                    </>
                )

            case FileStatusEnum.STOP:
                return (
                    <>
                        <Tooltip title="继续上传">
                            <Button
                                type="text"
                                size="small"
                                icon={<PlayCircleOutlined/>}
                                onClick={() => onResume(id)}
                            />
                        </Tooltip>
                        <Tooltip title="取消">
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<CloseCircleOutlined/>}
                                onClick={() => onCancel(id)}
                            />
                        </Tooltip>
                    </>
                )

            case FileStatusEnum.FAILED:
                return (
                    <>
                        <Tooltip title="重试">
                            <Button
                                type="text"
                                size="small"
                                icon={<ReloadOutlined/>}
                                onClick={() => onRetry(id)}
                            />
                        </Tooltip>
                        <Tooltip title="移除">
                            <Button
                                type="text"
                                size="small"
                                icon={<DeleteOutlined/>}
                                onClick={() => onRemove(id)}
                            />
                        </Tooltip>
                    </>
                )

            case FileStatusEnum.COMPLETED:
            case FileStatusEnum.CANCELLED:
                return (
                    <Tooltip title="移除">
                        <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined/>}
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
        const {status, progress, hashProgress, speed, remainingTime, uploadedChunks, totalChunks} =
            task

        if (status === FileStatusEnum.PENDING) {
            return (
                <div className={style['upload-item__progress-info']}>
                    <span>计算文件哈希: {hashProgress}%</span>
                </div>
            )
        }

        if (status === FileStatusEnum.UPLOADING) {
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

        if (status === FileStatusEnum.STOP) {
            return (
                <div className={style['upload-item__progress-info']}>
          <span>
            已完成 {uploadedChunks.length}/{totalChunks} 分片
          </span>
                </div>
            )
        }

        if (status === FileStatusEnum.FAILED && task.error) {
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
                                percent={task.status === FileStatusEnum.HASHING ? task.hashProgress : task.progress}
                                size="small"
                                showInfo={false}
                                strokeColor={COLOR_MAP[task.status]}
                                trailColor="#f0f0f0"
                                className={style['upload-item__progress']}
                            />
                            <div className={style['upload-item__footer']}>
                <span
                    className={style['upload-item__status']}
                    style={{color: COLOR_MAP[task.status]}}
                >
                  {TEXT_MAP[task.status]}
                    {(task.status === FileStatusEnum.UPLOADING || task.status === FileStatusEnum.HASHING) &&
                        ` ${task.status === FileStatusEnum.HASHING ? task.hashProgress : task.progress}%`}
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
