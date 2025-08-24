/**
 * 2025/7/14 0:42
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章状态管理器
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import {
  cleanRecycle,
  delArticle,
  editArticle,
  getArticleInfo,
  page,
  recoverArticle,
  saveArticle,
  saveArticleInit,
  updateStatus,
} from '@/service/articleService.ts'
import type { ApiResultArticleVO, ApiResultListArticleVO, ApiResultVoid, ArticleSaveVO } from '@/service/typings.ts'

const useArticleStore = defineStore('article', {
  state: () => ({}),
  actions: {
    /**
     * 获取文章列表信息
     * @param params 文章请求参数
     */
    async getArticleListAction(params: {
      /** 页码 */
      pageNum?: number | string
      /** 每页数量 */
      pageSize?: number | string
      /** 文章标题 */
      title?: string
      /** 文章类别 */
      categoryName?: string
      /** 文章状态 */
      status?: 'DRAFT' | 'IS_PUBLISH'
      /** 删除状态 */
      delFlag: 'NORMAL' | 'IS_DELETED'
    }): Promise<ApiResultListArticleVO> {
      return await page(params)
    },

    /**
     * 获取文章详情
     * @param articleId 文章ID
     */
    async getArticleInfoAction(articleId: string): Promise<ApiResultArticleVO> {
      return await getArticleInfo({ articleId })
    },

    /**
     * 保存文章
     * @param articleSaveVO 文章保存信息
     */
    async saveArticleAction(articleSaveVO: ArticleSaveVO): Promise<ApiResultVoid> {
      return await saveArticle({ articleSaveVO })
    },

    /**
     * 文章初始化新增
     */
    async saveArticleInitAction(): Promise<ApiResultArticleVO> {
      return await saveArticleInit()
    },

    /**
     * 编辑文章
     * @param data 文章编辑信息
     */
    async editArticleAction(data: {
      /** 文章id */
      id?: string
      /** 文章类别id */
      categoryId?: string
      /** 文章标题 */
      title?: string
      /** 文章摘要 */
      summary?: string
      /** 文章内容 */
      content?: string
      /** 文章内容md */
      contentMd?: string
      /** 文章url */
      url?: string
      /** 文章是否置顶 */
      isStick?: number | string
      /** 文章状态 */
      status?: number | string
      /** 文章是否AI生成 */
      isAi?: number | string
      /** 文章标签id列表 */
      tagIdList?: string[]
    }): Promise<ApiResultVoid> {
      return await editArticle(data)
    },

    /**
     * 批量删除文章
     * @param idList 文章id列表
     */
    async delArticleAction(idList: string[]): Promise<ApiResultVoid> {
      return await delArticle({ idList })
    },

    /**
     * 批量恢复文章
     * @param idList 文章id列表
     */
    async recoverArticleAction(idList: string[]): Promise<ApiResultVoid> {
      return await recoverArticle({ idList })
    },

    /**
     * 清空回收站
     * @param idList 文章id列表
     */
    async cleanRecycleAction(idList: string[]): Promise<ApiResultVoid> {
      return await cleanRecycle({ idList })
    },

    /**
     * 更新文章状态
     * @param id
     * @param status
     */
    async updateStatusAction(id: string, status: 'DRAFT' | 'IS_PUBLISH'): Promise<ApiResultVoid> {
      return await updateStatus(
        {
          id,
        },
        {
          status,
        },
      )
    },
  },
})

export default useArticleStore
