<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 撰写文章
 * @version 1.0
 * @since 1.0
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Placeholder from '@tiptap/extension-placeholder'
import { createLowlight } from 'lowlight'

// 创建 lowlight 实例并注册常用语言
const lowlight = createLowlight()

// 异步加载常用编程语言
const loadLanguages = async () => {
  try {
    // 动态导入常用编程语言
    const [javascript, typescript, css, html, json, python, java, cpp, bash] = await Promise.all([
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/css'),
      import('highlight.js/lib/languages/xml'), // xml 包含 html
      import('highlight.js/lib/languages/json'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/java'),
      import('highlight.js/lib/languages/cpp'),
      import('highlight.js/lib/languages/bash'),
    ])

    // 注册语言
    lowlight.register('javascript', javascript.default)
    lowlight.register('js', javascript.default)
    lowlight.register('typescript', typescript.default)
    lowlight.register('ts', typescript.default)
    lowlight.register('css', css.default)
    lowlight.register('html', html.default)
    lowlight.register('xml', html.default)
    lowlight.register('json', json.default)
    lowlight.register('python', python.default)
    lowlight.register('py', python.default)
    lowlight.register('java', java.default)
    lowlight.register('cpp', cpp.default)
    lowlight.register('c++', cpp.default)
    lowlight.register('bash', bash.default)
    lowlight.register('shell', bash.default)
  } catch (error) {
    console.warn('加载语言包失败:', error)
  }
}

// Tiptap 编辑器实例
const editor = ref<Editor | null>(null)
const content = ref('')
const loading = ref(true)
const showMarkdownModal = ref(false)
const showSaveModal = ref(false)

// 文章表单数据
const articleForm = ref({
  title: '',
  category: '',
  tags: [],
  status: 'draft',
})

// 初始化编辑器
const initEditor = async () => {
  try {
    // 先加载语言包
    await loadLanguages()

    editor.value = new Editor({
      element: document.querySelector('#tiptap-editor')!,
      extensions: [
        StarterKit.configure({
          // 禁用默认的代码块，使用带高亮的版本
          codeBlock: false,
          // 配置标题级别以支持所有级别
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Highlight,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
        Underline,
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
        Link.configure({
          openOnClick: false,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        // 添加代码高亮扩展
        CodeBlockLowlight.configure({
          lowlight,
          defaultLanguage: 'javascript',
        }),
        // 添加占位符扩展
        Placeholder.configure({
          placeholder: '开始撰写你的文章...',
        }),
      ],
      content: '',
      onUpdate: ({ editor }) => {
        content.value = editor.getHTML()
      },
    })

    loading.value = false
  } catch (error) {
    console.error('Tiptap 编辑器初始化失败:', error)
    message.error('编辑器初始化失败，请刷新页面重试')
    loading.value = false
  }
}

// 工具栏功能函数
const toggleBold = () => editor.value?.chain().focus().toggleBold().run()
const toggleItalic = () => editor.value?.chain().focus().toggleItalic().run()
const toggleUnderline = () => editor.value?.chain().focus().toggleUnderline().run()
const toggleStrike = () => editor.value?.chain().focus().toggleStrike().run()
const toggleHighlight = () => editor.value?.chain().focus().toggleHighlight().run()

const setHeading = (level: number) => {
  if (level === 0) {
    editor.value?.chain().focus().setParagraph().run()
  } else {
    editor.value
      ?.chain()
      .focus()
      .toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 })
      .run()
  }
}

const toggleBulletList = () => {
  console.log('toggleBulletList called')
  editor.value?.chain().focus().toggleBulletList().run()
}
const toggleOrderedList = () => {
  console.log('toggleOrderedList called')
  editor.value?.chain().focus().toggleOrderedList().run()
}
const toggleBlockquote = () => editor.value?.chain().focus().toggleBlockquote().run()
const toggleCodeBlock = () => editor.value?.chain().focus().toggleCodeBlock().run()

const setTextAlign = (alignment: string) => {
  editor.value?.chain().focus().setTextAlign(alignment).run()
}

const insertImage = () => {
  const url = window.prompt('请输入图片URL:')
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run()
  }
}

const insertLink = () => {
  const url = window.prompt('请输入链接URL:')
  if (url) {
    editor.value?.chain().focus().setLink({ href: url }).run()
  }
}

const undo = () => editor.value?.chain().focus().undo().run()
const redo = () => editor.value?.chain().focus().redo().run()

const getContent = () => {
  return editor.value?.getHTML() || ''
}

const saveArticle = () => {
  showSaveModal.value = true
}

const confirmSaveArticle = () => {
  const articleContent = getContent()
  const saveData = {
    title: articleForm.value.title,
    content: articleContent,
    category: articleForm.value.category,
    tags: articleForm.value.tags,
    status: articleForm.value.status,
  }

  console.log('保存文章数据:', saveData)
  message.success('文章保存成功')
  showSaveModal.value = false
}

const cancelSave = () => {
  showSaveModal.value = false
}

// Markdown 帮助提示
const showMarkdownHelp = () => {
  showMarkdownModal.value = true
}

const closeMarkdownHelp = () => {
  showMarkdownModal.value = false
}

onMounted(() => {
  // 使用 nextTick 确保 DOM 元素已经渲染
  setTimeout(async () => {
    await initEditor()
  }, 100)
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})
</script>

<template>
  <div class="write-article-container">
    <div class="article-header">
      <!-- 文章标题 -->
      <div class="form-item">
        <a-input v-model:value="articleForm.title" placeholder="请输入文章标题" size="large" />
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="saveArticle">保存文章</a-button>
      </div>
    </div>

    <div class="article-form">
      <!-- 富文本编辑器 -->
      <div class="form-item">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <a-spin size="large" />
          <p>编辑器加载中...</p>
        </div>

        <!-- 编辑器工具栏 -->
        <div v-else class="editor-toolbar">
          <!-- 撤销/重做 -->
          <div class="toolbar-group">
            <button @click="undo" class="toolbar-btn" title="撤销">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
              </svg>
            </button>
            <button @click="redo" class="toolbar-btn" title="重做">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 919-9 9 9 0 016 2.3l3-2.3" />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 标题样式 -->
          <div class="toolbar-group">
            <a-select @change="setHeading" placeholder="H1" size="middle" class="heading-select" :bordered="false">
              <a-select-option :value="0">正文</a-select-option>
              <a-select-option :value="1">H1</a-select-option>
              <a-select-option :value="2">H2</a-select-option>
              <a-select-option :value="3">H3</a-select-option>
            </a-select>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 列表 -->
          <div class="toolbar-group">
            <button @click="toggleBulletList" class="toolbar-btn" title="无序列表">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
            <button @click="toggleOrderedList" class="toolbar-btn" title="有序列表">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="10" y1="6" x2="21" y2="6" />
                <line x1="10" y1="12" x2="21" y2="12" />
                <line x1="10" y1="18" x2="21" y2="18" />
                <path d="M4 6h1v4" />
                <path d="M4 10h2" />
                <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 快捷格式 -->
          <div class="toolbar-group">
            <button @click="toggleBlockquote" class="toolbar-btn" title="引用">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
                />
                <path
                  d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
                />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 文本格式 -->
          <div class="toolbar-group">
            <button @click="toggleBold" class="toolbar-btn" title="粗体">
              <strong style="font-size: 14px; font-weight: 700">B</strong>
            </button>
            <button @click="toggleItalic" class="toolbar-btn" title="斜体">
              <em style="font-size: 14px; font-style: italic">I</em>
            </button>
            <button @click="toggleUnderline" class="toolbar-btn" title="下划线">
              <span style="font-size: 14px; text-decoration: underline">U</span>
            </button>
            <button @click="toggleStrike" class="toolbar-btn" title="删除线">
              <span style="font-size: 14px; text-decoration: line-through">S</span>
            </button>
            <button @click="toggleHighlight" class="toolbar-btn" title="高亮">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4" />
                <path d="M11 13.5V21c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-7.5" />
                <path d="M11 4H9L7 2 5 4h2" />
                <circle cx="12" cy="9" r="3" />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 对齐方式 -->
          <div class="toolbar-group">
            <button @click="setTextAlign('left')" class="toolbar-btn" title="左对齐">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="17" y1="10" x2="3" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="17" y1="18" x2="3" y2="18" />
              </svg>
            </button>
            <button @click="setTextAlign('center')" class="toolbar-btn" title="居中">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="10" x2="6" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="18" y1="18" x2="6" y2="18" />
              </svg>
            </button>
            <button @click="setTextAlign('right')" class="toolbar-btn" title="右对齐">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="21" y1="10" x2="7" y2="10" />
                <line x1="21" y1="6" x2="3" y2="6" />
                <line x1="21" y1="14" x2="3" y2="14" />
                <line x1="21" y1="18" x2="7" y2="18" />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- 插入 -->
          <div class="toolbar-group">
            <button @click="insertLink" class="toolbar-btn" title="插入链接">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
            <button @click="insertImage" class="toolbar-btn" title="插入图片">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
            <button @click="toggleCodeBlock" class="toolbar-btn" title="代码块">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16,18 22,12 16,6" />
                <polyline points="8,6 2,12 8,18" />
              </svg>
            </button>
          </div>

          <div class="toolbar-divider"></div>

          <!-- Markdown 帮助 -->
          <div class="toolbar-group">
            <button @click="showMarkdownHelp" class="toolbar-btn" title="Markdown 快捷键帮助">
              <span style="font-size: 16px; font-weight: 600; color: inherit">?</span>
            </button>
          </div>
        </div>

        <!-- Tiptap 编辑器容器 -->
        <div v-show="!loading" class="editor-container">
          <div id="tiptap-editor" class="tiptap-editor"></div>
        </div>
      </div>
    </div>

    <!-- Markdown 帮助弹窗 -->
    <a-modal
      v-model:open="showMarkdownModal"
      title="📝 支持的 Markdown 快捷键"
      :footer="null"
      width="600px"
      @cancel="closeMarkdownHelp"
    >
      <div class="markdown-help-content">
        <div class="help-section">
          <h4>📋 标题</h4>
          <div class="help-example">
            <code># 一级标题</code><br />
            <code>## 二级标题</code><br />
            <code>### 三级标题</code>
          </div>
        </div>

        <div class="help-section">
          <h4>🎨 文本格式</h4>
          <div class="help-example">
            <code>**粗体** 或 __粗体__</code><br />
            <code>*斜体* 或 _斜体_</code><br />
            <code>~~删除线~~</code><br />
            <code>`行内代码`</code>
          </div>
        </div>

        <div class="help-section">
          <h4>📝 列表</h4>
          <div class="help-example">
            <code>- 无序列表项</code><br />
            <code>* 也是无序列表</code><br />
            <code>1. 有序列表项</code><br />
            <code>2. 继续编号</code>
          </div>
        </div>

        <div class="help-section">
          <h4>🔗 其他</h4>
          <div class="help-example">
            <code>&gt; 引用文本</code><br />
            <code>--- 或 *** (分隔线)</code><br />
            <code>```javascript (代码块)</code>
          </div>
        </div>

        <div class="help-tip">💡 <strong>提示：</strong>输入这些符号后按空格即可自动转换！</div>
      </div>
    </a-modal>

    <!-- 保存文章设置弹窗 -->
    <a-modal
      v-model:open="showSaveModal"
      title="📝 保存文章设置"
      width="600px"
      @ok="confirmSaveArticle"
      @cancel="cancelSave"
      ok-text="保存文章"
      cancel-text="取消"
    >
      <div class="save-modal-content">
        <div class="form-item">
          <label>文章标题</label>
          <a-input v-model:value="articleForm.title" placeholder="请输入文章标题" size="large" />
        </div>

        <div class="form-item">
          <label>分类</label>
          <a-select v-model:value="articleForm.category" placeholder="选择分类" style="width: 100%" size="large">
            <a-select-option value="tech">技术</a-select-option>
            <a-select-option value="life">生活</a-select-option>
            <a-select-option value="thoughts">感悟</a-select-option>
          </a-select>
        </div>

        <div class="form-item">
          <label>标签</label>
          <a-select
            v-model:value="articleForm.tags"
            mode="tags"
            placeholder="选择或输入标签"
            style="width: 100%"
            size="large"
          >
            <a-select-option value="Vue">Vue</a-select-option>
            <a-select-option value="JavaScript">JavaScript</a-select-option>
            <a-select-option value="TypeScript">TypeScript</a-select-option>
            <a-select-option value="React">React</a-select-option>
            <a-select-option value="Node.js">Node.js</a-select-option>
          </a-select>
        </div>

        <div class="form-item">
          <label>状态</label>
          <a-radio-group v-model:value="articleForm.status" size="large">
            <a-radio value="draft">草稿</a-radio>
            <a-radio value="published">发布</a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped lang="less">
.write-article-container {
  padding: 24px;
  background: #fff;
  min-height: 100vh;

  .article-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    width: 100%;

    .form-item {
      flex: 1;
      margin-bottom: 0;
      margin-right: 16px;
    }

    h1 {
      margin: 0;
      color: #262626;
    }
  }

  .article-form {
    width: 100%;

    .form-item {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #262626;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 0;
      color: #999;

      p {
        margin-top: 16px;
        margin-bottom: 0;
      }
    }

    .editor-toolbar {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #ffffff;
      border: 1px solid #e1e5e9;
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      gap: 2px;
      min-height: 44px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      .toolbar-group {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      .toolbar-divider {
        width: 1px;
        height: 20px;
        background: #e1e5e9;
        margin: 0 6px;
      }

      .toolbar-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: 1px solid transparent;
        background: #ffffff;
        border-radius: 6px;
        color: #374151;
        cursor: pointer;
        transition: all 0.15s ease;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;

        &:hover {
          background: #f8fafc;
          border-color: #d1d5db;
          color: #111827;
        }

        &:active {
          background: #f1f5f9;
          border-color: #9ca3af;
          color: #111827;
          transform: translateY(1px);
        }

        svg {
          display: block;
          width: 16px;
          height: 16px;
        }
      }

      .heading-select {
        min-width: 70px;

        :deep(.ant-select-selector) {
          border: 1px solid transparent !important;
          box-shadow: none !important;
          background: #ffffff !important;
          height: 32px;
          line-height: 32px;
          padding: 0 8px;
          border-radius: 6px;
          transition: all 0.15s ease;

          .ant-select-selection-item {
            line-height: 30px;
            font-size: 14px;
            color: #374151;
            font-weight: 500;
          }

          .ant-select-selection-placeholder {
            line-height: 30px;
            font-size: 14px;
            color: #6b7280;
            font-weight: 500;
          }
        }

        :deep(.ant-select-arrow) {
          color: #6b7280;
        }

        &:hover {
          :deep(.ant-select-selector) {
            background: #f8fafc !important;
            border-color: #d1d5db !important;
          }
        }

        &.ant-select-focused {
          :deep(.ant-select-selector) {
            background: #f1f5f9 !important;
            border-color: #9ca3af !important;
          }
        }
      }
    }

    .editor-container {
      border: 1px solid #e1e5e9;
      border-top: none;
      border-radius: 0 0 8px 8px;
      overflow: hidden;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      .tiptap-editor {
        min-height: 500px;
        padding: 20px 24px;
        outline: none;
        background: #ffffff;

        :deep(.ProseMirror) {
          outline: none;
          min-height: 500px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: #1f2937;

          // 占位符样式
          p.is-editor-empty:first-child::before {
            color: #9ca3af;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
            font-style: italic;
          }

          // 强制覆盖可能的CSS重置，确保列表样式正确显示
          ul,
          ol {
            list-style: revert !important;
            margin: 16px 0 !important;
            padding-left: 24px !important;
          }

          ul {
            list-style-type: disc !important;
          }

          ol {
            list-style-type: decimal !important;
          }

          li {
            display: list-item !important;
            list-style-position: outside !important;
            margin: 4px 0 !important;
          }

          // 重置可能影响列表的样式
          * {
            box-sizing: border-box;
          }

          p {
            margin: 0 0 16px 0;
            line-height: 1.6;
          }

          // 标题样式 - 设置合理的层级关系（紧凑间距）
          h1 {
            font-size: 28px;
            font-weight: 700;
            margin: 24px 0 12px 0;
            line-height: 1.3;
            color: #1a202c;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 6px;
          }

          h2 {
            font-size: 22px;
            font-weight: 600;
            margin: 20px 0 10px 0;
            line-height: 1.4;
            color: #2d3748;
          }

          h3 {
            font-size: 18px;
            font-weight: 600;
            margin: 16px 0 8px 0;
            line-height: 1.4;
            color: #2d3748;
          }

          h4 {
            font-size: 16px;
            font-weight: 600;
            margin: 14px 0 6px 0;
            line-height: 1.5;
            color: #4a5568;
          }

          h5 {
            font-size: 14px;
            font-weight: 600;
            margin: 12px 0 4px 0;
            line-height: 1.5;
            color: #4a5568;
          }

          h6 {
            font-size: 13px;
            font-weight: 600;
            margin: 10px 0 2px 0;
            line-height: 1.5;
            color: #718096;
          }

          ul,
          ol {
            margin: 16px 0;
            padding-left: 24px;
          }

          ul {
            list-style-type: disc;
          }

          ol {
            list-style-type: decimal;
          }

          li {
            margin: 4px 0;
            list-style-position: outside;
          }

          ul > li {
            list-style-type: disc !important;
            display: list-item !important;
          }

          ol > li {
            list-style-type: decimal !important;
            display: list-item !important;
          }

          // 确保嵌套列表也能正确显示
          ul ul > li {
            list-style-type: circle !important;
          }

          ul ul ul > li {
            list-style-type: square !important;
          }

          blockquote {
            margin: 24px 0;
            padding: 16px 20px;
            border-left: 4px solid #3b82f6;
            background: #f8fafc;
            color: #64748b;
            font-style: italic;
            border-radius: 0 8px 8px 0;
            line-height: 1.6;
            position: relative;

            // 确保文本垂直居中
            display: flex;
            align-items: center;
            min-height: 48px;

            p {
              margin: 0;
              flex: 1;
            }
          }

          pre {
            background: #1e293b;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 20px;
            overflow-x: auto;
            margin: 24px 0;
            position: relative;

            code {
              background: none;
              padding: 0;
              color: #e2e8f0;
              font-size: 14px;
              font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
            }

            // 添加语言标签样式
            &::before {
              content: attr(data-language);
              position: absolute;
              top: 8px;
              right: 12px;
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            // 代码高亮样式
            .hljs-comment,
            .hljs-quote {
              color: #64748b;
              font-style: italic;
            }

            .hljs-keyword,
            .hljs-selector-tag,
            .hljs-addition {
              color: #f472b6;
            }

            .hljs-number,
            .hljs-string,
            .hljs-meta .hljs-string,
            .hljs-literal,
            .hljs-doctag,
            .hljs-regexp {
              color: #34d399;
            }

            .hljs-title,
            .hljs-section,
            .hljs-name,
            .hljs-selector-id,
            .hljs-selector-class {
              color: #60a5fa;
            }

            .hljs-attribute,
            .hljs-attr,
            .hljs-variable,
            .hljs-template-variable,
            .hljs-class .hljs-title,
            .hljs-type {
              color: #fbbf24;
            }

            .hljs-symbol,
            .hljs-bullet,
            .hljs-subst,
            .hljs-meta,
            .hljs-meta .hljs-keyword,
            .hljs-selector-attr,
            .hljs-selector-pseudo,
            .hljs-link {
              color: #f87171;
            }

            .hljs-built_in,
            .hljs-deletion {
              color: #ef4444;
            }

            .hljs-formula {
              background: #374151;
            }

            .hljs-emphasis {
              font-style: italic;
            }

            .hljs-strong {
              font-weight: bold;
            }
          }

          code {
            background: #f6f8fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
          }

          img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
          }

          hr {
            margin: 24px 0;
            border: none;
            border-top: 2px solid #e8e8e8;
          }

          table {
            border-collapse: collapse;
            margin: 16px 0;
            width: 100%;

            td,
            th {
              border: 1px solid #d9d9d9;
              padding: 8px 12px;
              text-align: left;
            }

            th {
              background: #fafafa;
              font-weight: 600;
            }
          }

          a {
            color: #1890ff;
            text-decoration: none;

            &:hover {
              text-decoration: underline;
            }
          }

          mark {
            background: #fff566;
            padding: 0 2px;
          }
        }
      }
    }

    .article-settings {
      .setting-row {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        span {
          min-width: 60px;
          margin-right: 12px;
          color: #595959;
        }
      }
    }
  }

  // Markdown 帮助弹窗样式
  .markdown-help-content {
    .help-section {
      margin-bottom: 24px;

      h4 {
        margin: 0 0 12px 0;
        color: #374151;
        font-size: 16px;
        font-weight: 600;
      }

      .help-example {
        background: #f8fafc;
        padding: 12px 16px;
        border-radius: 6px;
        border-left: 4px solid #3b82f6;

        code {
          display: inline-block;
          background: #e2e8f0;
          color: #1e293b;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 13px;
          margin: 2px 0;
        }

        br {
          line-height: 1.8;
        }
      }
    }

    .help-tip {
      background: #f0f9ff;
      border: 1px solid #0ea5e9;
      border-radius: 8px;
      padding: 16px;
      color: #0c4a6e;
      font-size: 14px;
      text-align: center;

      strong {
        color: #075985;
      }
    }
  }

  // 保存文章设置弹窗样式
  .save-modal-content {
    .form-item {
      margin-bottom: 24px;

      label {
        display: block;
        margin-bottom: 8px;
        color: #374151;
        font-size: 14px;
        font-weight: 500;
      }

      :deep(.ant-input),
      :deep(.ant-select-selector),
      :deep(.ant-radio-group) {
        border-radius: 8px;
      }

      :deep(.ant-select-selector) {
        border: 1px solid #d1d5db;

        &:hover {
          border-color: #3b82f6;
        }
      }

      :deep(.ant-radio-wrapper) {
        margin-right: 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
