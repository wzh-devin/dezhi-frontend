import { request } from 'umi'; 
import {
  ApiResultVoid,
  ApiResultString,
  ApiResultUserVO,
} from './typings';

/**
 * 登出 POST /api/v1/admin/user/logout
 */
export async function logout (
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/user/logout`, {
    method: 'POST',
    ...(options || {}),
  });
}

/**
 * 登录 POST /api/v1/admin/user/login
 */
export async function login (
  data?: {
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultString>(`/api/v1/admin/user/login`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 修改用户信息 POST /api/v1/admin/user/edit
 */
export async function editUserInfo (
  data?: {
    /** 主键id */
    id?: string;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 邮箱 */
    email?: string;
  },
  options?: Record<string, any>,
) {
  return request<ApiResultVoid>(`/api/v1/admin/user/edit`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}

/**
 * 获取当前用户信息 GET /api/v1/admin/user/getUserInfo
 */
export async function getUserInfo (
  options?: Record<string, any>,
) {
  return request<ApiResultUserVO>(`/api/v1/admin/user/getUserInfo`, {
    method: 'GET',
    ...(options || {}),
  });
}
