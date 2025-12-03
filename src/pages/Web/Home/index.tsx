/**
 * 2025/11/2 22:53.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 博客首页
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useRef } from 'react'
import type { FC } from 'react'
import { Row, Col, Avatar, Tag, Card } from 'antd'
import {
  GithubOutlined,
  CameraOutlined,
  EyeOutlined,
  LikeOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import styles from './index.less'


/**
 * 左侧信息栏组件
 */
const LeftSideBar: FC = () => {
  const recommendArticles = [
    { title: 'Docker更换镜像源（阿里可用镜像源列表地址）', date: '2025-07-16' },
    { title: 'Redmi AX6 刷入小米官方QCA原生OpenWRT', date: '2025-07-15' },
    { title: '使用VScode+Keil，搭建单片机开发环境', date: '2025-07-14' },
    { title: 'Android4核固定ab/c皮壳数校验解决dpla问题', date: '2025-07-13' },
  ]

  return (
    <div className={styles['left-sidebar']}>
      {/* 作者信息卡片 */}
      <Card className={styles['author-info-card']} bordered={false}>
        <div className={styles['author-header']}>
          <div className={styles['author-label']}>博主资料</div>
          <div className={styles['author-settings']}>蜂巢</div>
        </div>
        <div className={styles['author-profile']}>
          <Avatar size={80} className={styles['author-avatar']}>
            P
          </Avatar>
          <h3 className={styles['author-name']}>Patrick Liu</h3>
          <p className={styles['author-intro']}>
            2026级运营大学生，
            <br />
            初级程序员，硬件爱好者，科技
            <br />
            爱好者
            <br />
            常驻资源宅在中，分享日常，
            <br />
            希望我所有性的...
          </p>
          <div className={styles['author-status']}>
            <span className={styles['status-badge']}>⚡ Live, Undefined. ⚡</span>
          </div>
          <div className={styles['author-social']}>
            <GithubOutlined className={styles['social-icon']} />
            <CameraOutlined className={styles['social-icon']} />
          </div>
          <div className={styles['author-more']}>了解更多 →</div>
        </div>
      </Card>

      {/* 热门文章卡片 */}
      <Card
        title={
          <div className={styles['card-title']}>
            <span>🔥 高门文章</span>
          </div>
        }
        className={styles['recommend-card']}
        bordered={false}
      >
        {recommendArticles.map((article, index) => (
          <div key={index} className={styles['recommend-item']}>
            <img
              src="https://via.placeholder.com/60x60"
              alt=""
              className={styles['recommend-img']}
            />
            <div className={styles['recommend-info']}>
              <div className={styles['recommend-title']}>{article.title}</div>
              <div className={styles['recommend-date']}>{article.date}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}

/**
 * 右侧内容区域组件
 */
const RightContent: FC = () => {
  const [activeTab, setActiveTab] = useState<string>('machine-learning')
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const contentTabs = [
    { key: 'machine-learning', label: '机器学习' },
    { key: 'deep-learning', label: '深度学习' },
    { key: 'reinforcement-learning', label: '强化学习' },
    { key: 'computer-vision', label: '编译' },
    { key: 'machine-robot', label: '机器人' },
    { key: 'esp32', label: 'ESP32' },
    { key: '51-single', label: '51单片机' },
    { key: 'embedded', label: '记录计算' },
    { key: 'operation-system', label: '操作体系' },
    { key: 'smart-hardware', label: '智能硬件' },
  ]

  const articles = [
    {
      category: 'Linux 全栈',
      tag: 'Ubuntu',
      title: 'Clonezilla完整Ubuntu系统后开机极慢/进入emergency mode的解决方法',
      date: '2025-07-16',
      image: 'https://via.placeholder.com/300x200/ff6b35/ffffff?text=开机化学堂',
    },
    {
      category: '嵌入式 单片',
      tag: 'STM32',
      title: '优雅地搭建STM32CubeMX+VSCode开发环境(OpenOCD+Make)',
      date: '2025-06-30',
      image: 'https://via.placeholder.com/300x200/1890ff/ffffff?text=开发不环境',
    },
    {
      category: 'Linux 全栈',
      tag: 'Clonezilla',
      title: 'Clonezilla完整Ubuntu系统后开机极慢/进入emergency mode的解决方法',
      date: '2025-07-16',
      image: 'https://via.placeholder.com/300x200/fa8c16/ffffff?text=固定单项目',
    },
    {
      category: 'NVIDIA 驱动',
      tag: 'Jetson',
      title: 'NVIDIA Jetson Xavier NX通过离线方式安装ROS2',
      date: '2025-06-30',
      image: 'https://via.placeholder.com/300x200/722ed1/ffffff?text=NVIDIA+驱动',
    },
  ]

  const handlerTabChange = (key: string) => {
    setActiveTab(key)
  }

  const handlerScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const handlerScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  return (
    <div className={styles['right-content']}>
      {/* 内容导航栏 */}
      <div className={styles['content-nav']}>
        <div className={styles['nav-tabs-wrapper']}>
          <div
            className={styles['nav-scroll-container']}
            ref={scrollContainerRef}
          >
            {contentTabs.map((tab) => (
              <div
                key={tab.key}
                className={`${styles['nav-tab-item']} ${
                  activeTab === tab.key ? styles['nav-tab-active'] : ''
                }`}
                onClick={() => handlerTabChange(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className={styles['article-list']}>
        <Row gutter={[24, 24]}>
          {articles.map((article, index) => (
            <Col span={12} key={index}>
              <Card className={styles['article-card']} bordered={false}>
                <div
                  className={styles['article-image-wrapper']}
                  style={{ backgroundImage: `url(${article.image})` }}
                >
                  <div className={styles['article-overlay']}>
                    <Tag className={styles['article-category']}>
                      {article.category}
                    </Tag>
                  </div>
                </div>
                <div className={styles['article-info']}>
                  <div className={styles['article-meta']}>
                    <Tag color="blue" className={styles['article-tag']}>
                      {article.tag}
                    </Tag>
                    <span className={styles['article-date']}>
                      {article.date}
                    </span>
                  </div>
                  <h3 className={styles['article-title']}>{article.title}</h3>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}

/**
 * 主页面组件
 */
const Home: FC = () => {
  return (
    <div className={styles['home-page']}>
      <Row gutter={24}>
        {/* 左侧信息栏 */}
        <Col span={6}>
          <LeftSideBar />
        </Col>

        {/* 右侧内容区域 */}
        <Col span={18}>
          <RightContent />
        </Col>
      </Row>
    </div>
  )
}

export default memo(Home)
