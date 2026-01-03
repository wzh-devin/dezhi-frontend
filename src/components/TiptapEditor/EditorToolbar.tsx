/**
 * 2025/12/27.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description Tiptap 编辑器工具栏组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useCallback, useState, useEffect } from 'react'
import type { FC } from 'react'
import type { Editor } from '@tiptap/react'
import { Modal, Input, Spin, Empty, Pagination, message } from 'antd'
import {
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnderlineOutlined,
  HighlightOutlined,
  LinkOutlined,
  CodeOutlined,
  FileImageOutlined,
  CheckOutlined,
  FileMarkdownOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { marked } from 'marked'
import { pageFile } from '@/service/fileService'
import type { FileVO } from '@/service/typings'
import style from './index.less'

const { TextArea } = Input

interface EditorToolbarProps {
  editor: Editor
}

const EditorToolbar: FC<EditorToolbarProps> = ({ editor }) => {
  const [linkModalVisible, setLinkModalVisible] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [imageModalVisible, setImageModalVisible] = useState(false)
  
  // 图片选择相关状态
  const [imageList, setImageList] = useState<FileVO[]>([])
  const [imageLoading, setImageLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<FileVO | null>(null)
  const [imagePageNum, setImagePageNum] = useState(1)
  const [imagePageSize] = useState(8)
  const [imageTotal, setImageTotal] = useState(0)
  
  // Markdown 粘贴相关状态
  const [markdownModalVisible, setMarkdownModalVisible] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')
  
  // 强制组件在编辑器状态变化时重新渲染
  const [, setForceUpdate] = useState(0)
  
  useEffect(() => {
    const handleUpdate = () => {
      setForceUpdate((prev) => prev + 1)
    }
    
    editor.on('selectionUpdate', handleUpdate)
    editor.on('transaction', handleUpdate)
    
    return () => {
      editor.off('selectionUpdate', handleUpdate)
      editor.off('transaction', handleUpdate)
    }
  }, [editor])

  // 加载图片列表
  const loadImages = useCallback(async (pageNum: number = 1) => {
    setImageLoading(true)
    try {
      const res = await pageFile({
        pageNum,
        pageSize: imagePageSize,
        type: 'IMAGE',
        deleted: 'NORMAL',
      })
      if (res.success) {
        setImageList(res.data || [])
        setImageTotal(res.addition?.total || 0)
      } else {
        message.error(res.errMsg || '获取图片列表失败')
      }
    } catch (error) {
      message.error('获取图片列表失败')
    } finally {
      setImageLoading(false)
    }
  }, [imagePageSize])

  // 打开图片弹窗时加载图片
  const handleOpenImageModal = useCallback(() => {
    setImageModalVisible(true)
    setSelectedImage(null)
    setImagePageNum(1)
    loadImages(1).then()
  }, [loadImages])

  // 分页变化
  const handleImagePageChange = useCallback((page: number) => {
    setImagePageNum(page)
    setSelectedImage(null)
    loadImages(page).then()
  }, [loadImages])

  // 选择图片（再次点击取消选择）
  const handleSelectImage = useCallback((file: FileVO) => {
    setSelectedImage((prev) => prev?.id === file.id ? null : file)
  }, [])

  // 确认插入图片
  const handleInsertImage = useCallback(() => {
    if (selectedImage?.url) {
      editor.chain().focus().setImage({
        src: selectedImage.url,
        alt: selectedImage.originalName || '',
        title: selectedImage.originalName || '',
      }).run()
      setImageModalVisible(false)
      setSelectedImage(null)
    } else {
      message.warning('请选择一张图片').then()
    }
  }, [editor, selectedImage])

  // 设置链接
  const handleSetLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }
    setLinkModalVisible(false)
    setLinkUrl('')
  }, [editor, linkUrl])

  // 打开链接弹窗
  const handleOpenLinkModal = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    setLinkModalVisible(true)
  }, [editor])


  // 插入 Markdown
  const handleInsertMarkdown = useCallback(() => {
    if (!markdownContent.trim()) {
      message.warning('请输入 Markdown 内容').then()
      return
    }
    
    try {
      // 将 Markdown 转换为 HTML
      const html = marked.parse(markdownContent, { async: false }) as string
      // 插入到编辑器
      editor.chain().focus().insertContent(html).run()
      setMarkdownModalVisible(false)
      setMarkdownContent('')
      message.success('Markdown 内容已插入').then()
    } catch (error) {
      message.error('Markdown 转换失败').then()
    }
  }, [editor, markdownContent])

  // 检测文本是否包含 Markdown 语法
  const hasMarkdownSyntax = useCallback((text: string): boolean => {
    const markdownPatterns = [
      /^#{1,6}\s/m,           // 标题
      /\*\*[^*]+\*\*/,        // 粗体
      /(?<!\*)\*[^*]+\*(?!\*)/,  // 斜体
      /^[-*+]\s/m,            // 无序列表
      /^\d+\.\s/m,            // 有序列表
      /\[.+\]\(.+\)/,         // 链接
      /!\[.*\]\(.+\)/,        // 图片
      /^>/m,                  // 引用
      /`[^`]+`/,              // 行内代码
      /^```/m,                // 代码块
      /\|.+\|/,               // 表格
    ]
    return markdownPatterns.some(pattern => pattern.test(text))
  }, [])

  // 将 HTML 中的链接标签还原为纯文本 URL
  const stripLinkTags = useCallback((html: string): string => {
    // 将 <a href="url">text</a> 还原为 url（用于 Markdown 图片/链接语法）
    return html.replace(/<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/g, '$1')
  }, [])

  // 智能刷新渲染 - 只渲染纯 Markdown 文本段落，保护已有富文本
  const handleRefreshRender = useCallback(() => {
    let html = editor.getHTML()
    
    if (!html || html === '<p></p>') {
      message.warning('编辑器内容为空').then()
      return
    }
    
    // 配置 marked 选项
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
    
    // 先将自动转换的链接标签还原为纯文本 URL
    html = stripLinkTags(html)
    
    // 查找连续的表格行并合并
    let hasRendered = false
    let newHtml = html
    
    // 处理表格：找到连续的以 | 开头和结尾的段落
    const tablePattern = /(<p>\|[^<]+\|<\/p>\s*)+/g
    newHtml = newHtml.replace(tablePattern, (tableMatch) => {
      // 提取表格内容
      const rows: string[] = []
      const rowRegex = /<p>(\|[^<]+\|)<\/p>/g
      let rowMatch
      while ((rowMatch = rowRegex.exec(tableMatch)) !== null) {
        rows.push(rowMatch[1])
      }
      if (rows.length >= 2) {
        hasRendered = true
        const tableMarkdown = rows.join('\n')
        return marked.parse(tableMarkdown, { async: false }) as string
      }
      return tableMatch
    })
    
    // 处理代码块：找到连续的代码块内容
    const codeBlockPattern = /<p>```(\w*)<\/p>([\s\S]*?)<p>```<\/p>/g
    newHtml = newHtml.replace(codeBlockPattern, (_, lang, content) => {
      hasRendered = true
      // 提取代码内容
      const codeLines: string[] = []
      const lineRegex = /<p>([^<]*)<\/p>/g
      let lineMatch
      while ((lineMatch = lineRegex.exec(content)) !== null) {
        codeLines.push(lineMatch[1])
      }
      const codeMarkdown = '```' + (lang || '') + '\n' + codeLines.join('\n') + '\n```'
      return marked.parse(codeMarkdown, { async: false }) as string
    })
    
    // 处理普通的单行 Markdown 段落（包括图片语法）
    newHtml = newHtml.replace(/<p>([^<]+)<\/p>/g, (match, content) => {
      // 跳过表格行（已处理）
      if (/^\|.*\|$/.test(content.trim())) {
        return match
      }
      // 检查这个段落是否包含 Markdown 语法
      if (hasMarkdownSyntax(content)) {
        hasRendered = true
        const rendered = marked.parse(content, { async: false }) as string
        return rendered
      }
      return match
    })
    
    if (!hasRendered) {
      message.info('未检测到需要渲染的 Markdown 语法').then()
      return
    }
    
    // 设置新内容
    editor.commands.setContent(newHtml)
    message.success('Markdown 内容已渲染').then()
  }, [editor, hasMarkdownSyntax])

  return (
    <div className={style['editor-toolbar']}>
      <div className={style['toolbar-buttons']}>
        {/* 基础格式 */}
        <button
          className={`${style['tool-btn']} ${editor.isActive('bold') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          type="button"
          title="加粗"
        >
          <BoldOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('italic') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type="button"
          title="斜体"
        >
          <ItalicOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('strike') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          type="button"
          title="删除线"
        >
          <StrikethroughOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('code') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}
          type="button"
          title="行内代码"
        >
          <CodeOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('underline') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type="button"
          title="下划线"
        >
          <UnderlineOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('highlight') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          type="button"
          title="高亮"
        >
          <HighlightOutlined />
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('link') ? style['active'] : ''}`}
          onClick={handleOpenLinkModal}
          type="button"
          title="链接"
        >
          <LinkOutlined />
        </button>

        <span className={style['toolbar-separator']}>|</span>

        {/* 上标下标 */}
        <button
          className={`${style['tool-btn']} ${editor.isActive('superscript') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          type="button"
          title="上标"
        >
          x<sup>2</sup>
        </button>
        <button
          className={`${style['tool-btn']} ${editor.isActive('subscript') ? style['active'] : ''}`}
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          type="button"
          title="下标"
        >
          x<sub>2</sub>
        </button>

        <span className={style['toolbar-separator']}>|</span>

        {/* 添加图片 */}
        <button
          className={style['tool-btn'] + ' ' + style['add-btn']}
          onClick={handleOpenImageModal}
          type="button"
          title="添加图片"
        >
          <FileImageOutlined />
          <span>添加图片</span>
        </button>

        {/* 粘贴 Markdown */}
        <button
          className={style['tool-btn'] + ' ' + style['add-btn']}
          onClick={() => setMarkdownModalVisible(true)}
          type="button"
          title="粘贴 Markdown"
        >
          <FileMarkdownOutlined />
          <span>Markdown</span>
        </button>

        {/* 刷新渲染 */}
        <button
          className={style['tool-btn']}
          onClick={handleRefreshRender}
          type="button"
          title="智能渲染（自动识别并渲染 Markdown 文本，保护已有格式）"
        >
          <SyncOutlined />
        </button>
      </div>

      <div className={style['toolbar-mode']}>
        Rich Text Mode
      </div>

      {/* 链接弹窗 */}
      <Modal
        title="插入链接"
        open={linkModalVisible}
        onOk={handleSetLink}
        onCancel={() => {
          setLinkModalVisible(false)
          setLinkUrl('')
        }}
        okText="确定"
        cancelText="取消"
        width={400}
      >
        <Input
          placeholder="请输入链接地址"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          onPressEnter={handleSetLink}
        />
      </Modal>

      {/* 图片选择弹窗 */}
      <Modal
        title="选择图片"
        open={imageModalVisible}
        onOk={handleInsertImage}
        onCancel={() => {
          setImageModalVisible(false)
          setSelectedImage(null)
        }}
        okText="插入图片"
        cancelText="取消"
        width={680}
        className={style['image-modal']}
      >
        <Spin spinning={imageLoading}>
          {imageList.length > 0 ? (
            <>
              <div className={style['image-grid']}>
                {imageList.map((file) => (
                  <div
                    key={file.id}
                    className={`${style['image-item']} ${selectedImage?.id === file.id ? style['selected'] : ''}`}
                    onClick={() => handleSelectImage(file)}
                  >
                    <div className={style['image-preview']}>
                      <img src={file.url} alt={file.originalName} />
                    </div>
                    {selectedImage?.id === file.id && (
                      <div className={style['image-check']}>
                        <CheckOutlined />
                      </div>
                    )}
                    <div className={style['image-name']} title={file.originalName}>
                      {file.originalName}
                    </div>
                  </div>
                ))}
              </div>
              <div className={style['image-pagination']}>
                <Pagination
                  current={imagePageNum}
                  pageSize={imagePageSize}
                  total={imageTotal}
                  onChange={handleImagePageChange}
                  showSizeChanger={false}
                  size="small"
                />
              </div>
            </>
          ) : (
            <Empty description="暂无图片" />
          )}
        </Spin>
      </Modal>

      {/* Markdown 粘贴弹窗 */}
      <Modal
        title="粘贴 Markdown"
        open={markdownModalVisible}
        onOk={handleInsertMarkdown}
        onCancel={() => {
          setMarkdownModalVisible(false)
          setMarkdownContent('')
        }}
        okText="插入"
        cancelText="取消"
        width={700}
      >
        <TextArea
          placeholder="在此粘贴 Markdown 内容..."
          value={markdownContent}
          onChange={(e) => setMarkdownContent(e.target.value)}
          rows={15}
          style={{ fontFamily: 'monospace' }}
        />
      </Modal>
    </div>
  )
}

export default memo(EditorToolbar)
