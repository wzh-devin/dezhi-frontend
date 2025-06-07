/**
 * 2025/6/4 11:26
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材管理相关接口
 * @version 1.0
 * @since 1.0
 */
import { get } from '@/utils/http/axios'
import type { FileInfoReq, IFileInfo } from '@/interfaces/pages/material-page.ts'
import type { PageResult } from '@/interfaces/api-result.ts'

// 转换
const pathConvert = (obs: object) => {
  if (Object.keys(obs).length == 0) return ''
  const params = Object.entries(obs)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    })
    .join('&') as string
  return `?${params}`
}

/**
 * 获取文件列表信息
 * @param fileInfoReq
 */
const getMaterialList = async (fileInfoReq: FileInfoReq) => {
  return (await get({
    url: '/material/list' + pathConvert(fileInfoReq),
  })) as PageResult<IFileInfo>
}

export { getMaterialList }
