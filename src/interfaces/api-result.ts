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

/**
 * 分页结果接口集
 */
export interface PageResult<T> {
  /**
   * 数据列表
   */
  dataList: Array<T>

  /**
   * 数据总数
   */
  total: number

  /**
   * 当前页码
   */
  pageNum: number

  /**
   * 每页数据量
   */
  pageSize: number
}
