/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 分类管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import { message, Modal, Form, Input } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { pageCategory, saveCategory, updateCategory, deleteCategory } from '@/service/categoryService'
import type { CategoryVO } from '@/service/typings'
import ContentToolbar from '@/components/ContentToolbar'
import ContentTable from '@/components/ContentTable'
import type { ContentTableColumn } from '@/components/ContentTable'
import style from './index.less'

const Category: FC = () => {
  const [categories, setCategories] = useState<CategoryVO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页状态
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 弹窗状态
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增分类')
  const [editingCategory, setEditingCategory] = useState<CategoryVO | null>(null)
  const [form] = Form.useForm()

  // 用于取消请求和防止竞态
  const abortControllerRef = useRef<AbortController | null>(null)

  // 加载分类列表
  const loadCategories = useCallback(
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
        const res = await pageCategory(
          {
            pageNum: currentPage,
            pageSize: currentSize,
            keyword: currentKeyword || undefined,
          },
          { signal: abortController.signal },
        )

        // 如果请求被取消，不处理结果
        if (abortController.signal.aborted) return

        if (res.success && res.data) {
          setCategories(res.data)
          if (res.addition?.total !== undefined) {
            setTotal(res.addition.total)
          }
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return
        console.error('加载分类失败:', error)
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
    loadCategories().then()

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
      loadCategories({ keyword: value, page: 1 }).then()
    },
    [loadCategories],
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
      loadCategories({ page, size }).then()
    },
    [loadCategories],
  )

  // 打开新增弹窗
  const handleAdd = useCallback(() => {
    setModalTitle('新增分类')
    setEditingCategory(null)
    form.resetFields()
    setModalVisible(true)
  }, [form])

  // 打开编辑弹窗
  const handleEdit = useCallback(
    (record: CategoryVO) => {
      setModalTitle('编辑分类')
      setEditingCategory(record)
      form.setFieldsValue({
        name: record.name,
      })
      setModalVisible(true)
    },
    [form],
  )

  // 处理弹窗确认
  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields()
      
      if (editingCategory) {
        // 编辑
        const res = await updateCategory({
          id: editingCategory.id,
          name: values.name,
        })
        if (res.success) {
          message.success('更新成功')
          setModalVisible(false)
          loadCategories().then()
        } else {
          message.error(res.errMsg || '更新失败')
        }
      } else {
        // 新增
        const res = await saveCategory({
          name: values.name,
        })
        if (res.success) {
          message.success('新增成功')
          setModalVisible(false)
          loadCategories().then()
        } else {
          message.error(res.errMsg || '新增失败')
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }, [editingCategory, form, loadCategories])

  // 处理弹窗取消
  const handleModalCancel = useCallback(() => {
    setModalVisible(false)
    form.resetFields()
  }, [form])

  // 删除单个分类
  const handleDelete = useCallback(
    (record: CategoryVO) => {
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定要删除分类"${record.name}"吗？`,
        okText: '确定',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            const res = await deleteCategory({ idList: [record.id!] })
            if (res.success) {
              message.success('删除成功')
              loadCategories().then()
            } else {
              message.error(res.errMsg || '删除失败')
            }
          } catch (error) {
            message.error('删除失败')
          }
        },
      })
    },
    [loadCategories],
  )

  // 批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个分类吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await deleteCategory({ idList: selectedRowKeys })
          if (res.success) {
            message.success('删除成功')
            setSelectedRowKeys([])
            loadCategories().then()
          } else {
            message.error(res.errMsg || '删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }, [selectedRowKeys, loadCategories])

  // 表格列配置
  const columns: ContentTableColumn<CategoryVO>[] = [
    {
      key: 'name',
      title: '分类名称',
      dataIndex: 'name',
    },
    {
      key: 'createTime',
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
  ]

  return (
    <div className={style['category']}>
      <ContentToolbar
        addButtonText="新增分类"
        searchPlaceholder="搜索分类名称..."
        hasSelected={selectedRowKeys.length > 0}
        selectedCount={selectedRowKeys.length}
        onAdd={handleAdd}
        onBatchDelete={handleBatchDelete}
        onSearch={handleSearch}
        onKeywordChange={handleKeywordChange}
      />
      <ContentTable
        dataSource={categories}
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
        emptyText="暂无分类数据"
        totalUnit="个分类"
      />
      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
        className={style['category-modal']}
      >
        <Form form={form} layout="vertical" className={style['category-form']}>
          <Form.Item
            name="name"
            label="分类名称"
            rules={[
              { required: true, message: '请输入分类名称' },
              { max: 50, message: '分类名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(Category)
