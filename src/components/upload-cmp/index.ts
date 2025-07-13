export { default as UploadModal } from './UploadModal.vue'

// 导出类型定义
export interface UploadResponse {
  success: boolean
  errMsg?: string
  data?: unknown
}
