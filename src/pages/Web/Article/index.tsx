/**
 * 2025/12/4.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文章详情页面
 * @version 1.0.0
 * @since 1.0.0
 */
import { memo, useState, useMemo } from 'react'
import type { FC } from 'react'
import { Row, Col, Card, Avatar, Tag, Anchor, Button } from 'antd'
import {
  CalendarOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  MessageOutlined,
  LikeOutlined,
  ShareAltOutlined,
  CopyrightOutlined,
  CheckCircleOutlined,
  CalendarFilled,
  SafetyCertificateOutlined,
  WarningOutlined,
  TagOutlined,
} from '@ant-design/icons'
import styles from './index.less'

/** 文章详情数据类型 */
interface ArticleDetail {
  id: number
  title: string
  author: string
  authorAvatar: string
  publishTime: string
  category: string
  content: string
  likes: number
  stars: number
  tags: string[]
}

/** 目录项类型 */
interface TocItem {
  key: string
  href: string
  title: string
  children?: TocItem[]
}

/**
 * 文章目录组件
 * @description 显示文章大纲导航
 */
const ArticleToc: FC<{ items: TocItem[] }> = ({ items }) => {
  return (
    <Card className={styles['toc-card']}>
      <div className={styles['toc-header']}>
        <span className={styles['toc-icon']}>☰</span>
        <span className={styles['toc-title']}>目录</span>
      </div>
      <Anchor
        className={styles['toc-anchor']}
        items={items}
        offsetTop={80}
        targetOffset={80}
      />
    </Card>
  )
}

/**
 * 版权声明组件
 * @description 显示文章版权信息
 */
const CopyrightCard: FC<{ author: string; publishTime: string }> = ({ author, publishTime }) => {
  return (
    <div className={styles['copyright-card']}>
      <div className={styles['copyright-header']}>
        <CopyrightOutlined />
        <span>版权声明</span>
      </div>
      <div className={styles['copyright-content']}>
        <p>
          <CheckCircleOutlined className={styles['icon-blue']} />
          本文由 {author} 原创发布
        </p>
        <p>
          <CalendarFilled className={styles['icon-blue']} />
          发布时间：{publishTime}
        </p>
        <p>
          <SafetyCertificateOutlined className={styles['icon-blue']} />
          版权协议：<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" rel="noreferrer">CC BY-NC-SA 4.0</a>
        </p>
        <p className={styles['copyright-warning']}>
          <WarningOutlined className={styles['icon-orange']} />
          未经许可，禁止转载、摘编、复制或建立镜像。欢迎转发分享！
        </p>
      </div>
    </div>
  )
}

/**
 * 从 Markdown 内容解析目录
 * @param content - Markdown 内容
 * @returns 目录项数组
 */
const parseTocFromContent = (content: string): TocItem[] => {
  const lines = content.split('\n')
  const tocItems: TocItem[] = []
  let h2Index = 0
  let currentH2: TocItem | null = null

  lines.forEach((line) => {
    const trimmedLine = line.trim()
    if (trimmedLine.startsWith('## ')) {
      h2Index++
      const title = trimmedLine.replace('## ', '')
      currentH2 = {
        key: `h2-${h2Index}`,
        href: `#h2-${h2Index}`,
        title,
        children: [],
      }
      tocItems.push(currentH2)
    } else if (trimmedLine.startsWith('### ') && currentH2) {
      const title = trimmedLine.replace('### ', '')
      const h3Index = (currentH2.children?.length || 0) + 1
      currentH2.children?.push({
        key: `h2-${h2Index}-h3-${h3Index}`,
        href: `#h2-${h2Index}-h3-${h3Index}`,
        title,
      })
    }
  })

  return tocItems
}

/**
 * 文章详情页面组件
 * @description 展示文章完整内容、作者信息和目录导航
 */
