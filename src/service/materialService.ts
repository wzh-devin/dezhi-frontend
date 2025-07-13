import { get, post, del } from '@/utils/http/axios'
import type { ApiResultString, ApiResultVoid, ApiResultListFileInfoVO } from './typings'

/**
 * 上传文件素材 POST /api/v1/material/upload
 */
export async function upload(data: FormData, options?: Record<string, unknown>): Promise<ApiResultString> {
  return post({
    url: `/api/v1/material/upload`,
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  })
}

/**
 * 批量删除文件 POST /api/v1/material/deleteMaterial
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
    /** 文件类型 */
    fileType?: 'JPG' | 'PNG' | 'GIF'
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

/**
 * 清空回收站 DELETE /api/v1/material/clearRecycle
 */
export async function clearRecycle(options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return del({
    url: `/api/v1/material/clearRecycle`,
    ...(options || {}),
  })
}
