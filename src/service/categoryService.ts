import { request } from 'umi'; 
import {
  ApiResultVoid,
  ApiResultListCategoryVO,
} from './typings';

/**
 * 修改分类 POST /api/v1/category/update
 */
export async function updateCategory (
  data?: {
    /** 主键id */
    id?: string;
    /** 分类名称 */
    name?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/category/update`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 保存分类 POST /api/v1/category/save
 */
export async function saveCategory (
  data?: {
    /** 分类名称 */
    name?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/category/save`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 删除分类 POST /api/v1/category/delete
 */
export async function deleteCategory (
  data?: {
    /** id列表 */
    idList?: string[];
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/category/delete`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 查询分类 GET /api/v1/category/page
 */
export async function pageCategory (
  params?: {
    /** 页码 */
    pageNum: number;
    /** 每页数量 */
    pageSize: number;
    /** 关键字 */
    keyword?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListCategoryVO>(`/api/v1/category/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 获取分类下拉列表 GET /api/v1/category/optional
 */
export async function optionalCategory (
  options?: Record<string, any>,
) {
  return request<ApiResultListCategoryVO>(`/api/v1/category/optional`, {
    method: 'GET',
    ...(options || {}),
  });
}
