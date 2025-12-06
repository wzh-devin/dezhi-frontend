/**
 * 2025/12/7 04:52.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 提示消息扩展
 * @version 1.0.0
 * @since 1.0.0
 */
import { ApiResultObject } from '@/service/typings'

export interface ApiError extends Error {
  response?: ApiResultObject
}

/**
 * 错误处理
 * @param error
 */
const errorHandler = (error: ApiError) => {
  return error.response?.data.errMsg ?? '请求失败'
}

export { errorHandler }
