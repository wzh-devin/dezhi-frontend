<template>
  <a-modal
    v-model:open="visible"
    title="上传文件"
    :width="600"
    :maskClosable="false"
    :destroyOnClose="true"
    @cancel="handleCancel"
  >
    <div class="upload-modal-content">
      <!-- 文件上传区域 -->
      <div
        class="upload-area"
        :class="{ 'drag-over': isDragOver }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="handleClickUpload"
      >
        <div class="upload-area-content">
          <div class="upload-icon">
            <CloudUploadOutlined />
          </div>
          <div class="upload-text">
            <p class="upload-hint">点击或拖拽图片到此区域上传</p>
            <p class="upload-sub-hint">仅支持PNG、JPG、GIF格式，单个或批量上传</p>
          </div>
        </div>
        <input
          ref="fileInputRef"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.gif"
          style="display: none"
          @change="handleFileSelect"
        />
      </div>

      <!-- 文件列表 -->
      <div v-if="fileList.length > 0" class="file-list">
        <div class="file-list-header">
          <span>文件列表 ({{ fileList.length }})</span>
          <a-button type="link" size="small" @click="clearFiles">清空</a-button>
        </div>
        <div class="file-items">
          <div
            v-for="(file, index) in fileList"
            :key="index"
            class="file-item"
            :class="{ 'upload-success': file.status === 'success', 'upload-error': file.status === 'error' }"
          >
            <div class="file-info">
              <div class="file-icon">
                <FileOutlined />
              </div>
              <div class="file-details">
                <div class="file-name">{{ file.name }}</div>
                <div class="file-size">{{ formatFileSize(file.size) }}</div>
              </div>
            </div>
            <div class="file-actions">
              <a-button v-if="file.status !== 'uploading'" type="link" size="small" danger @click="removeFile(index)">
                删除
              </a-button>
              <div v-if="file.status === 'uploading'" class="upload-progress">
                <a-progress :percent="file.progress" size="small" />
              </div>
              <div v-if="file.status === 'success'" class="upload-status success">
                <CheckCircleOutlined />
              </div>
              <div v-if="file.status === 'error'" class="upload-status error">
                <CloseCircleOutlined />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传提示 -->
      <div v-if="fileList.length === 0" class="upload-tips">
        <p>上传要求：</p>
        <ul>
          <li>仅支持图片格式：PNG、JPG、GIF</li>
          <li>单个文件大小不超过 10MB</li>
          <li>建议文件名使用英文或数字，避免特殊字符</li>
        </ul>
      </div>
    </div>

    <!-- 底部操作按钮 -->
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        type="primary"
        :loading="uploading"
        :disabled="fileList.length === 0 || uploading"
        @click="handleUpload"
      >
        {{ uploading ? '上传中...' : '确认上传' }}
      </a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { message } from 'ant-design-vue'
import { CloudUploadOutlined, FileOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import { upload } from '@/service/materialService'
import { errMsgExtract } from '@/global/string-format.ts'

// 定义组件属性
interface Props {
  visible?: boolean
}

// 定义组件事件
interface Emits {
  (e: 'update:visible', value: boolean): void

  (e: 'success'): void

  (e: 'cancel'): void
}

// 文件上传状态
interface FileItem {
  name: string
  size: number
  file: File
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  response?: unknown
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
})

const emit = defineEmits<Emits>()

// 响应式数据
const visible = ref(props.visible)
const isDragOver = ref(false)
const uploading = ref(false)
const fileList = reactive<FileItem[]>([])
const fileInputRef = ref<HTMLInputElement>()

// 监听属性变化
watch(
  () => props.visible,
  (newVal) => {
    visible.value = newVal
  },
)

watch(visible, (newVal) => {
  emit('update:visible', newVal)
})

// 处理拖拽悬停
const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = true
}

// 处理拖拽离开
const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false
}

// 处理文件拖拽放置
const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragOver.value = false

  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    handleFiles(Array.from(files))
  }
}

// 处理点击上传
const handleClickUpload = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFiles(Array.from(files))
  }
  // 清空输入框值，以便重复选择同一文件
  target.value = ''
}

// 处理文件
const handleFiles = (files: File[]) => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
  const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif']

  files.forEach((file) => {
    // 检查文件类型
    const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      message.error(`文件 ${file.name} 格式不支持，仅支持 PNG、JPG、GIF 格式`)
      return
    }

    // 检查文件大小
    if (file.size > maxSize) {
      message.error(`文件 ${file.name} 大小超过 10MB 限制`)
      return
    }

    // 检查是否已存在相同文件
    const existingFile = fileList.find((item) => item.name === file.name && item.size === file.size)
    if (existingFile) {
      message.warning(`文件 ${file.name} 已存在`)
      return
    }

    // 添加到文件列表
    fileList.push({
      name: file.name,
      size: file.size,
      file: file,
      status: 'pending',
      progress: 0,
    })
  })
}

