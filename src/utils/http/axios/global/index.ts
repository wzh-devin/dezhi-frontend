/**
 * 2025/5/1 18:29
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { BASE_URL, TIME_OUT } from '../config'
import { TOKEN_KEY } from '@/constant/global-key.ts'
import router from '@/router'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_KEY) ?? ''
    if (token) {
      config.headers.token = `${token}`
    }
    return config
  },
  (error) => {
    return error
  },
)

// 响应拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 判断响应状态码是否为200
    return response
  },
  (error) => {
    console.log(error)
    // 抛出错误信息
    if (error.response.status === 401 && error.response.data.errCode === 2001) {
      console.log('用户登录失效 || 未登录')
      // 用户登录失效 || 未登录
      localStorage.removeItem(TOKEN_KEY)
      // 重定向
      router.push('/login').then()
    }
    return Promise.reject(error.response?.data)
  },
)

export default axiosInstance
