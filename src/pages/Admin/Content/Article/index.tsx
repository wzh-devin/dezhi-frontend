/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import { message, Modal, Tag, Button } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { history } from 'umi'
import { pageArticle, saveArticle, deleteArticle } from '@/service/articleService'
import type { ArticleVO, TagVO } from '@/service/typings'
import ContentToolbar from '@/components/ContentToolbar'
import ContentTable from '@/components/ContentTable'
import type { ContentTableColumn } from '@/components/ContentTable'
import style from './index.less'

// 文章状态映射
const STATUS_MAP: Record<string, { text: string; color: string }> = {
  DRAFT: { text: '草稿', color: 'default' },
  PUBLISHED: { text: '已发布', color: 'success' },
  DELETED: { text: '已删除', color: 'error' },
  NORMAL: { text: '正常', color: 'processing' },
}

const Article: FC = () => {
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

  // 加载文章列表
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
            status: 'NORMAL',
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
        console.error('加载文章失败:', error)
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

  // 处理关键词变化
  const handleKeywordChange = useCallback((value: string) => {
    setSearchKeyword(value)
  }, [])

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

  // 新增文章
  const handleAdd = useCallback(async () => {
    try {
      const res = await saveArticle()
      if (res.success && res.data?.id) {
        message.success('文章创建成功')
        // 跳转到撰写文章页面
        history.push(`/admin/content/article/write/${res.data.id}`)
      } else {
        message.error(res.errMsg || '创建文章失败')
      }
    } catch (error) {
      message.error('创建文章失败')
    }
  }, [])

  // 编辑文章
  const handleEdit = useCallback((record: ArticleVO) => {
    // 跳转到撰写文章页面
    history.push(`/admin/content/article/write/${record.id}`)
  }, [])

  // 删除单个文章
  const handleDelete = useCallback(
    (record: ArticleVO) => {
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定要删除文章"${record.title || '无标题'}"吗？`,
        okText: '确定',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            const res = await deleteArticle({ idList: [record.id!] })
            if (res.success) {
              message.success('删除成功')
              loadArticles().then()
            } else {
              message.error(res.errMsg || '删除失败')
            }
          } catch (error) {
            message.error('删除失败')
          }
        },
      })
    },
    [loadArticles],
  )

  // 批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 篇文章吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await deleteArticle({ idList: selectedRowKeys })
          if (res.success) {
            message.success('删除成功')
            setSelectedRowKeys([])
            loadArticles().then()
          } else {
            message.error(res.errMsg || '删除失败')
          }
        } catch (error) {
          message.error('删除失败')
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
      key: 'tagList',
      title: '标签',
      dataIndex: 'tagList',
      width: 200,
      render: (value: TagVO[]) => {
        if (!value || value.length === 0) return '-'
        return (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {value.slice(0, 3).map((tag) => (
              <Tag key={tag.id} color={tag.color || 'blue'}>
                {tag.name}
              </Tag>
            ))}
            {value.length > 3 && (
              <Tag>+{value.length - 3}</Tag>
            )}
          </div>
        )
      },
    },
    {
      key: 'status',
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (value: string) => {
        const statusInfo = STATUS_MAP[value] || { text: value, color: 'default' }
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      key: 'top',
      title: '置顶',
      dataIndex: 'top',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'orange' : 'default'}>{value === 1 ? '是' : '否'}</Tag>
      ),
    },
    {
      key: 'hot',
      title: '热门',
      dataIndex: 'hot',
      width: 80,
      render: (value: number) => (
        <Tag color={value === 1 ? 'red' : 'default'}>{value === 1 ? '是' : '否'}</Tag>
      ),
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
    },
  ]

  // 跳转到回收站
  const handleGoToRecycleBin = useCallback(() => {
    history.push('/admin/content/article/recycle')
  }, [])

  // 回收站按钮
  const recycleBinButton = (
    <Button
      type="text"
      icon={<DeleteOutlined />}
      className={style['recycle-btn']}
      onClick={handleGoToRecycleBin}
    >
      回收站
    </Button>
  )

  return (
    <div className={style['article']}>
      <ContentToolbar
        addButtonText="新增文章"
        searchPlaceholder="搜索文章标题..."
        hasSelected={selectedRowKeys.length > 0}
        selectedCount={selectedRowKeys.length}
        onAdd={handleAdd}
        onBatchDelete={handleBatchDelete}
        onSearch={handleSearch}
        onKeywordChange={handleKeywordChange}
        extraButtons={recycleBinButton}
      />
      <ContentTable
        dataSource={articles}
        columns={columns}
        loading={loading}
        selectedRowKeys={selectedRowKeys}
        onSelectChange={setSelectedRowKeys}
        onEdit={handleEdit}
        onDelete={handleDelete}
        pageNum={pageNum}
        pageSize={pageSize}
        total={total}
        onPageChange={handlePageChange}
        emptyText="暂无文章数据"
        totalUnit="篇文章"
      />
    </div>
  )
}

export default memo(Article)
