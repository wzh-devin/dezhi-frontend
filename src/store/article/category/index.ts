/**
 * 2025/7/14 0:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import type { ApiResultListCategoryVO, CategoryVO } from '@/service/typings.ts'
import { delCategories, editCategory, getCategoryOptional, page, saveCategory } from '@/service/categoryService.ts'

interface CategoryState {
  categoryOptional: Array<{ label: string; value: string }>
}

const useCategoryStore = defineStore('category', {
  state: (): CategoryState => ({
    categoryOptional: [],
  }),
  actions: {
    /**
     * 标签列表
     * @param params 查询参数
     */
    async getCategoryListAction(params: {
      /** 页码 */
      pageNum?: number | string
      /** 每页数量 */
      pageSize?: number | string
      /** 标签名称 */
      tagName?: string
    }): Promise<ApiResultListCategoryVO> {
      return await page(params)
    },
    /**
     * 保存标签.
     * @param data 标签信息
     */
    async saveCategoryAction(data: CategoryVO) {
      await saveCategory(data)
    },
    /**
     * 删除标签.
     * @param tagIds 标签id
     */
    async delCategoryAction(tagIds: string[]) {
      await delCategories(tagIds)
    },
    /**
     * 编辑标签.
     * @param data 标签信息
     */
    async editCategoryAction(data: CategoryVO) {
      await editCategory(data)
    },

    /**
     * 获取标签可选项.
     */
    async getCategoryOptionalAction(): Promise<Array<{ label: string; value: string }>> {
      const categoryList = (await getCategoryOptional()).data as CategoryVO[]
      return categoryList.map((category) => {
        return {
          label: category.name,
          value: category.id,
        }
      }) as Array<{ label: string; value: string }>
    },
  },
})

export default useCategoryStore
