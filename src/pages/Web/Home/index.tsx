/**
 * 2025/11/2 22:53.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 博客首页
 * @version 1.0.0
 * @since 1.0.0
 */
import { memo, useState, useRef } from 'react'
import type { FC } from 'react'
import { Row, Col, Avatar, Card, Carousel, Button, Pagination } from 'antd'
import {
  GithubOutlined,
  ClockCircleOutlined,
  NotificationOutlined,
  MessageOutlined,
  LeftOutlined,
  RightOutlined,
  AppstoreOutlined,
  CodeOutlined,
  DesktopOutlined,
  DatabaseOutlined,
  BugOutlined,
  CloudDownloadOutlined,
  ToolOutlined,
  FileTextOutlined,
  StarOutlined,
  MailOutlined,
  WechatOutlined,
  QqOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import { history } from 'umi'
import ArticleCard from '@/components/ArticleCard'
import type { ArticleData } from '@/components/ArticleCard'
import styles from './index.less'

/**
 * 主内容区组件
 * @description 包含轮播图、说说、分类导航和文章列表
 */
const MainContent: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 分类标签数据
  const contentTabs = [
    { key: 'all', label: '全部', icon: <AppstoreOutlined /> },
    { key: 'backend', label: '后端开发', icon: <CodeOutlined /> },
    { key: 'frontend', label: '前端开发', icon: <DesktopOutlined /> },
    { key: 'database', label: '数据库', icon: <DatabaseOutlined /> },
    { key: 'crawler', label: '网络爬虫', icon: <BugOutlined /> },
    { key: 'resource', label: '资源软件', icon: <CloudDownloadOutlined /> },
    { key: 'devops', label: '运维部署', icon: <ToolOutlined /> },
    { key: 'blog-doc', label: '博客文档', icon: <FileTextOutlined /> },
  ]

  // 轮播图数据
  const bannerList = [
    {
      id: 1,
      title: '基于websocket的web聊天室系统',
      image: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 2,
      title: '【诚挚邀约】你的每一个建议，都是这款博客系统的成长动力',
      image: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
  ]

  // 最新说说数据
  const talkList = [
    '1. 前端热点日干货，去日切去到来DDOS，能解决人部分的DDOS攻击。',
    '2. 服务器被加田内封林林功能，反攻击流量才能仿制🔥',
  ]

  // 文章列表数据
  const articles: ArticleData[] = [
    {
      id: 1,
      isTop: true,
      isOriginal: true,
      title: '【诚挚邀约】你的每一个建议，都是这款博客系统的成长动力',
      summary: '系统需求和优化征集，欢迎大家来畅所欲言',
      author: 'Devin',
      authorAvatar: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
      date: '2025-07-16',
      views: 1234,
      category: '博客文档',
      readTime: '5分钟',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 2,
      isTop: false,
      isOriginal: true,
      title: 'Docker更换镜像源（阿里可用镜像源列表地址）',
      summary: '由于国内网络环境的原因，直接使用Docker官方镜像源下载镜像速度较慢，本文介绍如何更换为阿里云镜像源...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2025-07-15',
      views: 856,
      category: '运维部署',
      readTime: '8分钟',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 3,
      isTop: false,
      isOriginal: true,
      title: 'Spring Boot 结合 WxJava 实现文章上传微信公众号草稿箱与群发',
      summary: '在数字化营销与内容传播日益重要的今天，微信公众号已成为企业和个人进行信息发布与推广的重要平台...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '8个月前',
      views: 265,
      category: '后端开发',
      readTime: '5分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 4,
      isTop: false,
      isOriginal: false,
      title: 'mybatisorg.xml.sax.SAXParseException; lineNumber: 2; columnNumber: 6',
      summary: '解决mybatisorg.xml.sax.SAXParseException; lineNumber: 2; columnNumber: 6; 不允许有匹配 "[xX][mM][lL]" 的处理指令目标的问题',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '8个月前',
      views: 143,
      category: '后端开发',
      readTime: '1分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 5,
      isTop: false,
      isOriginal: true,
      title: 'v-if动态设置Element表格列时，出现表格列显示错乱、表头闪动等问题',
      summary: '在实际开发中，我们经常会通过v-if控制表格列的显隐，来实现不同条件下展示不同的表格列，这时候就可能会出现表格列显示错乱...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '8个月前',
      views: 172,
      category: '前端开发',
      readTime: '1分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 6,
      isTop: false,
      isOriginal: true,
      title: 'Vue实现不同网站之间的Cookie共享功能',
      summary: '通过两种方法解决不同网站之间的Cookie共享功能，从前端和后端角度各自实现。',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '8个月前',
      views: 213,
      category: '前端开发',
      readTime: '1分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 7,
      isTop: false,
      isOriginal: true,
      title: 'Vue3中常用的一些方法使用手册',
      summary: 'Vue3中常用的一些方法使用手册，包括组合式API、响应式数据、生命周期钩子等...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2024-03-20',
      views: 445,
      category: '前端开发',
      readTime: '10分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 8,
      isTop: false,
      isOriginal: true,
      title: 'MySQL中如何进行字符串替换',
      summary: 'MySQL中字符串替换的几种方法，包括REPLACE函数、REGEXP_REPLACE函数等...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2024-01-26',
      views: 312,
      category: '数据库',
      readTime: '3分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 9,
      isTop: false,
      isOriginal: true,
      title: 'springboot实现自定义注解限流',
      summary: '使用Spring Boot实现自定义注解限流，基于Redis实现分布式限流...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2023-07-25',
      views: 567,
      category: '后端开发',
      readTime: '8分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 10,
      isTop: false,
      isOriginal: true,
      title: 'springboot+vue实现微信公众号扫码登录',
      summary: '使用Spring Boot和Vue实现微信公众号扫码登录功能，包括后端接口和前端页面...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2023-07-04',
      views: 789,
      category: '后端开发',
      readTime: '12分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 11,
      isTop: false,
      isOriginal: true,
      title: 'Spring Cloud的gateway之动态路由配置',
      summary: 'Spring Cloud Gateway动态路由配置，支持从数据库或配置中心动态加载路由...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2021-09-01',
      views: 1023,
      category: '后端开发',
      readTime: '6分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
    {
      id: 12,
      isTop: false,
      isOriginal: true,
      title: 'Redis实现分布式锁的几种方式',
      summary: 'Redis实现分布式锁的几种方式，包括SETNX、Redisson、RedLock等...',
      author: 'Devin',
      authorAvatar: 'https://via.placeholder.com/24',
      date: '2021-08-15',
      views: 1456,
      category: '后端开发',
      readTime: '10分钟阅读',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
    },
  ]

  /**
   * 处理标签切换
   * @param key - 标签key
   */
  const handleTabChange = (key: string): void => {
    setActiveTab(key)
  }

  /**
   * 处理左滚动
   */
  const handleScrollLeft = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  /**
   * 处理右滚动
   */
  const handleScrollRight = (): void => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  /**
   * 处理分页变化
   * @param page - 页码
   */
  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
  }

  /**
   * 处理文章点击跳转
   * @param id - 文章ID
   */
  const handleArticleClick = (id: number): void => {
    history.push(`/article/${id}`)
  }

  // 分页配置
  const pageSize = 10
  const startIndex = (currentPage - 1) * pageSize
  const currentArticles = articles.slice(startIndex, startIndex + pageSize)

  return (
    <div className={styles['main-content']}>
      {/* 轮播图/Banner */}
      <div className={styles['banner-wrapper']}>
        <Carousel autoplay effect="fade">
          {bannerList.map((banner) => (
            <div key={banner.id}>
              <div
                className={styles['banner-item']}
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className={styles['banner-content']}>
                  <h2 className={styles['banner-title']}>{banner.title}</h2>
                  <Button type="primary" className={styles['banner-btn']}>
                    阅读更多 <RightOutlined />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* 最新说说 */}
      <Card className={styles['talk-card']}>
        <div className={styles['talk-content']}>
          <div className={styles['talk-label']}>
            <MessageOutlined />
            <span>最新说说:</span>
          </div>
          <div className={styles['talk-text']}>
            {talkList.map((talk, index) => (
              <span key={index} className={styles['talk-item']}>
                {talk}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* 分类导航栏 */}
      <div className={styles['content-nav']}>
        <div className={styles['nav-arrow']} onClick={handleScrollLeft}>
          <LeftOutlined />
        </div>
        <div className={styles['nav-tabs-wrapper']}>
          <div className={styles['nav-scroll-container']} ref={scrollContainerRef}>
            {contentTabs.map((tab) => (
              <div
                key={tab.key}
                className={`${styles['nav-tab-item']} ${
                  activeTab === tab.key ? styles['nav-tab-active'] : ''
                }`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles['nav-arrow']} onClick={handleScrollRight}>
          <RightOutlined />
        </div>
      </div>

      {/* 文章列表 */}
      <div className={styles['article-list']}>
        {currentArticles.map((article) => (
          <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
        ))}
      </div>

      {/* 分页 */}
      <div className={styles['pagination-wrapper']}>
        <Pagination
          current={currentPage}
          total={articles.length}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </div>
    </div>
  )
}

/**
 * 右侧边栏组件
 * @description 包含用户信息、公告和推荐文章
 */
const RightSidebar: FC = () => {
  // 推荐文章数据
  const recommendArticles = [
    {
      id: 1,
      title: 'Vue3中常用的一些方法使用手册',
      cover: 'https://via.placeholder.com/60x60/52c41a/ffffff?text=Vue3',
      date: '2024-03-20 11:25:46',
    },
    {
      id: 2,
      title: 'MySQL中如何进行字符串替换',
      cover: 'https://via.placeholder.com/60x60/00758f/ffffff?text=MySQL',
      date: '2024-01-26 10:23:17',
    },
    {
      id: 3,
      title: 'springboot实现自定义注解限流',
      cover: 'https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg',
      date: '2023-07-25 17:07:19',
    },
    {
      id: 4,
      title: 'springboot+vue实现微信公众号扫码登录',
      cover: 'https://via.placeholder.com/60x60/07c160/ffffff?text=WeChat',
      date: '2023-07-04 18:20:45',
    },
    {
      id: 5,
      title: 'Spring Cloud的gateway之动态路由配置',
      cover: 'https://via.placeholder.com/60x60/6db33f/ffffff?text=Gateway',
      date: '2021-09-01 10:35:13',
    },
  ]

  // 标签云数据
  const tagCloud = [
    { name: 'Docker', size: 'medium' },
    { name: 'Aspect', size: 'small' },
    { name: 'Java Script', size: 'medium' },
    { name: 'Vue', size: 'large' },
    { name: 'Spring Cloud', size: 'large' },
    { name: 'oauth2', size: 'small' },
    { name: '并发', size: 'small' },
    { name: '博客', size: 'medium', color: '#ff4d4f' },
    { name: 'Spring Boot', size: 'large', color: '#52c41a' },
    { name: 'Redis', size: 'medium', color: '#ff4d4f' },
    { name: '服务器', size: 'small' },
    { name: 'Elasticsearch', size: 'medium', color: '#52c41a' },
    { name: 'Linux', size: 'medium' },
    { name: 'Mysql', size: 'small' },
  ]

  return (
    <div className={styles['right-sidebar']}>
      {/* 用户信息卡片 */}
      <Card className={styles['user-card']}>
        <div className={styles['user-bg']} />
        <div className={styles['user-profile']}>
          <div className={styles['avatar-wrapper']}>
            <Avatar
              size={80}
              className={styles['user-avatar']}
              src="https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg"
            />
            <span className={styles['online-status']}>在线</span>
          </div>
          <h3 className={styles['user-name']}>Devin</h3>
          <p className={styles['user-signature']}>十八岁以后我的梦想变成了买房买车。</p>
          <div className={styles['social-links']}>
            <GithubOutlined className={styles['social-icon']} />
            <QqOutlined className={styles['social-icon']} />
            <MailOutlined className={styles['social-icon']} />
            <WechatOutlined className={styles['social-icon']} />
          </div>
        </div>
      </Card>

      {/* 公告区域 */}
      <Card className={styles['notice-card']}>
        <div className={styles['card-header']}>
          <span className={styles['header-line']} />
          <NotificationOutlined className={styles['header-icon']} />
          <span className={styles['header-title']}>公告</span>
        </div>
        <div className={styles['notice-content']}>
          <p>
            本站基于 <a className={styles['link-green']}>React</a> +{' '}
            <a className={styles['link-blue']}>Ant Design</a> +{' '}
            <a className={styles['link-orange']}>Spring Boot 3</a>
          </p>
          <p>
            开发，源码已开源。<a className={styles['link-red']}>点我直达</a>
          </p>
          <p className={styles['notice-text']}>有问题欢迎通过邮箱或其他社交方式联系我。</p>
          <p className={styles['notice-ad']}>
            🎉🎉 本站提供优质广告位，覆盖技术、生活等多领域受众，欢迎私信联系
          </p>
        </div>
      </Card>

      {/* 推荐文章 */}
      <Card className={styles['recommend-card']}>
        <div className={styles['card-header']}>
          <span className={styles['header-line']} />
          <StarOutlined className={styles['header-icon']} />
          <span className={styles['header-title']}>推荐文章</span>
        </div>
        {recommendArticles.map((article, index) => (
          <div key={article.id} className={styles['recommend-item']}>
            <span className={styles['recommend-index']}>{index + 1}</span>
            <img src={article.cover} alt="" className={styles['recommend-img']} />
            <div className={styles['recommend-info']}>
              <div className={styles['recommend-title']}>{article.title}</div>
              <div className={styles['recommend-date']}>
                <ClockCircleOutlined /> {article.date}
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* 标签云 */}
      <Card className={styles['tag-cloud-card']}>
        <div className={styles['card-header']}>
          <span className={styles['header-line']} />
          <TagsOutlined className={styles['header-icon']} />
          <span className={styles['header-title']}>标签云</span>
        </div>
        <div className={styles['tag-cloud-content']}>
          {tagCloud.map((tag, index) => (
            <span
              key={index}
              className={`${styles['tag-item']} ${styles[`tag-${tag.size}`]}`}
              style={tag.color ? { color: tag.color } : undefined}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </Card>
    </div>
  )
}

/**
 * 主页面组件
 * @description 博客首页，包含主内容区和侧边栏
 */
const Home: FC = () => {
  return (
    <div className={styles['home-page']}>
      <Row gutter={24} className={styles['home-row']}>
        {/* 左侧主内容区 */}
        <Col span={17}>

          <MainContent />
        </Col>

        {/* 右侧边栏 */}
        <Col span={7} className={styles['sidebar-col']}>
          <div className={styles['sidebar-wrapper']}>
            <RightSidebar />
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default memo(Home)
