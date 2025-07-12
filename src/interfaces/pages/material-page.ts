/**
 * 2025/6/4 11:17
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件管理
 * @version 1.0
 * @since 1.0
 */

/**
 * 文件信息接口
 */
export interface IFileInfo {
  /**
   * 文件id
   */
  id: number

  /**
   * 文件名
   */
  name: string

  /**
   * 文件路径
   */
  url: string

  /**
   * 文件大小(byte)
   */
  size: number

  /**
   * 文件类型
   */
  fileType: string

  /**
   * 文件存储类型
   */
  storageType: string

  /**
   * 文件上传时间
   */
  uploadTime: string
}

/**
 * 文件信息请求
 */
export interface FileInfoReq {
  /**
   * 文件名
   */
  fileName?: string
  /**
   * 文件路径
   */
  filePath?: string
  /**
   * 文件类型
   */
  fileType?: string
  /**
   * 页数
   */
  pageNum: number
  /**
   * 每页数据量
   */
  pageSize: number
  /**
   * 文件状态（0：回收站；1：正常）
   */
  status: number
}
