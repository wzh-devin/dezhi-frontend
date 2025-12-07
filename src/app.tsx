/**
 * 2025/12/7 18:19.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 应用入口配置
 * @version 1.0.0
 * @since 1.0.0
 */
import { RequestConfig } from 'umi'
import { BrowserStorage } from '@/utils/storage-utils'
import { message } from 'antd'
import { ApiError } from '@/utils/msg-expansion'

const handleError = (error: any) => {
  const apiError: ApiError = error as ApiError
  const response = apiError.response
  if (response) {
    const { status, data, statusText } = response
    switch (status) {
      case 400:
        message.error(data.errMsg).then()
        break
      case 401:
        message.error('未登录，请重新登录').then()
        // 清除token
        localStorage.removeItem('token')
        // 跳转登录页面
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
        break
      case 403:
        message.error('无权限').then()
        break
      case 404:
        message.error('未找到该资源').then()
        break
      case 500:
        message.error('服务器错误').then()
        break
      case 502:
      case 503:
      case 504:
        message.error('服务暂时不可用，请稍后重试').then()
        break
      default:
        message.error(`请求失败：${statusText}`).then()
    }
  }
}

/**
 * 请求拦截器
 */
export const request: RequestConfig = {
  timeout: 10 * 1000,
  errorConfig: {
    errorHandler: handleError,
    errorThrower(res) {
      console.error('errorThrower', res)
    },
  },
  requestInterceptors: [
    (url, options) => {
      // 获取Token
      const storage = new BrowserStorage({
        type: 'local',
      })
      const token = storage.get<string>('token')
      if (token && !url.includes('/login')) {
        options.headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...options.headers,
        }
      }
      return {
        url,
        options,
      }
    },
  ],
  responseInterceptors: [
    (response) => {
      return response
    },
  ],
}
