import { request } from 'umi'; 
import {
  ApiResultUploadSession,
  ApiResultFileVO,
  ApiResultVoid,
  ApiResultListFileVO,
} from './typings';

/**
 * 获取上传状态 POST /api/v1/file/upload/status
 */
export async function getUploadStatus (
  params?: {
    /** 会话上传id */
    uploadId: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultUploadSession>(`/api/v1/file/upload/status`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 初始化上传 POST /api/v1/file/upload/initiate
 */
export async function initiateUpload (
  data?: {
    /** 原始文件名 */
    originalName?: string;
    /** 文件hash值 */
    fileHash?: string;
    /** 文件大小 */
    fileSize?: number;
    /** 分片总数 */
    totalChunks?: number;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultUploadSession>(`/api/v1/file/upload/initiate`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 完成上传 POST /api/v1/file/upload/complete
 */
export async function completeUpload (
  params?: {
    /** 会话上传id */
    uploadId: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultFileVO>(`/api/v1/file/upload/complete`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 上传文件分片 POST /api/v1/file/upload/chunk
 */
export async function uploadChunk (
  data?: {
    /**  */
    unknownParam?: any;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/file/upload/chunk`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 取消上传 POST /api/v1/file/upload/cancel
 */
export async function cancelUpload (
  params?: {
    /** 会话上传id */
    uploadId: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/file/upload/cancel`, {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 分页查询文件 POST /api/v1/file/page
 */
export async function pageFile (
  data?: {
    /** 当前页码 */
    pageNum?: number;
    /** 每页数量 */
    pageSize?: number;
    /** 存储类型 */
    storageType?: string;
    /** 文件类型 */
    type?: string;
    /** 删除状态 */
    deleted?: ('DELETED' | 'NORMAL');
    /** 文件名关键词 */
    keyword?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultListFileVO>(`/api/v1/file/page`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 删除文件 POST /api/v1/file/delete
 */
export async function deleteFile (
  data?: {
    /** id列表 */
    idList?: string[];
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/file/delete`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}
