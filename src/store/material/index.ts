/**
 * 2025/5/4 15:14
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材状态管理器
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import { clearRecycle, delMaterial, page, recoverMaterial } from '@/service/materialService.ts'
import type { ApiResultListFileInfoVO } from '@/service/typings.ts'

const useMaterialStore = defineStore('material', {
  state: () => ({}),
  actions: {
    /**
     * 获取素材列表信息
     * @param fileInfoReq 文件请求信息
     */
    async getMaterialListAction(fileInfoReq: {
      /** 页码 */
      pageNum?: number
      /** 每页数量 */
      pageSize?: number
      /** 文件名称 */
      fileName?: string
      /** 文件类型 */
      fileType?: 'JPG' | 'PNG' | 'GIF'
      /** 存储类型 */
      storageType?: 'MINIO'
      /** 文件状态 */
      status: 'IS_DELETED' | 'NORMAL'
    }): Promise<ApiResultListFileInfoVO> {
      return await page(fileInfoReq)
    },

    /**
     * 批量删除文件
     * @param fileIds 文件ids
     */
    async delMaterialAction(fileIds: string[]): Promise<void> {
      await delMaterial(fileIds)
    },

    /**
     * 清空回收站
     */
    async clearRecycleAction(): Promise<void> {
      await clearRecycle()
    },

    /**
     * 恢复文件
     * @param fileIds 文件ids
     */
    async recoverMaterialAction(fileIds: string[]): Promise<void> {
      await recoverMaterial(fileIds)
    },
  },
})

export default useMaterialStore
