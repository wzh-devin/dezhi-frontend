/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 上传Hook
 * @version 1.0.0
 * @since 1.0.0
 */
import {useCallback, useRef, useState} from 'react'
import {message} from 'antd'
import {
    cancelUpload,
    completeUpload,
    getUploadStatus,
    initiateUpload,
    uploadChunk,
} from '@/service/fileService'
import type {UploadSession} from '@/service/typings'
import {
    calculateChunkCount,
    calculateFileHashWithProgress,
    formatFileSize,
    getRecommendedChunkSize,
} from '@/utils/file'
import {localStorage} from '@/utils/storage-utils'
import {FileStatusEnum} from '@/global/enums/file-enums'
import {UPLOAD_SESSION_KEY} from '@/global/constant/storage-key';
import {MAX_FILE_SIZE} from '@/global/constant/config-constant';
import {generateUUID} from '@/utils/generator';

// 上传任务信息
export interface UploadTask {
    id: string
    file: File
    fileName: string
    fileSize: number
    fileSizeFormatted: string
    fileHash?: string
    uploadId?: string
    status: FileStatusEnum
    progress: number
    hashProgress: number
    uploadedChunks: number[]
    totalChunks: number
    chunkSize: number
    speed: number
    remainingTime: number
    error?: string
    startTime?: number
    uploadedBytes: number
}

// Hook 返回类型
interface UseChunkUploadReturn {
    tasks: UploadTask[]
    addFiles: (files: FileList | File[]) => void
    startUpload: (taskId: string) => Promise<void>
    pauseUpload: (taskId: string) => void
    resumeUpload: (taskId: string) => Promise<void>
    cancelTask: (taskId: string) => Promise<void>
    retryUpload: (taskId: string) => Promise<void>
    removeTask: (taskId: string) => void
    startAllUploads: () => Promise<void>
    pauseAllUploads: () => void
}

