import { get, post } from '@/utils/http/axios'
import type { ApiResultVoid, ArticleSaveVO, ApiResultListArticleVO, ApiResultArticleVO } from './typings'

/**
 * 批量恢复文章 POST /api/v1/article/recoverArticle
 */
export async function recoverArticle(
  data?: {
    /** id列表 */
    idList?: string[]
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/article/recoverArticle`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 编辑文章 POST /api/v1/article/editArticle
 */
export async function editArticle(
  data?: {
    /** 文章id */
    id?: string
    /** 文章类别id */
    categoryId?: string
    /** 文章标题 */
    title?: string
    /** 文章摘要 */
    summary?: string
    /** 文章内容 */
    content?: string
    /** 文章内容md */
    contentMd?: string
    /** 文章url */
    url?: string
    /** 文章是否置顶 */
    isStick?: number | string
    /** 文章状态 */
    status?: number | string
    /** 文章是否AI生成 */
    isAi?: number | string
    /** 文章标签id列表 */
    tagIdList?: string[]
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/article/editArticle`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 批量删除文章 POST /api/v1/article/delArticleBatch
 */
export async function delArticle(
  data?: {
    /** id列表 */
    idList?: string[]
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/article/delArticleBatch`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 清空回收站 POST /api/v1/article/cleanRecycle
 */
export async function cleanRecycle(
  data?: {
    /** id列表 */
    idList?: string[]
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/article/cleanRecycle`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 添加文章 GET /api/v1/article/save
 */
export async function saveArticle(
  params?: {
    /**  */
    articleSaveVO: ArticleSaveVO
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return get({
    url: `/api/v1/article/save`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 分页查询文章 GET /api/v1/article/page
 */
export async function page(
  params?: {
    /** 页码 */
    pageNum?: number | string
    /** 每页数量 */
    pageSize?: number | string
    /** 文章标题 */
    title?: string
    /** 文章类别 */
    categoryName?: string
    /** 文章状态 */
    status: 'DRAFT' | 'IS_PUBLISH'
    /** 删除状态 */
    delFlag: 'NORMAL' | 'IS_DELETED'
  },
  options?: Record<string, unknown>,
): Promise<ApiResultListArticleVO> {
  return get({
    url: `/api/v1/article/page`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 获取文章详情 GET /api/v1/article/getArticleInfo/{articleId}
 */
export async function getArticleInfo(
  pathVars: {
    /**  */
    articleId: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultArticleVO> {
  return get({
    url: `/api/v1/article/getArticleInfo/${pathVars.articleId}`,
    ...(options || {}),
  })
}
