/**
 * 2025/12/27.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 撰写文章页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import { message, Spin } from 'antd'
import {
  ArrowLeftOutlined,
  EyeOutlined,
  SaveOutlined,
  CloseOutlined,
  GlobalOutlined,
  FolderOutlined,
  NumberOutlined,
  DownOutlined,
} from '@ant-design/icons'
import { history, useParams } from 'umi'
import { getArticleInfo, updateArticle } from '@/service/articleService'
import { optionalCategory } from '@/service/categoryService'
import { optionalTag } from '@/service/tagService'
import type { CategoryVO, TagVO } from '@/service/typings'
import TiptapEditor from '@/components/TiptapEditor'
import type { EditorContent } from '@/components/TiptapEditor'
import style from './index.less'

const Write: FC = () => {
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<CategoryVO[]>([])
  const [tags, setTags] = useState<TagVO[]>([])

  // 表单数据
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('') // HTML 格式
  const [contentMd, setContentMd] = useState('') // Markdown 格式
  const [categoryId, setCategoryId] = useState<string | undefined>()
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isTop, setIsTop] = useState(false)
  const [isHot, setIsHot] = useState(false)

  // 初始内容（用于编辑器初始化）
  const [initialContent, setInitialContent] = useState('')

  // 标签输入
  const [tagInput, setTagInput] = useState('')
  const [showTagDropdown, setShowTagDropdown] = useState(false)

  // 分类下拉框
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // 加载文章信息
  const loadArticle = useCallback(async () => {
    if (!id) return

    setLoading(true)
    try {
      const res = await getArticleInfo({ articleId: id })
      if (res.success && res.data) {
        const data = res.data
        setTitle(data.title || '')
        setSummary(data.summary || '')
        // 优先使用 HTML 内容，如果没有则使用 Markdown
        const htmlContent = data.content || ''
        setContent(htmlContent)
        setContentMd(data.contentMd || '')
        setInitialContent(htmlContent)
        setCategoryId(data.categoryId)
        // 从 tagList 中提取标签 ID 列表
        const tagIds = data.tagList?.map((tag) => tag.id!).filter(Boolean) || []
        setSelectedTagIds(tagIds)
        setIsTop(data.top === 1)
        setIsHot(data.hot === 1)
      } else {
        message.error(res.errMsg || '获取文章信息失败')
      }
    } catch (error) {
      message.error('获取文章信息失败')
    } finally {
      setLoading(false)
    }
  }, [id])

  // 加载分类列表
  const loadCategories = useCallback(async () => {
    try {
      const res = await optionalCategory()
      if (res.success && res.data) {
        setCategories(res.data)
      }
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }, [])

  // 加载标签列表
  const loadTags = useCallback(async () => {
    try {
      const res = await optionalTag()
      if (res.success && res.data) {
        setTags(res.data)
      }
    } catch (error) {
      console.error('加载标签失败:', error)
    }
  }, [])

  // 初始加载
  useEffect(() => {
    loadArticle().then()
    loadCategories().then()
    loadTags().then()
  }, [loadArticle, loadCategories, loadTags])

  // 编辑器内容变化
  const handleEditorChange = useCallback((editorContent: EditorContent) => {
    setContent(editorContent.html)
    setContentMd(editorContent.markdown)
  }, [])

  // 发布文章
  const handlePublish = useCallback(async () => {
    if (!id) return

    if (!title.trim()) {
      message.warning('请输入文章标题')
      return
    }

    setSaving(true)
    try {
      const res = await updateArticle({
        id,
        title,
        summary,
        content, // HTML 格式
        contentMd, // Markdown 格式
        categoryId,
        tagIdList: selectedTagIds,
        top: isTop ? 1 : 0,
        hot: isHot ? 1 : 0,
        status: 'PUBLISHED',
      })
      if (res.success) {
        message.success('发布成功')
        history.push('/admin/content/article')
      } else {
        message.error(res.errMsg || '发布失败')
      }
    } catch (error) {
      message.error('发布失败')
    } finally {
      setSaving(false)
    }
  }, [id, title, summary, content, contentMd, categoryId, selectedTagIds, isTop, isHot])

  // 保存草稿
  const handleSaveDraft = useCallback(async () => {
    if (!id) return

    setSaving(true)
    try {
      const res = await updateArticle({
        id,
        title,
        summary,
        content,
        contentMd,
        categoryId,
        tagIdList: selectedTagIds,
        top: isTop ? 1 : 0,
        hot: isHot ? 1 : 0,
        status: 'DRAFT',
      })
      if (res.success) {
        message.success('草稿保存成功')
      } else {
        message.error(res.errMsg || '保存失败')
      }
    } catch (error) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }, [id, title, summary, content, contentMd, categoryId, selectedTagIds, isTop, isHot])

  // 返回列表
  const handleBack = useCallback(() => {
    history.push('/admin/content/article')
  }, [])

  // 预览文章
  const handlePreview = useCallback(() => {
    message.info('预览功能开发中...').then()
  }, [])

  // 获取选中的分类名称
  const getSelectedCategoryName = useCallback(() => {
    if (!categoryId) return null
    return categories.find((c) => c.id === categoryId)
  }, [categoryId, categories])

  // 选择分类
  const handleSelectCategory = useCallback((catId: string) => {
    setCategoryId(catId)
    setShowCategoryDropdown(false)
  }, [])

  // 获取选中的标签名称列表
  const getSelectedTagNames = useCallback(() => {
    return selectedTagIds
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter(Boolean) as TagVO[]
  }, [selectedTagIds, tags])

  // 移除标签
  const handleRemoveTag = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => prev.filter((tid) => tid !== tagId))
  }, [])

  // 选择标签
  const handleSelectTag = useCallback((tagId: string) => {
    if (!selectedTagIds.includes(tagId)) {
      setSelectedTagIds((prev) => {
        return [...prev, tagId]
      })
    }
    setTagInput('')
    setShowTagDropdown(false)
  }, [selectedTagIds])

  // 过滤标签
  const filteredTags = tags.filter(
    (t) =>
      t.name?.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTagIds.includes(t.id!)
  )

  return (
    <Spin spinning={loading} wrapperClassName={style['write-spin']}>
      <div className={style['write']}>
        {/* 顶部工具栏 */}
        <div className={style['write-toolbar']}>
          <div className={style['toolbar-left']}>
            <button
              className={style['back-btn']}
              onClick={handleBack}
              title="返回列表"
            >
              <ArrowLeftOutlined />
            </button>
            <span className={style['divider']}>|</span>
            <input
              type="text"
              placeholder="文章标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={style['title-input']}
              maxLength={100}
            />
          </div>
          <div className={style['toolbar-right']}>
            <button className={style['preview-btn']} onClick={handlePreview}>
              <EyeOutlined />
              <span>预览</span>
            </button>
            <button
              className={style['draft-btn']}
              onClick={handleSaveDraft}
              disabled={saving}
            >
              <SaveOutlined />
              <span>{saving ? '保存中...' : '保存草稿'}</span>
            </button>
            <button
              className={style['publish-btn']}
              onClick={handlePublish}
              disabled={saving}
            >
              <SaveOutlined />
              <span>{saving ? '发布中...' : '发布文章'}</span>
            </button>
          </div>
        </div>

        {/* 主体内容区 */}
        <div className={style['write-body']}>
          {/* 左侧编辑区 */}
          <div className={style['editor-column']}>
            {/* 文章简介 */}
            <div className={style['editor-card']}>
              <label className={style['card-label']}>文章简介</label>
              <textarea
                placeholder="请输入文章摘要或简介..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={style['summary-textarea']}
                maxLength={500}
              />
            </div>

            {/* Tiptap 编辑器 */}
            <div className={style['editor-wrapper']}>
              <TiptapEditor
                initialContent={initialContent}
                placeholder="在这里开始撰写正文..."
                onChange={handleEditorChange}
                minHeight={400}
              />
            </div>
          </div>

          {/* 右侧设置区 */}
          <div className={style['settings-column']}>
            {/* 发布设置 */}
            <div className={style['settings-card']}>
              <div className={style['card-header']}>
                <GlobalOutlined className={style['header-icon']} />
                <span>发布设置</span>
              </div>
              <div className={style['card-body']}>
                {/* 开关设置 */}
                <div className={style['form-item']}>
                  <div className={style['switch-row']}>
                    <div className={style['switch-item']}>
                      <button
                        className={`${style['switch-btn']} ${isTop ? style['switch-active'] : ''}`}
                        onClick={() => setIsTop(!isTop)}
                      >
                        <span className={style['switch-handle']} />
                      </button>
                      <span
                        className={style['switch-label']}
                        onClick={() => setIsTop(!isTop)}
                      >
                        置顶文章
                      </span>
                    </div>
                    <div className={style['switch-item']}>
                      <button
                        className={`${style['switch-btn']} ${style['switch-hot']} ${isHot ? style['switch-active'] : ''}`}
                        onClick={() => setIsHot(!isHot)}
                      >
                        <span className={style['switch-handle']} />
                      </button>
                      <span
                        className={style['switch-label']}
                        onClick={() => setIsHot(!isHot)}
                      >
                        热门文章
                      </span>
                    </div>
                  </div>
                </div>

                {/* 分类专栏 */}
                <div className={style['form-item']}>
                  <label className={style['form-label']}>
                    <FolderOutlined />
                    <span>分类专栏</span>
                  </label>
                  <div className={style['category-select-wrapper']}>
                    <div
                      className={`${style['category-select-box']} ${showCategoryDropdown ? style['focused'] : ''}`}
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                      <span className={getSelectedCategoryName() ? style['category-value'] : style['category-placeholder']}>
                        {getSelectedCategoryName()?.name || '请选择分类'}
                      </span>
                      <span className={style['category-arrow']}>
                        <DownOutlined />
                      </span>
                    </div>

                    {/* 下拉列表 */}
                    {showCategoryDropdown && (
                      <>
                        <div
                          className={style['category-dropdown-overlay']}
                          onClick={() => setShowCategoryDropdown(false)}
                        />
                        <div className={style['category-dropdown']}>
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <div
                                key={cat.id}
                                className={`${style['category-option']} ${categoryId === cat.id ? style['selected'] : ''}`}
                                onClick={() => handleSelectCategory(cat.id!)}
                              >
                                {cat.name}
                              </div>
                            ))
                          ) : (
                            <div className={style['category-empty']}>暂无分类</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 标签 */}
                <div className={style['form-item']}>
                  <label className={style['form-label']}>
                    <NumberOutlined />
                    <span>标签</span>
                  </label>
                  <div className={style['tag-input-wrapper']}>
                    <div
                      className={`${style['tag-input-box']} ${showTagDropdown ? style['focused'] : ''}`}
                      onClick={() => setShowTagDropdown(true)}
                    >
                      {getSelectedTagNames().map((tag) => (
                        <span key={tag.id} className={style['tag-item']}>
                          {tag.name}
                          <button
                            className={style['tag-remove']}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveTag(tag.id!)
                            }}
                          >
                            <CloseOutlined />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder={selectedTagIds.length === 0 ? '请选择标签' : ''}
                        value={tagInput}
                        onChange={(e) => {
                          setTagInput(e.target.value)
                          setShowTagDropdown(true)
                        }}
                        onFocus={() => setShowTagDropdown(true)}
                        className={style['tag-input']}
                      />
                    </div>

                    {/* 下拉列表 */}
                    {showTagDropdown && (
                      <>
                        <div
                          className={style['tag-dropdown-overlay']}
                          onClick={() => setShowTagDropdown(false)}
                        />
                        <div className={style['tag-dropdown']}>
                          {filteredTags.length > 0 ? (
                            filteredTags.map((tag) => (
                              <div
                                key={tag.id}
                                className={style['tag-option']}
                                onClick={() => handleSelectTag(tag.id!)}
                              >
                                {tag.name}
                              </div>
                            ))
                          ) : (
                            <div className={style['tag-empty']}>无匹配标签</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  )
}

export default memo(Write)
