import { get, post, put } from '@/utils/http/axios'
import type { ApiResultString, ApiResultVoid, ApiResultListFileInfoVO } from './typings'

/**
 * 上传文件素材 PUT /api/v1/material/upload
 */
export async function upload(
  data?: {
    /**  */
    unknownParam?: unknown
  },
  options?: Record<string, unknown>,
): Promise<ApiResultString> {
  return put({
    url: `/api/v1/material/upload`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 删除文件 POST /api/v1/material/deleteMaterial
 */
export async function delMaterial(data?: string[], options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/material/deleteMaterial`,
    data,
    ...(options || {}),
  })
}

/**
 * 文件列表 GET /api/v1/material/page
 */
export async function page(
  params?: {
    /** 页码 */
    pageNum?: number
    /** 每页数量 */
    pageSize?: number
    /** 文件名称 */
    fileName?: string
    /** 存储类型 */
    storageType?: 'MINIO'
    /** 文件状态 */
    status: 'DISABLED' | 'NORMAL'
  },
  options?: Record<string, unknown>,
): Promise<ApiResultListFileInfoVO> {
  return get({
    url: `/api/v1/material/page`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
