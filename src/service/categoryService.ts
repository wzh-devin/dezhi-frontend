import { get, post, put } from '@/utils/http/axios'
import type { ApiResultVoid, ApiResultListCategoryVO } from './typings'

/**
 * 添加类别 PUT /api/v1/category/save
 */
export async function saveCategory(
  data?: {
    /** 类别id */
    id?: string
    /** 类别名称 */
    name?: string
    /** 类别颜色 */
    color?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return put({
    url: `/api/v1/category/save`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 编辑类别 POST /api/v1/category/edit
 */
export async function editCategory(
  data?: {
    /** 类别id */
    id?: string
    /** 类别名称 */
    name?: string
    /** 类别颜色 */
    color?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/category/edit`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 删除类别 POST /api/v1/category/delBatch
 */
export async function delCategories(data?: string[], options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/category/delBatch`,
    data,
    ...(options || {}),
  })
}

/**
 * 分页查询类别 GET /api/v1/category/page
 */
export async function page(
  params?: {
    /** 页码 */
    pageNum?: number | string
    /** 每页数量 */
    pageSize?: number | string
    /** 类别名称 */
    categoryName?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultListCategoryVO> {
  return get({
    url: `/api/v1/category/page`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}
