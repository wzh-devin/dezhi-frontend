/**
 * 2025/5/4 15:14
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材状态管理器
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import type { FileInfoReq } from '@/interfaces/pages/material-page.ts'
import { getMaterialList } from '@/api/material'

const useMaterialStore = defineStore('material', {
  state: () => ({}),
  actions: {
    /**
     * 获取素材列表信息
     * @param fileInfoReq 文件请求信息
     */
    async getMaterialListAction(fileInfoReq: FileInfoReq) {
      return await getMaterialList(fileInfoReq)
    },
  },
})

export default useMaterialStore
