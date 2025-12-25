/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 标签管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react'
import type { FC } from 'react'
import { message, Modal, Form, Input, ColorPicker, Tag } from 'antd'
import type { Color } from 'antd/es/color-picker'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { pageTag, saveTag, updateTag, deleteTag } from '@/service/tagService'
import type { TagVO } from '@/service/typings'
import ContentToolbar from '@/components/ContentToolbar'
import ContentTable from '@/components/ContentTable'
import type { ContentTableColumn } from '@/components/ContentTable'
import style from './index.less'

// 预设颜色
const PRESET_COLORS = [
  '#f5222d', '#fa541c', '#fa8c16', '#faad14', '#fadb14',
  '#a0d911', '#52c41a', '#13c2c2', '#1890ff', '#2f54eb',
  '#722ed1', '#eb2f96', '#8c8c8c', '#1a1a1a',
]

const Tags: FC = () => {
  const [tags, setTags] = useState<TagVO[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('')

  // 分页状态
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // 弹窗状态
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增标签')
  const [editingTag, setEditingTag] = useState<TagVO | null>(null)
  const [selectedColor, setSelectedColor] = useState('#1890ff')
  const [form] = Form.useForm()

  // 用于取消请求和防止竞态
  const abortControllerRef = useRef<AbortController | null>(null)

  // 加载标签列表
  const loadTags = useCallback(
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
        const res = await pageTag(
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
          setTags(res.data)
          if (res.addition?.total !== undefined) {
            setTotal(res.addition.total)
          }
        }
      } catch (error: any) {
        if (error?.name === 'AbortError') return
        console.error('加载标签失败:', error)
        message.error('加载标签失败')
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
    loadTags().then()

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
      loadTags({ keyword: value, page: 1 }).then()
    },
    [loadTags],
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
      loadTags({ page, size }).then()
    },
    [loadTags],
  )

  // 打开新增弹窗
  const handleAdd = useCallback(() => {
    setModalTitle('新增标签')
    setEditingTag(null)
    setSelectedColor('#1890ff')
    form.resetFields()
    setModalVisible(true)
  }, [form])

  // 打开编辑弹窗
  const handleEdit = useCallback(
    (record: TagVO) => {
      setModalTitle('编辑标签')
      setEditingTag(record)
      setSelectedColor(record.color || '#1890ff')
      form.setFieldsValue({
        name: record.name,
      })
      setModalVisible(true)
    },
    [form],
  )

  // 处理颜色变化
  const handleColorChange = useCallback((color: Color) => {
    setSelectedColor(color.toHexString())
  }, [])

  // 处理弹窗确认
  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields()

      if (editingTag) {
        // 编辑
        const res = await updateTag({
          id: editingTag.id,
          name: values.name,
          color: selectedColor,
        })
        if (res.success) {
          message.success('更新成功')
          setModalVisible(false)
          loadTags().then()
        } else {
          message.error(res.errMsg || '更新失败')
        }
      } else {
        // 新增
        const res = await saveTag({
          name: values.name,
          color: selectedColor,
        })
        if (res.success) {
          message.success('新增成功')
          setModalVisible(false)
          loadTags().then()
        } else {
          message.error(res.errMsg || '新增失败')
        }
      }
    } catch (error) {
      console.error('表单验证失败:', error)
    }
  }, [editingTag, form, loadTags, selectedColor])

  // 处理弹窗取消
  const handleModalCancel = useCallback(() => {
    setModalVisible(false)
    form.resetFields()
  }, [form])

  // 删除单个标签
  const handleDelete = useCallback(
    (record: TagVO) => {
      Modal.confirm({
        title: '确认删除',
        icon: <ExclamationCircleOutlined />,
        content: `确定要删除标签"${record.name}"吗？`,
        okText: '确定',
        cancelText: '取消',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            const res = await deleteTag({ idList: [record.id!] })
            if (res.success) {
              message.success('删除成功')
              loadTags().then()
            } else {
              message.error(res.errMsg || '删除失败')
            }
          } catch (error) {
            message.error('删除失败')
          }
        },
      })
    },
    [loadTags],
  )

  // 批量删除
  const handleBatchDelete = useCallback(() => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认批量删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除选中的 ${selectedRowKeys.length} 个标签吗？`,
      okText: '确定',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await deleteTag({ idList: selectedRowKeys })
          if (res.success) {
            message.success('删除成功')
            setSelectedRowKeys([])
            loadTags().then()
          } else {
            message.error(res.errMsg || '删除失败')
          }
        } catch (error) {
          message.error('删除失败')
        }
      },
    })
  }, [selectedRowKeys, loadTags])

  // 表格列配置
  const columns: ContentTableColumn<TagVO>[] = [
    {
      key: 'name',
      title: '标签名称',
      dataIndex: 'name',
      render: (_, record) => (
        <Tag
          color={record.color}
          className={style['tag-item']}
        >
          {record.name}
        </Tag>
      ),
    },
    {
      key: 'color',
      title: '颜色',
      dataIndex: 'color',
      render: (_, record) => (
        <div className={style['color-preview']}>
          <span
            className={style['color-preview__dot']}
            style={{ backgroundColor: record.color }}
          />
          <span className={style['color-preview__value']}>{record.color}</span>
        </div>
      ),
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
    <div className={style['tags']}>
      <ContentToolbar
        addButtonText="新增标签"
        searchPlaceholder="搜索标签名称..."
        hasSelected={selectedRowKeys.length > 0}
        selectedCount={selectedRowKeys.length}
        onAdd={handleAdd}
        onBatchDelete={handleBatchDelete}
        onSearch={handleSearch}
        onKeywordChange={handleKeywordChange}
      />
      <ContentTable
        dataSource={tags}
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
        emptyText="暂无标签数据"
        totalUnit="个标签"
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
        className={style['tags-modal']}
      >
        <Form form={form} layout="vertical" className={style['tags-form']}>
          <Form.Item
            name="name"
            label="标签名称"
            rules={[
              { required: true, message: '请输入标签名称' },
              { max: 50, message: '标签名称不能超过50个字符' },
            ]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item label="标签颜色">
            <div className={style['color-picker-wrapper']}>
              <ColorPicker
                value={selectedColor}
                onChange={handleColorChange}
                presets={[
                  {
                    label: '预设颜色',
                    colors: PRESET_COLORS,
                  },
                ]}
              />
              <div className={style['color-preview-tag']}>
                <span>预览：</span>
                <Tag color={selectedColor}>
                  {form.getFieldValue('name') || '标签名称'}
                </Tag>
              </div>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(Tags)
