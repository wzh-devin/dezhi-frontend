/**
 * 2025/7/14 0:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import { delTags, editTag, getTagOptional, page, saveTag } from '@/service/tagService.ts'
import type { ApiResultListTagVO, TagVO } from '@/service/typings.ts'

const useTagStore = defineStore('tags', {
  state: () => ({}),
  actions: {
    /**
     * 标签列表
     * @param params 查询参数
     */
    async getTagListAction(params: {
      /** 页码 */
      pageNum?: number | string
      /** 每页数量 */
      pageSize?: number | string
      /** 标签名称 */
      tagName?: string
    }): Promise<ApiResultListTagVO> {
      return await page(params)
    },
    /**
     * 保存标签.
     * @param data 标签信息
     */
    async saveTagAction(data: TagVO) {
      await saveTag(data)
    },
    /**
     * 删除标签.
     * @param tagIds 标签id
     */
    async delTagAction(tagIds: string[]) {
      await delTags(tagIds)
    },
    /**
     * 编辑标签.
     * @param data 标签信息
     */
    async editTagAction(data: TagVO) {
      await editTag(data)
    },
    /**
     * 获取标签可选项.
     */
    async getTagOptionalAction(): Promise<Array<{ label: string; value: string }>> {
      const tagList = (await getTagOptional()).data as TagVO[]
      return tagList.map((tag) => {
        return {
          label: tag.name,
          value: tag.id,
        }
      }) as Array<{ label: string; value: string }>
    },
  },
})

export default useTagStore
