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

export { convertBytesToKb }