const Article: FC = () => {
  const [article] = useState<ArticleDetail>({
    id: 361,
    title: '【诚挚邀约】你的每一个建议，都是这款博客系统的成长动力',
    author: 'Devin',
    authorAvatar: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    publishTime: '2025-12-12 10:14:06',
    category: '生活随笔',
    likes: 0,
    stars: 0,
    tags: ['博客'],
    content: `大家好！我是Devin，从最初的一个想法，到敲下第一行代码，再到如今码云的 **2000+ star** ，这款系统的每一步成长，都离不开你们的默默支持。

作为个人开发者，我深知系统还有很多不够完善的地方——可能是某个操作流程让你觉得繁琐，可能是缺少你急需的某个功能，也可能是界面细节还有优化空间。而你们，作为系统的实际使用者，最清楚自己需要什么，也最了解系统的痛点所在。

为了让这款博客系统更贴合大家的使用需求，更懂你们的创作习惯，今天正式开启用户需求与优化建议征集。无论你是已经基于系统使用二开了的伙伴，还是准备着手开发一个人博客系统的伙伴，只要你有想法，都欢迎告诉我！

## 一、征集方向（不限于此，畅所欲言即可）

### 1. 功能相关：缺你想要的功能？告诉我！

- 是否希望新增"创作灵感草稿本"（快速记录碎片化想法，后续可转为正式文章）？
- 是否需要增加笔记功能，方便记录平时学习的内容？

### 2. 体验优化：用着不舒服？提出来！

- 操作流程：是否觉得某个功能的入口太深、步骤太繁琐？
- 界面设计：是否觉得界面不够美观、字体/颜色不合适，或移动端适配不够好？
- 性能问题：是否遇到加载速度慢、偶尔卡顿或异常报错的情况？

### 3. 其他建议：任何你想吐槽或建议的点

比如部署流程是否复杂，甚至是你希望新增的任何小功能、小细节，都可以告诉我。

## 二、参与方式（简单便捷，任选其一）

## 三、我的承诺

1. 每一条必看：无论你通过哪种方式反馈，我都会逐字阅读、认真记录，不会遗漏任何一条建议；

2. 及时反馈进度：对于大家关注度高、技术可行性强的需求，我会优先纳入开发计划，并在社群或博客公告中同步进展；

3. 尊重每一个想法：哪怕是看似微小的细节建议，只要对提升体验有帮助，我都会认真考量。

这款博客系统不仅是我的作品，更是属于每一位使用者的工具。你的每一个建议，都能让它变得更好。

再次感谢大家的支持！期待在评论区、邮箱或社群里，看到你的宝贵想法～

祝大家生活愉快！`,
  })

  /** 动态生成目录 */
  const tocItems = useMemo(() => parseTocFromContent(article.content), [article.content])

  /**
   * 渲染文章内容
   * @param content - 文章内容
   * @returns 渲染后的内容
   */
  const renderContent = (content: string): JSX.Element[] => {
    const lines = content.trim().split('\n')
    const elements: JSX.Element[] = []
    let listItems: string[] = []
    let h2Index = 0
    let h3Index = 0
    let currentH2Index = 0
    let orderedListItems: string[] = []

    /**
     * 刷新无序列表
     * @param index - 当前索引
     */
    const flushUnorderedList = (index: number): void => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${index}`} className={styles['article-list']}>
            {listItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    /**
     * 刷新有序列表
     * @param index - 当前索引
     */
    const flushOrderedList = (index: number): void => {
      if (orderedListItems.length > 0) {
        elements.push(
          <ol key={`ol-${index}`} className={styles['article-ordered-list']}>
            {orderedListItems.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        )
        orderedListItems = []
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('## ')) {
        flushUnorderedList(index)
        flushOrderedList(index)
        h2Index++
        currentH2Index = h2Index
        h3Index = 0
        elements.push(
          <h2 key={index} id={`h2-${h2Index}`} className={styles['article-h2']}>
            {trimmedLine.replace('## ', '')}
          </h2>
        )
      } else if (trimmedLine.startsWith('### ')) {
        flushUnorderedList(index)
        flushOrderedList(index)
        h3Index++
        elements.push(
          <h3 key={index} id={`h2-${currentH2Index}-h3-${h3Index}`} className={styles['article-h3']}>
            {trimmedLine.replace('### ', '')}
          </h3>
        )
      } else if (trimmedLine.startsWith('- ')) {
        flushOrderedList(index)
        listItems.push(trimmedLine.replace('- ', ''))
      } else if (/^\d+\.\s/.test(trimmedLine)) {
        flushUnorderedList(index)
        orderedListItems.push(trimmedLine.replace(/^\d+\.\s/, ''))
      } else if (trimmedLine) {
        flushUnorderedList(index)
        flushOrderedList(index)
        const processedLine = trimmedLine.replace(
          /\*\*(.+?)\*\*/g,
          '<strong class="highlight">$1</strong>'
        )
        elements.push(
          <p
            key={index}
            className={styles['article-paragraph']}
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        )
      }
    })

    flushUnorderedList(lines.length)
    flushOrderedList(lines.length + 1)

    return elements
  }

  return (
    <div className={styles['article-page']}>
      <Row gutter={24} className={styles['article-row']}>
        {/* 主内容区 */}
        <Col span={17}>
          <Card className={styles['article-card']}>
            {/* 文章标题 */}
            <h1 className={styles['article-title']}>{article.title}</h1>

            {/* 作者信息 */}
            <div className={styles['article-meta']}>
              <div className={styles['author-info']}>
                <Avatar src={article.authorAvatar} size={40} />
                <div className={styles['author-detail']}>
                  <span className={styles['author-name']}>{article.author}</span>
                  <div className={styles['publish-info']}>
                    <span>
                      <CalendarOutlined /> {article.publishTime}
                    </span>
                    <Tag color="green" className={styles['category-tag']}>
                      {article.category}
                    </Tag>
                  </div>
                </div>
              </div>
            </div>

            {/* 文章内容 */}
            <div className={styles['article-content']}>{renderContent(article.content)}</div>

            {/* 版权声明 */}
            <CopyrightCard author={article.author} publishTime={article.publishTime} />

            {/* 标签 */}
            <div className={styles['article-tags']}>
              <TagOutlined />
              {article.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            {/* 底部操作栏 */}
            <div className={styles['article-footer']}>
              <Button icon={<LikeOutlined />} className={styles['like-btn']}>
                {article.likes}
              </Button>
              <Button type="primary" icon={<ShareAltOutlined />} className={styles['share-btn']}>
                分享
              </Button>
            </div>
          </Card>
        </Col>

        {/* 右侧目录 */}
        <Col span={7}>
          <div className={styles['sidebar-wrapper']}>
            <ArticleToc items={tocItems} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default memo(Article)
