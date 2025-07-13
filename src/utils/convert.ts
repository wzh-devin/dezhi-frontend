/**
 * 2025/6/8 2:17
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 转换函数工具
 * @version 1.0
 * @since 1.0
 */

/**
 * 字节数转换成KB
 * @param bytes
 * @param precision
 */
const convertBytesToKb = (bytes: string | number, precision: number = 2) => {
  const KILOBYTE_SIZE = 1024
  bytes = Number(bytes)

  // 输入验证
  if (!Number.isFinite(bytes) || bytes < 0) {
    console.warn('无效的字节数输入。请提供一个非负的数字。')
    return 0
  }

  // 执行转换
  const kbValue = bytes / KILOBYTE_SIZE

  return parseFloat(kbValue.toFixed(precision))
}

/**
 * 智能文件大小格式化
 * @param bytes 字节数
 * @param precision 小数位数
 * @returns 格式化后的文件大小字符串
 */
const formatFileSize = (bytes: string | number, precision: number = 2): string => {
  bytes = Number(bytes)

  // 输入验证
  if (!Number.isFinite(bytes) || bytes < 0) {
    console.warn('无效的字节数输入。请提供一个非负的数字。')
    return '0 B'
  }

  // 定义单位和对应的大小
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const BASE_SIZE = 1024

  // 如果小于1KB，直接返回字节数
  if (bytes < BASE_SIZE) {
    return `${bytes} B`
  }

  // 计算合适的单位
  let unitIndex = 0
  let size = bytes

  while (size >= BASE_SIZE && unitIndex < units.length - 1) {
    size /= BASE_SIZE
    unitIndex++
  }

  // 格式化数值
  const formattedSize = parseFloat(size.toFixed(precision))

  return `${formattedSize} ${units[unitIndex]}`
}

/**
 * 根据文件类型转换样式类名
 * @param fileType 文件类型
 */
const convertFileTypeToClassName = (fileType: string) => {
  const type = fileType?.toUpperCase()
  switch (type) {
    case 'JPG':
    case 'JPEG':
      return 'jpg-tag'
    case 'PNG':
      return 'png-tag'
    case 'GIF':
      return 'gif-tag'
    default:
      return 'default-tag'
  }
}

/**
 * 根据存储类型转换样式类名
 * @param storageType 存储类型
 */
const convertStorageTypeToClassName = (storageType: string) => {
  const type = storageType?.toUpperCase()
  switch (type) {
    case 'MINIO':
      return 'minio-tag'
    case 'LOCAL':
      return 'local-tag'
    case 'OSS':
      return 'oss-tag'
    case 'COS':
      return 'cos-tag'
    default:
      return 'default-storage-tag'
  }
}

export { convertBytesToKb, formatFileSize, convertFileTypeToClassName, convertStorageTypeToClassName }
