import { request } from 'umi'; 
import {
  ApiResultVoid,
  ApiResultListTagVO,
} from './typings';

/**
 * 修改标签 POST /api/v1/admin/tag/update
 */
export async function updateTag (
  data?: {
    /** 主键id */
    id?: string;
    /** 标签名称 */
    name?: string;
    /** 标签颜色 */
    color?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/tag/update`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 保存标签 POST /api/v1/admin/tag/save
 */
export async function saveTag (
  data?: {
    /** 标签名称 */
    name?: string;
    /** 标签颜色 */
    color?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/tag/save`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 删除标签 POST /api/v1/admin/tag/delete
 */
export async function deleteTag (
  data?: {
    /** id列表 */
    idList?: string[];
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/tag/delete`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 查询标签 GET /api/v1/admin/tag/page
 */
export async function pageTag (
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
  return request<ApiResultListTagVO>(`/api/v1/admin/tag/page`, {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 获取标签下拉列表 GET /api/v1/admin/tag/optional
 */
export async function optionalTag (
  options?: Record<string, any>,
) {
  return request<ApiResultListTagVO>(`/api/v1/admin/tag/optional`, {
    method: 'GET',
    ...(options || {}),
  });
}
