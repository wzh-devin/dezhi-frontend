import { get, post, put } from '@/utils/http/axios'
import type { ApiResultVoid, ApiResultListTagVO } from './typings'

/**
 * 添加标签 PUT /api/v1/tag/save
 */
export async function saveTag(
  data?: {
    /** 标签id */
    id?: string
    /** 标签名称 */
    name?: string
    /** 标签颜色 */
    color?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return put({
    url: `/api/v1/tag/save`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 编辑标签 POST /api/v1/tag/edit
 */
export async function editTag(
  data?: {
    /** 标签id */
    id?: string
    /** 标签名称 */
    name?: string
    /** 标签颜色 */
    color?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/tag/edit`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 删除标签 POST /api/v1/tag/delBatch
 */
export async function delTags(data?: number[], options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/tag/delBatch`,
    data,
    ...(options || {}),
  })
}

/**
 * 分页查询标签 GET /api/v1/tag/page
 */
export async function page(
  params?: {
    /** 页码 */
    pageNum?: number | string
    /** 每页数量 */
    pageSize?: number | string
    /** 标签名称 */
    tagName?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultListTagVO> {
  return get({
    url: `/api/v1/tag/page`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 获取标签可选项 GET /api/v1/tag/getTagOptional
 */
export async function getTagOptional(options?: Record<string, unknown>): Promise<ApiResultListTagVO> {
  return get({
    url: `/api/v1/tag/getTagOptional`,
    ...(options || {}),
  })
}
