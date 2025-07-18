import { message } from 'ant-design-vue'
import type { ApiResultObject } from '@/service/typings.ts'

/**
 * 2025/5/7 20:58
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 字符串格式化
 * @version 1.0
 * @since 1.0
 */

/**
 * 错误信息提取
 * @param error
 */
const errMsgExtract = (error: ApiResultObject) => {
  const errCode = error?.errCode ?? ''
  const errData = error?.data

  return message.error(`${errData}【${errCode}】`)
}

export { errMsgExtract }
