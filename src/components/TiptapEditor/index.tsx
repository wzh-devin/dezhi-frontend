/**
 * 2025/12/27.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description Tiptap 富文本编辑器组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useEffect, useCallback } from 'react'
import type { FC } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import TurndownService from 'turndown'
import { marked } from 'marked'
import EditorToolbar from './EditorToolbar'
import style from './index.less'

// 创建 lowlight 实例用于代码高亮
const lowlight = createLowlight(common)

// 初始化 Turndown 服务用于 HTML 转 Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '*',
})

// 自定义规则：处理高亮
turndownService.addRule('highlight', {
  filter: 'mark',
  replacement: (content) => `==${content}==`,
})

// 自定义规则：处理上标
turndownService.addRule('superscript', {
  filter: 'sup',
  replacement: (content) => `^${content}^`,
})

// 自定义规则：处理下标
turndownService.addRule('subscript', {
  filter: 'sub',
  replacement: (content) => `~${content}~`,
})

// 自定义规则：处理下划线
turndownService.addRule('underline', {
  filter: 'u',
  replacement: (content) => `<u>${content}</u>`,
})

// 自定义规则：处理表格
turndownService.addRule('table', {
  filter: 'table',
  replacement: function (content, node) {
    const table = node as HTMLTableElement
    const rows = Array.from(table.rows)
    if (rows.length === 0) return content

    let markdown = '\n'
    
    // 处理表头
    const headerRow = rows[0]
    const headerCells = Array.from(headerRow.cells)
    markdown += '| ' + headerCells.map(cell => cell.textContent?.trim() || '').join(' | ') + ' |\n'
    markdown += '| ' + headerCells.map(() => '---').join(' | ') + ' |\n'
    
    // 处理表格内容
    for (let i = 1; i < rows.length; i++) {
      const cells = Array.from(rows[i].cells)
      markdown += '| ' + cells.map(cell => cell.textContent?.trim() || '').join(' | ') + ' |\n'
    }
    
    return markdown + '\n'
  }
})

// 检测文本是否为 Markdown 格式
const isMarkdown = (text: string): boolean => {
  const markdownPatterns = [
    /^#{1,6}\s/m,           // 标题
    /\*\*[^*]+\*\*/,        // 粗体
    /\*[^*]+\*/,            // 斜体
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
}

// 将 Markdown 转换为 HTML
const markdownToHtml = (markdown: string): string => {
  return marked.parse(markdown, { async: false }) as string
}

export interface EditorContent {
  /** HTML 格式内容 */
  html: string
  /** Markdown 格式内容 */
  markdown: string
  /** 纯文本内容 */
  text: string
}

export interface TiptapEditorProps {
  /** 初始内容（HTML 格式） */
  initialContent?: string
  /** 占位符文本 */
  placeholder?: string
  /** 内容变化回调 */
  onChange?: (content: EditorContent) => void
  /** 编辑器高度 */
  minHeight?: number
  /** 是否只读 */
  readOnly?: boolean
  /** 自定义类名 */
  className?: string
}

const TiptapEditor: FC<TiptapEditorProps> = ({
  initialContent = '',
  placeholder = '在这里开始撰写正文...',
  onChange,
  minHeight = 400,
  readOnly = false,
  className = '',
}) => {
  // 初始化编辑器
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        codeBlock: false, // 使用 CodeBlockLowlight 替代
      }),
      Underline,
      Highlight.configure({
        multicolor: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Superscript,
      Subscript,
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      // 表格支持
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      // 代码块高亮
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onChange) {
        const html = editor.getHTML()
        const text = editor.getText()
        const markdown = turndownService.turndown(html)
        onChange({ html, markdown, text })
      }
    },
  })

  // 当 initialContent 变化时更新编辑器内容
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent)
    }
  }, [editor, initialContent])

  // 当 readOnly 变化时更新编辑器状态
  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnly)
    }
  }, [editor, readOnly])

  // 获取当前内容
  const getContent = useCallback((): EditorContent | null => {
    if (!editor) return null
    const html = editor.getHTML()
    const text = editor.getText()
    const markdown = turndownService.turndown(html)
    return { html, markdown, text }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`${style['tiptap-editor']} ${className}`}>
      <EditorToolbar editor={editor} />
      <div
        className={style['editor-content-wrapper']}
        style={{ minHeight: `${minHeight}px` }}
      >
        <EditorContent editor={editor} className={style['editor-content']} />
      </div>
    </div>
  )
}

export default memo(TiptapEditor)
