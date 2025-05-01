/**
 * 2025/5/1 18:28
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */

import axiosInstance from './global/index.ts'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResult } from '../../../interfaces/api-result.ts'

/**
 * 封装get请求
 * @param config
 * @return Promise
 */
export function get(config: AxiosRequestConfig): Promise<ApiResult> {
  return new Promise((resolve, reject) => {
    axiosInstance.get(config.url || '').then(
      // 响应成功，返回数据
      (response) => resolve(response?.data),
      // 响应失败，返回错误信息
      (error) => reject(error),
    )
  })
}

/**
 * 封装post请求
 * @param config
 * @return Promise
 */
export function post(config: AxiosRequestConfig): Promise<ApiResult> {
  return new Promise((resolve, reject) => {
    axiosInstance.post(config.url || '', config.data).then(
      // 响应成功，返回数据
      (response) => resolve(response?.data),
      // 响应失败，向上抛出错误数据
      (error) => reject(error),
    )
  })
}

/**
 * 封装put请求
 * @param config
 * @return Promise
 */
export function put(config: AxiosRequestConfig): Promise<ApiResult> {
  return new Promise((resolve, reject) => {
    axiosInstance.put(config.url || '', config.data).then(
      // 响应成功，返回数据
      (response) => resolve(response?.data),
      // 响应失败，返回错误信息
      (error) => reject(error),
    )
  })
}

/**
 * 封装delete请求
 * @param config
 * @return Promise
 */
export function del(config: AxiosRequestConfig): Promise<ApiResult> {
  return new Promise((resolve, reject) => {
    axiosInstance.delete(config.url || '', { data: config.data }).then(
      // 响应成功，返回数据
      (response) => resolve(response?.data),
      // 响应失败，返回错误信息
      (error) => reject(error),
    )
  })
}
