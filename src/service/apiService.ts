import { request } from 'umi'; 
import {
  ApiResultListTagVO,
  ApiResultListCategoryVO,
  ApiResultArticleVO,
  ApiResultListArticleVO,
} from './typings';

/**
 * 查询标签 GET /api/v1/api/tag/page
 */
export async function pageTag (
  params?: {
    /** 页码 */
    pageNum: number;
    /** 每页数量 */
    pageSize: number;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListTagVO>(`/api/v1/api/tag/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 查询分类 GET /api/v1/api/category/page
 */
export async function pageCategory (
  params?: {
    /** 页码 */
    pageNum: number;
    /** 每页数量 */
    pageSize: number;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListCategoryVO>(`/api/v1/api/category/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 获取文章详情 GET /api/v1/api/article/{articleId}
 */
export async function getArticleInfo (
  pathVars: {
    /** 文章id */
    articleId: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultArticleVO>(`/api/v1/api/article/${pathVars.articleId}`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 推荐文章 GET /api/v1/api/article/recommend
 */
export async function recommendedArticleList (
  options?: Record<string, any>,
) {
  return request<ApiResultListArticleVO>(`/api/v1/api/article/recommend`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 分页查询文章 GET /api/v1/api/article/pageArticle
 */
export async function pageArticle (
  params?: {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 分类id */
    categoryId?: string;
    /** 标签id */
    tagId?: string;
    /** 关键词 */
    keyword?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListArticleVO>(`/api/v1/api/article/pageArticle`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
