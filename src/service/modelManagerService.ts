import { request } from 'umi'; 
import {
  ApiResultVoid,
  ApiResultListModelManagerVO,
} from './typings';

/**
 * 修改模型 POST /api/v1/admin/modelManager/update
 */
export async function updateModelManager (
  data?: {
    /** 主键id */
    id?: string;
    /** 模型提供商 */
    provider?: ('OPENAI');
    /** 模型名称 */
    name?: string;
    /** 模型的base_url */
    baseUrl?: string;
    /** 模型的api_key */
    apiKey?: string;
    /** 模型类型（CHAT, EMBEDDING） */
    type?: ('CHAT' | 'EMBEDDING');
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/modelManager/update`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 获取模型供应商下拉列表 GET /api/v1/admin/modelManager/optional
 */
export async function optionalModelManager (
  options?: Record<string, any>,
) {
  return request<any>(`/api/v1/admin/modelManager/optional`, {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 获取模型列表信息 GET /api/v1/admin/modelManager/list
 */
export async function modelManagerList (
  options?: Record<string, any>,
) {
  return request<ApiResultListModelManagerVO>(`/api/v1/admin/modelManager/list`, {
    method: 'GET',
    ...(options || {}),
  });
}
