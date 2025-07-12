/**
 * 2025/5/1 18:28
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */

import axiosInstance from './global/index.ts'
import type { AxiosRequestConfig } from 'axios'

/**
 * 封装get请求
 * @param config
 * @return Promise
 */
export function get(config: AxiosRequestConfig): Promise<object> {
  return new Promise((resolve, reject) => {
    axiosInstance.get(config.url ?? '', config).then(
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
export function post(config: AxiosRequestConfig): Promise<object> {
  return new Promise((resolve, reject) => {
    axiosInstance.post(config.url ?? '', config.data, config).then(
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
export function put(config: AxiosRequestConfig): Promise<object> {
  return new Promise((resolve, reject) => {
    axiosInstance.put(config.url ?? '', config.data, config).then(
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
export function del(config: AxiosRequestConfig): Promise<object> {
  return new Promise((resolve, reject) => {
    axiosInstance.delete(config.url ?? '', config).then(
      // 响应成功，返回数据
      (response) => resolve(response?.data),
      // 响应失败，返回错误信息
      (error) => reject(error),
    )
  })
}
