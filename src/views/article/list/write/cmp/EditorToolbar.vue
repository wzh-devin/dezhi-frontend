<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
defineEmits([
  'undo',
  'redo',
  'setHeading',
  'toggleBulletList',
  'toggleOrderedList',
  'toggleBlockquote',
  'toggleBold',
  'toggleItalic',
  'toggleUnderline',
  'toggleStrike',
  'toggleHighlight',
  'setTextAlign',
  'insertLink',
  'insertImage',
  'toggleCodeBlock',
  'showMarkdownHelp',
])
</script>

<template>
  <div class="editor-toolbar">
    <!-- 撤销/重做 -->
    <div class="toolbar-group">
      <button @click="$emit('undo')" class="toolbar-btn" title="撤销">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 7v6h6" />
          <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
        </svg>
      </button>
      <button @click="$emit('redo')" class="toolbar-btn" title="重做">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 7v6h-6" />
          <path d="M3 17a9 9 0 01 9-9 9 9 0 01 6 2.3l3-2.3" />
        </svg>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <!-- 标题样式 -->
    <div class="toolbar-group">
      <ASelect
        @change="$emit('setHeading', $event)"
        placeholder="H1"
        size="middle"
        class="heading-select"
        :bordered="false"
      >
        <ASelectOption :value="0">正文</ASelectOption>
        <ASelectOption :value="1">H1</ASelectOption>
        <ASelectOption :value="2">H2</ASelectOption>
        <ASelectOption :value="3">H3</ASelectOption>
      </ASelect>
    </div>

    <div class="toolbar-divider"></div>

    <!-- 列表 -->
    <div class="toolbar-group">
      <button @click="$emit('toggleBulletList')" class="toolbar-btn" title="无序列表">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>
      <button @click="$emit('toggleOrderedList')" class="toolbar-btn" title="有序列表">
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
      <button @click="$emit('toggleBlockquote')" class="toolbar-btn" title="引用">
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
      <button @click="$emit('toggleBold')" class="toolbar-btn" title="粗体">
        <strong style="font-size: 14px; font-weight: 700">B</strong>
      </button>
      <button @click="$emit('toggleItalic')" class="toolbar-btn" title="斜体">
        <em style="font-size: 14px; font-style: italic">I</em>
      </button>
      <button @click="$emit('toggleUnderline')" class="toolbar-btn" title="下划线">
        <span style="font-size: 14px; text-decoration: underline">U</span>
      </button>
      <button @click="$emit('toggleStrike')" class="toolbar-btn" title="删除线">
        <span style="font-size: 14px; text-decoration: line-through">S</span>
      </button>
      <button @click="$emit('toggleHighlight')" class="toolbar-btn" title="高亮">
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
      <button @click="$emit('setTextAlign', 'left')" class="toolbar-btn" title="左对齐">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="17" y1="10" x2="3" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="17" y1="18" x2="3" y2="18" />
        </svg>
      </button>
      <button @click="$emit('setTextAlign', 'center')" class="toolbar-btn" title="居中">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="10" x2="6" y2="10" />
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="14" x2="3" y2="14" />
          <line x1="18" y1="18" x2="6" y2="18" />
        </svg>
      </button>
      <button @click="$emit('setTextAlign', 'right')" class="toolbar-btn" title="右对齐">
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
      <button @click="$emit('insertLink')" class="toolbar-btn" title="插入链接">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>
      <button @click="$emit('insertImage')" class="toolbar-btn" title="插入图片">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </button>
      <button @click="$emit('toggleCodeBlock')" class="toolbar-btn" title="代码块">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16,18 22,12 16,6" />
          <polyline points="8,6 2,12 8,18" />
        </svg>
      </button>
    </div>

    <div class="toolbar-divider"></div>

    <!-- Markdown 帮助 -->
    <div class="toolbar-group">
      <button @click="$emit('showMarkdownHelp')" class="toolbar-btn" title="Markdown 快捷键帮助">
        <span style="font-size: 16px; font-weight: 600; color: inherit">?</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="less">
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
</style>
