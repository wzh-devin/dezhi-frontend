<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { Editor } from '@tiptap/vue-3'
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

interface Props {
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void

  (e: 'ready', editor: Editor): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<Emits>()

const editor = ref<Editor | null>(null)
const loading = ref(true)
const editorId = ref(`tiptap-editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

// 创建 lowlight 实例
const lowlight = createLowlight()

// 异步加载常用编程语言
const handleLoadLanguages = async () => {
  try {
    const [javascript, typescript, css, html, json, python, java, cpp, bash] = await Promise.all([
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/typescript'),
      import('highlight.js/lib/languages/css'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/json'),
      import('highlight.js/lib/languages/python'),
      import('highlight.js/lib/languages/java'),
      import('highlight.js/lib/languages/cpp'),
      import('highlight.js/lib/languages/bash'),
    ])

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

// 初始化编辑器
const handleInitEditor = async () => {
  try {
    await handleLoadLanguages()

    const editorInstance = new Editor({
      element: document.querySelector(`#${editorId.value}`)!,
      editorProps: {
        handleKeyDown: (view, event) => {
          const { state } = view
          const { $from } = state.selection

          if ($from.parent.type.name === 'codeBlock') {
            if (event.key === 'Tab') {
              event.preventDefault()

              if (event.shiftKey) {
                const { from } = state.selection
                const textBefore = state.doc.textBetween(Math.max(0, from - 2), from)
                if (textBefore === '  ') {
                  const tr = state.tr.delete(from - 2, from)
                  view.dispatch(tr)
                }
              } else {
                const tr = state.tr.insertText('  ')
                view.dispatch(tr)
              }
              return true
            }
          }
          return false
        },
      },
      extensions: [
        StarterKit.configure({
          codeBlock: false,
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
        CodeBlockLowlight.configure({
          lowlight,
          defaultLanguage: 'javascript',
        }),
        Placeholder.configure({
          placeholder: '开始撰写你的文章...',
        }),
      ],
      content: props.modelValue,
      onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML())
      },
    })

    editor.value = editorInstance
    loading.value = false
    emit('ready', editorInstance)
  } catch (error) {
    console.error('Tiptap 编辑器初始化失败:', error)
    loading.value = false
  }
}

// 监听props变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue || '', { emitUpdate: false })
    }
  },
  { immediate: false },
)

onMounted(() => {
  setTimeout(async () => {
    await handleInitEditor()
  }, 100)
})

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy()
  }
})

defineExpose({
  editor,
})
</script>

<template>
  <div class="editor-container">
    <div v-if="loading" class="loading-container">
      <ASpin size="large" />
      <p>编辑器加载中...</p>
    </div>
    <div v-show="!loading" class="tiptap-editor">
      <div :id="editorId" class="tiptap-editor-content"></div>
    </div>
  </div>
</template>

<style scoped lang="less">
.editor-container {
  border: 1px solid #e1e5e9;
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

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

      p.is-editor-empty:first-child::before {
        color: #9ca3af;
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
        font-style: italic;
      }

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

      p {
        margin: 0 0 16px 0;
        line-height: 1.6;
      }

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
        background: rgba(24, 144, 255, 0.15);
        color: #1890ff;
        padding: 2px 4px;
        border-radius: 3px;
        font-weight: 500;
      }
    }
  }
}
</style>