// 移除文件
const removeFile = (index: number) => {
  fileList.splice(index, 1)
}

// 清空文件列表
const clearFiles = () => {
  if (uploading.value) {
    message.warning('正在上传中，无法清空文件列表')
    return
  }
  fileList.splice(0, fileList.length)
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 处理上传
const handleUpload = async () => {
  if (fileList.length === 0) {
    message.warning('请选择要上传的文件')
    return
  }

  uploading.value = true
  let successCount = 0
  let errorCount = 0

  // 并发上传文件
  const uploadPromises = fileList.map(async (fileItem) => {
    try {
      fileItem.status = 'uploading'
      fileItem.progress = 0

      const formData = new FormData()
      formData.append('material', fileItem.file)

      const response = await upload(formData)

      if (response.success) {
        fileItem.status = 'success'
        fileItem.progress = 100
        fileItem.response = response
        successCount++
      } else {
        fileItem.status = 'error'
        fileItem.error = response.errMsg || '上传失败'
        errorCount++
      }
    } catch (error) {
      fileItem.status = 'error'
      fileItem.error = '上传失败'
      errorCount++
      errMsgExtract(error)
    }
  })

  await Promise.all(uploadPromises)

  uploading.value = false

  // 显示上传结果
  if (successCount > 0 && errorCount === 0) {
    message.success(`成功上传 ${successCount} 个文件`)
    emit('success')
    handleCancel()
  } else if (successCount > 0 && errorCount > 0) {
    message.warning(`上传完成：成功 ${successCount} 个，失败 ${errorCount} 个`)
  } else {
    message.error('所有文件上传失败')
  }
}

// 处理取消
const handleCancel = () => {
  if (uploading.value) {
    message.warning('正在上传中，无法取消')
    return
  }

  visible.value = false
  fileList.splice(0, fileList.length)
  emit('cancel')
}

// 暴露方法给父组件
defineExpose({
  show: () => {
    visible.value = true
  },
  hide: () => {
    visible.value = false
  },
})
</script>

<style scoped lang="less">
.upload-modal-content {
  .upload-area {
    border: 2px dashed #d9d9d9;
    border-radius: 6px;
    background-color: #fafafa;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: #1677ff;
      background-color: #f0f8ff;
    }

    &.drag-over {
      border-color: #1677ff;
      background-color: #f0f8ff;
    }

    .upload-area-content {
      .upload-icon {
        font-size: 48px;
        color: #1677ff;
        margin-bottom: 16px;
      }

      .upload-text {
        .upload-hint {
          font-size: 16px;
          color: #262626;
          margin-bottom: 8px;
        }

        .upload-sub-hint {
          font-size: 14px;
          color: #8c8c8c;
          margin: 0;
        }
      }
    }
  }

  .file-list {
    margin-top: 24px;

    .file-list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-weight: 500;
      color: #262626;
    }

    .file-items {
      max-height: 300px;
      overflow-y: auto;

      .file-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #f0f0f0;
        border-radius: 6px;
        margin-bottom: 8px;
        transition: all 0.3s;

        &.upload-success {
          border-color: #52c41a;
          background-color: #f6ffed;
        }

        &.upload-error {
          border-color: #ff4d4f;
          background-color: #fff2f0;
        }

        .file-info {
          display: flex;
          align-items: center;
          flex: 1;

          .file-icon {
            font-size: 24px;
            color: #1677ff;
            margin-right: 12px;
          }

          .file-details {
            .file-name {
              font-weight: 500;
              color: #262626;
              margin-bottom: 4px;
              word-break: break-all;
            }

            .file-size {
              font-size: 12px;
              color: #8c8c8c;
            }
          }
        }

        .file-actions {
          display: flex;
          align-items: center;

          .upload-progress {
            width: 100px;
            margin-right: 8px;
          }

          .upload-status {
            font-size: 20px;
            margin-right: 8px;

            &.success {
              color: #52c41a;
            }

            &.error {
              color: #ff4d4f;
            }
          }
        }
      }
    }
  }

  .upload-tips {
    margin-top: 24px;
    padding: 16px;
    background-color: #f6f8fa;
    border-radius: 6px;

    p {
      margin: 0 0 8px 0;
      font-weight: 500;
      color: #262626;
    }

    ul {
      margin: 0;
      padding-left: 20px;
      color: #8c8c8c;

      li {
        margin-bottom: 4px;
      }
    }
  }
}
</style>
