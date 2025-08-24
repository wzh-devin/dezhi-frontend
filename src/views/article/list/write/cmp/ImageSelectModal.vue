<script setup lang="ts">
/**
 * 2025/7/26 0:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import { ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import useMaterialStore from '@/store/material'
import type { FileInfoVO } from '@/service/typings.ts'

interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', images: FileInfoVO[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const materialStore = useMaterialStore()

// 数据状态
const imageList = ref<FileInfoVO[]>([])
const imageLoading = ref(false)
const selectedImageIndexes = ref<number[]>([])

// 分页数据
const pagination = ref({
  current: 1,
  pageSize: 8,
  total: 0,
})

// 分页显示文本
const handlePaginationShowTotal = (total: number) => {
  const selectedCount = selectedImageIndexes.value.length
  return `共 ${total} 张图片${selectedCount > 0 ? ` · 已选中 ${selectedCount} 张` : ''}`
}

// 获取图片列表
const handleLoadImageList = async () => {
  imageLoading.value = true
  try {
    const result = await materialStore.getMaterialListAction({
      pageNum: pagination.value.current,
      pageSize: pagination.value.pageSize,
      status: 'NORMAL',
    })
    imageList.value = result.data as FileInfoVO[]
    pagination.value.total = Number(result.addition?.total || 0)
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : '获取图片列表失败'
    message.error(errorMessage)
  } finally {
    imageLoading.value = false
  }
}

// 分页变化处理
const handlePageChange = (page: number) => {
  pagination.value.current = page
  selectedImageIndexes.value = []
  handleLoadImageList()
}

// 多选图片处理函数
const handleSelectImage = (image: FileInfoVO, index: number) => {
  console.log(image)
  if (selectedImageIndexes.value.includes(index)) {
    selectedImageIndexes.value = selectedImageIndexes.value.filter((i) => i !== index)
  } else {
    selectedImageIndexes.value.push(index)
  }
}

// 确认选择
const handleConfirm = () => {
  if (selectedImageIndexes.value.length > 0) {
    const selectedImages = imageList.value.filter((_, index) => selectedImageIndexes.value.includes(index))
    emit('confirm', selectedImages)
  }
  emit('update:modelValue', false)
  selectedImageIndexes.value = []
}

// 取消选择
const handleCancel = () => {
  emit('update:modelValue', false)
  selectedImageIndexes.value = []
}

// 监听弹窗显示状态
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      selectedImageIndexes.value = []
      pagination.value.current = 1
      handleLoadImageList()
    }
  },
)
</script>

<template>
  <AModal
    :open="modelValue"
    title="📷 选择图片"
    width="1000px"
    :ok-text="selectedImageIndexes.length > 0 ? '插入图片' : '请先选择图片'"
    cancel-text="取消"
    :ok-button-props="{ disabled: selectedImageIndexes.length === 0 }"
    :body-style="{ padding: '20px' }"
    @ok="handleConfirm"
    @cancel="handleCancel"
  >
    <div class="image-select-content">
      <ASpin :spinning="imageLoading">
        <div v-if="imageList.length === 0 && !imageLoading" class="empty-state">
          <p>暂无图片素材</p>
        </div>
        <div v-else>
          <div class="image-grid">
            <div
              v-for="(image, index) in imageList"
              :key="`img-${index}`"
              class="image-item"
              :class="{ selected: selectedImageIndexes.includes(index) }"
              @click="handleSelectImage(image, index)"
              style="width: 100%; position: relative"
            >
              <div class="image-preview">
                <img :src="image.url" :alt="image.name" class="preview-img" />
                <div v-show="selectedImageIndexes.includes(index)" class="selected-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#1890ff" />
                    <path
                      d="M8 12l2.5 2.5L16 9"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="pagination-wrapper" v-if="pagination.total > pagination.pageSize">
            <APagination
              v-model:current="pagination.current"
              :total="pagination.total"
              :page-size="pagination.pageSize"
              :show-size-changer="false"
              :show-quick-jumper="false"
              :show-total="handlePaginationShowTotal"
              @change="handlePageChange"
              size="small"
            />
          </div>
        </div>
      </ASpin>
    </div>
  </AModal>
</template>

<style scoped lang="less">
.image-select-content {
  .empty-state {
    text-align: center;
    padding: 60px 0;
    color: #999;

    p {
      margin: 0;
      font-size: 16px;
    }
  }

  .image-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 16px;
    max-height: 400px;
    overflow-y: auto;
    padding: 8px;
  }

  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 16px 0 8px 0;
    border-top: 1px solid #f0f0f0;
    margin-top: 16px;
  }

  .image-item {
    border: 2px solid #f0f0f0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    position: relative;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
      transform: translateY(-2px);
    }

    &.selected {
      border-color: #1890ff !important;
      box-shadow: 0 6px 16px rgba(24, 144, 255, 0.3);
      background: rgba(24, 144, 255, 0.08);
      transform: translateY(-2px);

      &:hover {
        border-color: #40a9ff;
        box-shadow: 0 8px 20px rgba(24, 144, 255, 0.4);
      }
    }
  }

  .image-preview {
    position: relative;
    width: 100% !important;
    height: 150px !important;
    overflow: hidden;

    .preview-img {
      width: 100% !important;
      height: 100% !important;
      object-fit: cover;
      display: block;
    }

    .selected-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 22px;
      height: 22px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
    }
  }
}
</style>
