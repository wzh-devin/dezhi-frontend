import { request } from 'umi'; 
import {
  ApiResultVoid,
  ApiResultArticleVO,
  ApiResultListArticleVO,
} from './typings';

/**
 * 修改文章 PUT /api/v1/article/update
 */
export async function updateArticle (
  data?: {
    /** 主键id */
    id?: string;
    /** 分类id */
    categoryId?: string;
    /** 标签id列表 */
    tagIdList?: string[];
    /** 文章标题 */
    title?: string;
    /** 文章简介 */
    summary?: string;
    /** 文章内容 */
    content?: string;
    /** 文章内容markdown */
    contentMd?: string;
    /** 文章状态（DRAFT,PUBLISHED,DELETED） */
    status?: ('NORMAL' | 'DRAFT' | 'PUBLISHED' | 'DELETED');
    /** 是否置顶（0: 正常; 1: 置顶） */
    top?: number;
    /** 是否热门（0: 正常; 1: 热门） */
    hot?: number;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/article/update`, {
    method: 'PUT',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 初始化新增文章 POST /api/v1/article/save
 */
export async function saveArticle (
  options?: Record<string, any>,
) {
  return request<ApiResultArticleVO>(`/api/v1/article/save`, {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 批量删除文章 POST /api/v1/article/delete
 */
export async function deleteArticle (
  data?: {
    /** id列表 */
    idList?: string[];
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/article/delete`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 清空回收站（永久删除） POST /api/v1/article/clearRecycleBin
 */
export async function clearRecycleBin (
  data?: {
    /** id列表 */
    idList?: string[];
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/article/clearRecycleBin`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}


/**
 * 分页查询文章 GET /api/v1/article/pageArticle
 */
export async function pageArticle (
  params?: {
    /** 页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 文章状态 */
    status: ('NORMAL' | 'DRAFT' | 'PUBLISHED' | 'DELETED');
    /** 关键词 */
    keyword?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListArticleVO>(`/api/v1/article/pageArticle`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 获取文章信息 GET /api/v1/article/getArticleInfo/{articleId}
 */
export async function getArticleInfo (
  pathVars: {
    /** 文章id */
    articleId: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultArticleVO>(`/api/v1/article/getArticleInfo/${pathVars.articleId}`, {
    method: 'GET',
    ...(options || {}),
  });
}
