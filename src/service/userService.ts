import { get, post, put, del } from '@/utils/http/axios'
import type { ApiResultVoid, ApiResultLoginVO, ApiResultUserInfoVO } from './typings'

/**
 * 用户注册 PUT /api/v1/user/signup
 */
export async function signup(
  data?: {
    /** 用户名 */
    username?: string
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: number | string
    /** 密码 */
    password?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return put({
    url: `/api/v1/user/signup`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 邮箱验证码登录 POST /api/v1/user/loginEmail
 */
export async function loginEmail(
  data?: {
    /** 用户名 */
    username?: string
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: number | string
    /** 密码 */
    password?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultLoginVO> {
  return post({
    url: `/api/v1/user/loginEmail`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 账密登录 POST /api/v1/user/loginAccount
 */
export async function loginAccount(
  data?: {
    /** 用户名 */
    username?: string
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: number | string
    /** 密码 */
    password?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultLoginVO> {
  return post({
    url: `/api/v1/user/loginAccount`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 忘记密码 POST /api/v1/user/forgetPassword
 */
export async function forgetPassword(
  data?: {
    /** 用户名 */
    username?: string
    /** 邮箱 */
    email?: string
    /** 验证码 */
    code?: number | string
    /** 密码 */
    password?: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return post({
    url: `/api/v1/user/forgetPassword`,
    data: {
      ...data,
    },
    ...(options || {}),
  })
}

/**
 * 用户登出 GET /api/v1/user/logout
 */
export async function logout(options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return get({
    url: `/api/v1/user/logout`,
    ...(options || {}),
  })
}

/**
 * 获取登录用户信息 GET /api/v1/user/getLoginUserInfo
 */
export async function getLoginUserInfo(options?: Record<string, unknown>): Promise<ApiResultUserInfoVO> {
  return get({
    url: `/api/v1/user/getLoginUserInfo`,
    ...(options || {}),
  })
}

/**
 * 获取邮箱验证码 GET /api/v1/user/getEmailCode
 */
export async function getEmailCode(
  params?: {
    /** 用户邮箱 */
    email: string
  },
  options?: Record<string, unknown>,
): Promise<ApiResultVoid> {
  return get({
    url: `/api/v1/user/getEmailCode`,
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/**
 * 用户注销 DELETE /api/v1/user/deregisterAccount
 */
export async function deregisterAccount(options?: Record<string, unknown>): Promise<ApiResultVoid> {
  return del({
    url: `/api/v1/user/deregisterAccount`,
    ...(options || {}),
  })
}
