<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const handleCancel = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <AModal :open="props.modelValue" title="📝 支持的 Markdown 快捷键" :footer="null" width="600px" @cancel="handleCancel">
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
  </AModal>
</template>

<style scoped lang="less">
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
</style>
