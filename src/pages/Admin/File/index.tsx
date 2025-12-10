/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, {
  memo,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  startTransition,
} from 'react'
import type { FC } from 'react'
import { message } from 'antd'
import { pageFile, deleteFile } from '@/service/fileService'
import type { FileVO } from '@/service/typings'
import UploadArea from './components/UploadArea'
import StorageInfo from './components/StorageInfo'
import FileToolbar from './components/FileToolbar'
import FileGrid from './components/FileGrid'
import { useChunkUpload } from '@/hooks/useChunkUpload'
import style from './index.less'

const File: FC = () => {
  const [activeTab, setActiveTab] = useState('ALL')
  const [files, setFiles] = useState<FileVO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页状态
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 用于取消请求和防止竞态
  const abortControllerRef = useRef<AbortController | null>(null)

  // 模拟存储空间数据
  const storageInfo = {
    used: 24.5,
    total: 100,
    images: 12.2,
    docs: 5.8,
  }

  // 加载文件列表
  const loadFiles = useCallback(
    async (params?: { tab?: string; page?: number; size?: number; keyword?: string }) => {
      const currentTab = params?.tab ?? activeTab
      const currentPage = params?.page ?? pageNum
      const currentSize = params?.size ?? pageSize
      const currentKeyword = params?.keyword ?? searchKeyword

      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      // 创建新的 AbortController
      const abortController = new AbortController()
      abortControllerRef.current = abortController

      setLoading(true)

      try {
        const res = await pageFile(
          {
            pageNum: currentPage,
            pageSize: currentSize,
            type: currentTab === 'ALL' ? undefined : (currentTab as FileVO['type']),
            keyword: currentKeyword || undefined,
            deleted: 'NORMAL',
          },
          { signal: abortController.signal },
        )

        // 如果请求被取消，不处理结果
        if (abortController.signal.aborted) return

        if (res.success && res.data) {
          // 使用 startTransition 让数据更新为低优先级
          startTransition(() => {
            setFiles(res.data!)
            if (res.addition?.total !== undefined) {
              setTotal(res.addition.total)
            }
          })
        }
      } catch (error: any) {
        // 忽略取消的请求错误
        if (error?.name === 'AbortError') return
        console.error('加载文件失败:', error)
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [activeTab, pageNum, pageSize, searchKeyword],
  )

  // 使用分片上传 Hook
  const { tasks, addFiles, startAllUploads } = useChunkUpload(loadFiles)

  // 计算上传中和等待中的任务
  const { uploadingTasks, pendingCount } = useMemo(() => {
    const uploading: typeof tasks = []
    let pending = 0
    tasks.forEach((task) => {
      if (task.status === 'uploading' || task.status === 'hashing') {
        uploading.push(task)
      } else if (task.status === 'pending' || task.status === 'paused') {
        pending++
      }
    })
    return { uploadingTasks: uploading, pendingCount: pending }
  }, [tasks])

  // 初始加载
  useEffect(() => {
    loadFiles().then()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // 处理标签切换
  const handleTabChange = useCallback(
    (key: string) => {
      setActiveTab(key)
      setSelectedFiles([])
      setPageNum(1)
      setLoading(true)

      // 异步加载新数据
      setTimeout(() => {
        loadFiles({ tab: key, page: 1 }).then()
      }, 0)
    },
    [loadFiles],
  )

  // 处理搜索
  const handleSearch = useCallback(
    (value: string) => {
      setSearchKeyword(value)
      setPageNum(1)
      setLoading(true)

      setTimeout(() => {
        loadFiles({ keyword: value, page: 1 }).then()
      }, 0)
    },
    [loadFiles],
  )

  // 处理关键词变化
  const handleKeywordChange = useCallback((value: string) => {
    setSearchKeyword(value)
  }, [])

  // 处理文件选择
  const handleFileSelect = useCallback((fileId: string, checked: boolean) => {
    setSelectedFiles((prev) => {
      if (checked) {
        return [...prev, fileId]
      } else {
        return prev.filter((id) => id !== fileId)
      }
    })
  }, [])

  // 复制文件链接
  const handleCopyLink = useCallback(async (file: FileVO) => {
    if (file.url) {
      await navigator.clipboard.writeText(file.url)
      message.success('链接已复制到剪贴板')
    }
  }, [])

  // 删除文件
  const handleDelete = useCallback(
    async (file: FileVO) => {
      try {
        const res = await deleteFile({ idList: [file.id!] })
        if (res.success) {
          message.success('删除成功')
          loadFiles().then()
        }
      } catch (error) {
        message.error('删除失败')
      }
    },
    [loadFiles],
  )

  // 处理文件选择（拖拽或点击选择）
  const handleFilesSelected = useCallback(
    (fileList: FileList) => {
      addFiles(fileList)
    },
    [addFiles],
  )

  // 处理分页变化
  const handlePageChange = useCallback(
    (page: number, size: number) => {
      setPageNum(page)
      setPageSize(size)
      setLoading(true)

      setTimeout(() => {
        loadFiles({ page, size }).then()
      }, 0)
    },
    [loadFiles],
  )

  return (
    <div className={style['file-page']}>
      {/* 上部区域：上传区域 + 存储信息 */}
      <div className={style['file-page__top']}>
        <UploadArea
          onFilesSelected={handleFilesSelected}
          onStartUpload={startAllUploads}
          uploadingTasks={uploadingTasks}
          pendingCount={pendingCount}
        />
        <StorageInfo
          used={storageInfo.used}
          total={storageInfo.total}
          images={storageInfo.images}
          docs={storageInfo.docs}
        />
      </div>

      {/* 文件列表区域 */}
      <div className={style['file-page__content']}>
        <FileToolbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onSearch={handleSearch}
          onKeywordChange={handleKeywordChange}
        />
        <FileGrid
          files={files}
          loading={loading}
          selectedFiles={selectedFiles}
          onFileSelect={handleFileSelect}
          onCopyLink={handleCopyLink}
          onDelete={handleDelete}
          pageNum={pageNum}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default memo(File)