export const useChunkUpload = (onUploadComplete?: () => void): UseChunkUploadReturn => {
    const [tasks, setTasks] = useState<UploadTask[]>([])
    const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
    const uploadingRef = useRef<Set<string>>(new Set())

    // 更新任务状态
    const updateTask = useCallback((taskId: string, updates: Partial<UploadTask>) => {
        setTasks((prev) => prev.map((task) => (task.id === taskId ? {...task, ...updates} : task)))
    }, [])

    // 保存上传会话到本地存储
    const saveUploadSession = useCallback((task: UploadTask) => {
        if (task.uploadId && task.fileHash) {
            const sessionData = {
                uploadId: task.uploadId,
                fileHash: task.fileHash,
                fileName: task.fileName,
                fileSize: task.fileSize,
                totalChunks: task.totalChunks,
                chunkSize: task.chunkSize,
                uploadedChunks: task.uploadedChunks,
            }
            localStorage.set(`${UPLOAD_SESSION_KEY}${task.fileHash}`, sessionData)
        }
    }, [])

    // 获取本地存储的上传会话
    const getStoredSession = useCallback((fileHash: string) => {
        return localStorage.get<{
            uploadId: string
            fileHash: string
            fileName: string
            fileSize: number
            totalChunks: number
            chunkSize: number
            uploadedChunks: number[]
        }>(`${UPLOAD_SESSION_KEY}${fileHash}`)
    }, [])

    // 清除本地存储的上传会话
    const clearStoredSession = useCallback((fileHash: string) => {
        localStorage.remove(`${UPLOAD_SESSION_KEY}${fileHash}`)
    }, [])

    // 添加文件到上传队列
    const addFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files)

        // 过滤超出大小限制的文件
        const validFiles: File[] = []
        const oversizedFiles: File[] = []

        fileArray.forEach((file) => {
            if (file.size > MAX_FILE_SIZE) {
                oversizedFiles.push(file)
            } else {
                validFiles.push(file)
            }
        })

        // 提示超出大小限制的文件
        if (oversizedFiles.length > 0) {
            const maxSizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024))
            oversizedFiles.forEach((file) => {
                message.error({
                  content: `文件 "${file.name}" 超出大小限制（最大 ${maxSizeMB}MB）`,
                  duration: 3,
                }).then()
             })
        }

        // 只添加符合大小限制的文件
        const newTasks: UploadTask[] = validFiles.map((file) => {
            const chunkSize = getRecommendedChunkSize(file.size)
            const totalChunks = calculateChunkCount(file.size, chunkSize)

            return {
                id: generateUUID(),
                file,
                fileName: file.name,
                fileSize: file.size,
                fileSizeFormatted: formatFileSize(file.size),
                status: FileStatusEnum.PENDING,
                progress: 0,
                hashProgress: 0,
                uploadedChunks: [],
                totalChunks,
                chunkSize,
                speed: 0,
                remainingTime: 0,
                uploadedBytes: 0,
            }
        })

        if (newTasks.length > 0) {
            setTasks((prev) => [...prev, ...newTasks])
        }
    }, [])

    // 计算文件哈希
    const calculateHash = useCallback(
        async (task: UploadTask): Promise<string> => {
            updateTask(task.id, {status: FileStatusEnum.HASHING, hashProgress: 0})

            return await calculateFileHashWithProgress(task.file, (progress) => {
                updateTask(task.id, {hashProgress: progress})
            })
        },
        [updateTask],
    )

    // 开始上传任务
    const startUpload = useCallback(
        async (taskId: string) => {
            const task = tasks.find((t) => t.id === taskId)
            if (!task || uploadingRef.current.has(taskId)) return

            uploadingRef.current.add(taskId)
            const abortController = new AbortController()
            abortControllersRef.current.set(taskId, abortController)

            try {
                // 计算文件哈希
                let fileHash = task.fileHash as string
                if (!fileHash) {
                    fileHash = await calculateHash(task)
                    updateTask(taskId, {fileHash})
                }

                // 检查本地是否有未完成的上传会话
                let uploadId = task.uploadId
                let uploadedChunks = task.uploadedChunks
                const storedSession = getStoredSession(fileHash)

                if (storedSession && storedSession.uploadId) {
                    // 从服务端获取上传状态
                    try {
                        const statusRes = await getUploadStatus({uploadId: storedSession.uploadId})
                        if (statusRes.success && statusRes.data) {
                            const session = statusRes.data as UploadSession
                            if (session.status === 'UPLOADING') {
                                uploadId = session.uploadId as string
                                uploadedChunks = session.competedChunks || []
                                message.info({content: '继续上传', duration: 1.5})
                            }
                        }
                    } catch (error) {
                        clearStoredSession(fileHash)
                    }
                }

                // 初始化上传
                if (!uploadId) {
                    const initRes = await initiateUpload({
                        originalName: task.fileName,
                        fileHash,
                        fileSize: task.fileSize,
                        totalChunks: task.totalChunks,
                    })

                    if (!initRes.success || !initRes.data) {
                        throw new Error(initRes.errMsg || '初始化上传失败')
                    }

                    // 检查是否秒传
                    const session = initRes.data as UploadSession
                    if (session.status === 'INSTANT') {
                        // 更新任务状态
                        updateTask(taskId, {
                            status: FileStatusEnum.COMPLETED,
                            progress: 100,
                            uploadId: session.uploadId,
                        })
                        // 清除会话缓存
                        clearStoredSession(fileHash)
                        uploadingRef.current.delete(taskId)
                        message.success({content: `${task.fileName} 秒传成功`, duration: 1.5})
                        onUploadComplete?.()

                        // 移除任务
                        setTasks((prev) => prev.filter((t) => t.id !== taskId))
                        return
                    }

                    uploadId = session.uploadId as string
                    uploadedChunks = session.competedChunks || []
                }

                // 更新状态为上传中
                updateTask(taskId, {
                    status: FileStatusEnum.UPLOADING,
                    uploadId,
                    uploadedChunks,
                    startTime: Date.now(),
                })

                // 上传分片
                const chunksToUpload = Array.from(
                    {length: task.totalChunks},
                    (_, i) => i
                ).filter(
                    (i) => !uploadedChunks.includes(i),
                )

                let lastUpdateTime = Date.now()
                let lastUploadedBytes = uploadedChunks.length * task.chunkSize

                for (const chunkIndex of chunksToUpload) {
                    // 检查是否被暂停或取消
                    if (abortController.signal.aborted) {
                        throw new Error('上传已取消')
                    }

                    // 上传单个片段（需要等待完成）
                    const success = await uploadSingleChunk(
                        {...task, uploadId} as UploadTask,
                        chunkIndex + 1,
                        abortController,
                    )

                    if (!success) {
                        throw new Error(`分片 ${chunkIndex} 上传失败`)
                    }

                    // 更新进度
                    uploadedChunks = [...uploadedChunks, chunkIndex]
                    const uploadedBytes = uploadedChunks.length * task.chunkSize
                    const progress = Math.round((uploadedChunks.length / task.totalChunks) * 100)

                    // 计算速度和剩余时间
                    const now = Date.now()
                    const timeDiff = (now - lastUpdateTime) / 1000
                    const bytesDiff = uploadedBytes - lastUploadedBytes
                    const speed = timeDiff > 0 ? bytesDiff / timeDiff : 0
                    const remainingBytes = task.fileSize - uploadedBytes
                    const remainingTime = speed > 0 ? remainingBytes / speed : 0

                    updateTask(taskId, {
                        uploadedChunks,
                        uploadedBytes,
                        progress,
                        speed,
                        remainingTime,
                    })

                    // 保存会话到本地存储
                    saveUploadSession({
                        ...task,
                        uploadId,
                        fileHash,
                        uploadedChunks,
                    } as UploadTask)


                    lastUpdateTime = now
                    lastUploadedBytes = uploadedBytes
                }

                // 完成上传
                const completeRes = await completeUpload({uploadId})
                if (!completeRes.success) {
                    throw new Error(completeRes.errMsg || '上传失败')
                }

                updateTask(taskId, {
                    status: FileStatusEnum.COMPLETED,
                    progress: 100,
                })

                clearStoredSession(fileHash)
                message.success({content: `${task.fileName} 上传成功`, duration: 1.5})
                onUploadComplete?.()

                // 上传完成后自动移除任务
                setTasks((prev) => prev.filter((t) => t.id !== taskId))
            } catch (error: any) {
                if (error.name === 'AbortError' || error.message === '上传已取消') {
                    return
                }

                console.error('上传失败:', error)
                updateTask(taskId, {
                    status: FileStatusEnum.FAILED,
                    error: error.message || '上传失败',
                })
            } finally {
                uploadingRef.current.delete(taskId)
                abortControllersRef.current.delete(taskId)
            }
        },
        [
            tasks,
            updateTask,
            calculateHash,
            getStoredSession,
            clearStoredSession,
            saveUploadSession,
            onUploadComplete,
        ],
    )

    // 上传单个分片
    const uploadSingleChunk = useCallback(
        async (
            task: UploadTask,
            chunkIndex: number,
            abortController: AbortController,
        ): Promise<boolean> => {
            const start = (chunkIndex - 1) * task.chunkSize
            const end = Math.min(start + task.chunkSize, Number(task.fileSize))
            const chunk = task.file.slice(start, end)

            try {
                // 上传单个分片
                const res = await uploadChunk(
                    {
                        uploadId: task.uploadId,
                        chunkIndex: chunkIndex.toString(),
                        file: chunk as any,
                    },
                    {
                        signal: abortController.signal,
                        headers: {'Content-Type': 'multipart/form-data'},
                        requestType: 'form',
                    },
                )

                return res.success === true
            } catch (error: any) {
                return false
            }
        },
        [],
    )

    // 暂停上传
    const pauseUpload = useCallback(
        (taskId: string) => {
            const abortController = abortControllersRef.current.get(taskId)
            if (abortController) {
                abortController.abort()
            }
            updateTask(taskId, {status: FileStatusEnum.STOP})
        },
        [updateTask],
    )

    // 恢复上传
    const resumeUpload = useCallback(
        async (taskId: string) => {
            await startUpload(taskId)
        },
        [startUpload],
    )

    // 取消上传任务
    const cancelTask = useCallback(
        async (taskId: string) => {
            const task = tasks.find((t) => t.id === taskId)
            if (!task) return

            // 中止正在进行的上传
            const abortController = abortControllersRef.current.get(taskId)
            if (abortController) {
                abortController.abort()
            }

            // 取消上传
            if (task.uploadId) {
                await cancelUpload({uploadId: task.uploadId})
            }

            // 清除本地存储
            if (task.fileHash) {
                clearStoredSession(task.fileHash)
            }

            updateTask(taskId, {status: FileStatusEnum.CANCELLED})
        },
        [tasks, updateTask, clearStoredSession],
    )

    // 重试上传
    const retryUpload = useCallback(
        async (taskId: string) => {
            updateTask(taskId, {
                status: FileStatusEnum.PENDING,
                progress: 0,
                error: undefined,
            })
            await startUpload(taskId)
        },
        [updateTask, startUpload],
    )

    // 移除任务
    const removeTask = useCallback(
        (taskId: string) => {
            const task = tasks.find((t) => t.id === taskId)
            if (task?.fileHash) {
                clearStoredSession(task.fileHash)
            }

            const abortController = abortControllersRef.current.get(taskId)
            if (abortController) {
                abortController.abort()
            }

            setTasks((prev) => prev.filter((t) => t.id !== taskId))
        },
        [tasks, clearStoredSession],
    )

    // 开始所有上传
    const startAllUploads = useCallback(async () => {
        const pendingTasks = tasks.filter((t) => t.status === FileStatusEnum.PENDING || t.status === FileStatusEnum.STOP)
        for (const task of pendingTasks) {
            await startUpload(task.id)
        }
    }, [tasks, startUpload])

    // 暂停所有上传
    const pauseAllUploads = useCallback(() => {
        tasks.forEach((task) => {
            if (task.status === FileStatusEnum.UPLOADING || task.status === FileStatusEnum.HASHING) {
                pauseUpload(task.id)
            }
        })
    }, [tasks, pauseUpload])

    return {
        tasks,
        addFiles,
        startUpload,
        pauseUpload,
        resumeUpload,
        cancelTask,
        retryUpload,
        removeTask,
        startAllUploads,
        pauseAllUploads,
    }
}

export default useChunkUpload
