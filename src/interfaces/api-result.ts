/**
 * 2025/5/1 18:39
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 响应结果集接口
 * @version 1.0
 * @since 1.0
 */
export interface ApiResult<T> {
  success: boolean
  errCode: number
  errMsg: string
  data: T
}
