/**
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章卡片组件
 * @version 1.0.0
 * @since 1.0.0
 */
import { memo } from 'react'
import type { FC } from 'react'
import { Card, Avatar, Tag } from 'antd'
import {
  FolderOutlined,
  CalendarOutlined,
  PushpinOutlined,
} from '@ant-design/icons'
import styles from './index.less'

/**
 * 文章数据类型
 */
export interface ArticleData {
  /** 文章ID */
  id: number
  /** 是否置顶 */
  isTop?: boolean
  /** 是否原创 */
  isOriginal?: boolean
  /** 文章标题 */
  title: string
  /** 文章简介 */
  summary: string
  /** 作者名称 */
  author: string
  /** 作者头像 */
  authorAvatar: string
  /** 发布时间 */
  date: string
  /** 浏览量 */
  views: number
  /** 分类 */
  category: string
  /** 阅读时间 */
  readTime: string
  /** 封面图 */
  cover: string
}

/**
 * 组件属性类型
 */
interface ArticleCardProps {
  /** 文章数据 */
  article: ArticleData
  /** 点击回调 */
  onClick?: (id: number) => void
}

/**
 * 文章卡片组件
 * @param props - 组件属性
 * @returns 文章卡片组件
 */
const ArticleCard: FC<ArticleCardProps> = ({ article, onClick }) => {
  /**
   * 处理卡片点击
   */
  const handleClick = (): void => {
    onClick?.(article.id)
  }

  return (
    <Card className={styles['article-card']} onClick={handleClick}>
      {/* 上半部分：文章信息和封面 */}
      <div className={styles['article-content']}>
        {/* 左侧文章信息 */}
        <div className={styles['article-info']}>
          {/* 标题区域 */}
          <div className={styles['article-header']}>
            {article.isTop && (
              <Tag color="#ff6b35" className={styles['top-tag']}>
                <PushpinOutlined /> 置顶
              </Tag>
            )}
            {article.isOriginal && (
              <Tag color="#667eea" className={styles['original-tag']}>
                原创
              </Tag>
            )}
            <h3 className={styles['article-title']}>{article.title}</h3>
          </div>

          {/* 文章简介 */}
          <p className={styles['article-summary']}>{article.summary}</p>
        </div>

        {/* 右侧封面图 */}
        <div className={styles['article-cover']}>
          <img src={article.cover} alt={article.title} />
        </div>
      </div>

      {/* 分隔线 */}
      <div className={styles['article-divider']} />

      {/* 底部元信息 */}
      <div className={styles['article-meta']}>
        <div className={styles['meta-left']}>
          <div className={styles['author-info']}>
            <Avatar src={article.authorAvatar} size={24} />
            <span className={styles['author-name']}>{article.author}</span>
          </div>
          <span className={styles['meta-item']}>
            <CalendarOutlined /> {article.date}
          </span>
        </div>
        <div className={styles['meta-right']}>
          <span className={styles['meta-item']}>
            <FolderOutlined /> {article.category}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default memo(ArticleCard)
