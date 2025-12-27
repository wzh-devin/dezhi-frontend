/**
 * 2025/12/28.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章回收站页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import { message, Modal, Button, Input } from 'antd'
import {
  ExclamationCircleOutlined,
  ArrowLeftOutlined,
  UndoOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { history } from 'umi'
import { pageArticle, updateArticle, clearRecycleBin } from '@/service/articleService'
import type { ArticleVO } from '@/service/typings'
import ContentTable from '@/components/ContentTable'
import type { ContentTableColumn } from '@/components/ContentTable'
import style from './index.less'

const Recycle: FC = () => {
  const [articles, setArticles] = useState<ArticleVO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页状态
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 用于取消请求和防止竞态
  const abortControllerRef = useRef<AbortController | null>(null)

  // 加载回收站文章列表
  const loadArticles = useCallback(
    async (params?: { page?: number; size?: number; keyword?: string }) => {
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
        const res = await pageArticle(
          {
            pageNum: currentPage,
            pageSize: currentSize,
            status: 'DELETED',
            keyword: currentKeyword || undefined,
          },
          { signal: abortController.signal },
        )

        // 如果请求被取消，不处理结果
        if (abortController.signal.aborted) return

        if (res.success && res.data) {
          setArticles(res.data)
          if (res.addition?.total !== undefined) {
            setTotal(res.addition.total)
          }
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return
        console.error('加载回收站文章失败:', error)
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    },
    [pageNum, pageSize, searchKeyword],
  )

  // 初始加载
  useEffect(() => {
    loadArticles().then()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // 处理搜索
  const handleSearch = useCallback(
    (value: string) => {
      setSearchKeyword(value)
      setPageNum(1)
      setSelectedRowKeys([])
      loadArticles({ keyword: value, page: 1 }).then()
    },
    [loadArticles],
  )

  // 处理分页变化
  const handlePageChange = useCallback(
    (page: number, size: number) => {
      setPageNum(page)
      setPageSize(size)
      setSelectedRowKeys([])
      loadArticles({ page, size }).then()
    },
    [loadArticles],
  )

  // 返回文章列表
  const handleBack = useCallback(() => {
    history.push('/admin/content/article')
  }, [])

  // 恢复单个文章
  const handleRestore = useCallback(
    (record: ArticleVO) => {
      Modal.confirm({
        title: '确认恢复',
        icon: <ExclamationCircleOutlined />,
        content: `确定要恢复文章"${record.title || '无标题'}"吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          try {
            const res = await updateArticle({ id: record.id!, status: 'DRAFT' })
            if (res.success) {
              message.success('恢复成功')
              loadArticles().then()
            } else {
              message.error(res.errMsg || '恢复失败')
            }
          } catch (error) {
            message.error('恢复失败')
          }
        },
      })
    },
    [loadArticles],
  )

  // 永久删除单个文章
  const handlePermanentDelete = useCallback(
    (record: ArticleVO) => {
      Modal.confirm({
        title: '确认永久删除',
        icon: <ExclamationCircleOutlined />,
        content: (
          <div>
            <p>确定要永久删除文章"{record.title || '无标题'}"吗？</p>
            <p style={{ color: '#ef4444', fontSize: '12px' }}>
              此操作不可恢复，请谨慎操作！
            </p>
          </div>
        ),
        okText: '永久删除',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            const res = await clearRecycleBin({ idList: [record.id!] })
            if (res.success) {
              message.success('永久删除成功')
              loadArticles().then()
            } else {
              message.error(res.errMsg || '永久删除失败')
            }
          } catch (error) {
            message.error('永久删除失败')
          }
        },
      })
    },
    [loadArticles],
  )

  // 批量恢复
  const handleBatchRestore = useCallback(() => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认批量恢复',
      icon: <ExclamationCircleOutlined />,
      content: `确定要恢复选中的 ${selectedRowKeys.length} 篇文章吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 批量恢复：逐个更新状态为 DRAFT
          const results = await Promise.all(
            selectedRowKeys.map((id) => updateArticle({ id, status: 'DRAFT' }))
          )
          const allSuccess = results.every((res) => res.success)
          if (allSuccess) {
            message.success('恢复成功')
            setSelectedRowKeys([])
            loadArticles().then()
          } else {
            message.error('部分文章恢复失败')
            loadArticles().then()
          }
        } catch (error) {
          message.error('恢复失败')
        }
      },
    })
  }, [selectedRowKeys, loadArticles])

  // 批量永久删除
  const handleBatchPermanentDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认批量永久删除',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>确定要永久删除选中的 {selectedRowKeys.length} 篇文章吗？</p>
          <p style={{ color: '#ef4444', fontSize: '12px' }}>
            此操作不可恢复，请谨慎操作！
          </p>
        </div>
      ),
      okText: '永久删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await clearRecycleBin({ idList: selectedRowKeys })
          if (res.success) {
            message.success('永久删除成功')
            setSelectedRowKeys([])
            loadArticles().then()
          } else {
            message.error(res.errMsg || '永久删除失败')
          }
        } catch (error) {
          message.error('永久删除失败')
        }
      },
    })
  }, [selectedRowKeys, loadArticles])

  // 表格列配置
  const columns: ContentTableColumn<ArticleVO>[] = [
    {
      key: 'title',
      title: '文章标题',
      dataIndex: 'title',
      render: (value: string) => value || '无标题',
    },
    {
      key: 'categoryName',
      title: '分类',
      dataIndex: 'categoryName',
      width: 120,
      render: (value: string) => value || '-',
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      key: 'updateTime',
      title: '删除时间',
      dataIndex: 'updateTime',
      width: 180,
    },
  ]

  // 自定义操作列渲染
  const renderActions = useCallback((record: ArticleVO) => (
    <>
      <Button
        type="link"
        size="small"
        icon={<UndoOutlined />}
        className={style['restore-action-btn']}
        onClick={() => handleRestore(record)}
      >
        恢复
      </Button>
      <Button
        type="link"
        size="small"
        danger
        icon={<DeleteOutlined />}
        className={style['delete-action-btn']}
        onClick={() => handlePermanentDelete(record)}
      >
        永久删除
      </Button>
    </>
  ), [handleRestore, handlePermanentDelete])

  return (
    <div className={style['recycle']}>
      {/* 顶部工具栏 */}
      <div className={style['toolbar']}>
        <div className={style['toolbar-left']}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className={style['back-btn']}
          >
            返回文章列表
          </Button>
          <h2 className={style['title']}>回收站</h2>
        </div>
        <div className={style['toolbar-right']}>
          <Input
            placeholder="搜索文章标题..."
            prefix={<SearchOutlined />}
            className={style['search-input']}
            onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
            onChange={(e) => setSearchKeyword(e.target.value)}
            allowClear
          />
        </div>
      </div>

      {/* 批量操作栏 */}
      {selectedRowKeys.length > 0 && (
        <div className={style['batch-bar']}>
          <span className={style['selected-info']}>
            已选择 {selectedRowKeys.length} 项
          </span>
          <Button
            type="primary"
            icon={<UndoOutlined />}
            onClick={handleBatchRestore}
            className={style['restore-btn']}
          >
            批量恢复
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchPermanentDelete}
          >
            批量永久删除
          </Button>
        </div>
      )}

      {/* 表格 */}
      <ContentTable
        dataSource={articles}
        columns={columns}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={setSelectedRowKeys}
        actionRender={renderActions}
        actionWidth={200}
        pageNum={pageNum}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        emptyText="回收站为空"
        totalUnit="篇文章"
      />
    </div>
  )
}

export default memo(Recycle)
