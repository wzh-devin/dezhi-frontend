/**
 * 2025/12/4 00:10.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 热门组件模块
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Button, Card, Col, Row } from 'antd'
import styles from './index.less'

const HotModule: FC = () => {
  const handlerLogout = () => {
    console.log('退出')
  }

  const handlerCategory = () => {
    console.log('分类')
  }

  const hotArticles = [
    {
      title: 'Intel NUC配置YOLO训练',
      subtitle: '(Python3/PyTorch/Ultralytics)',
      icon: '🐍',
      bgColor: '#1890ff',
    },
    {
      title: '各Jetson开发生产环境之编配置',
      icon: '🚀',
      bgColor: '#52c41a',
    },
    {
      title: 'NVIDIA Jetson Xavier NX',
      subtitle: '通过离线进装安装ROS2...',
      icon: '🤖',
      bgColor: '#722ed1',
    },
    {
      title: '搭建不环境',
      subtitle: '通过VSCode SSH远程连接Ubuntu进程Platform...',
      icon: '💻',
      bgColor: '#fa8c16',
    },
    {
      title: '生产环境配置',
      subtitle: 'Intel NUC (Ubuntu)生产环境配置',
      icon: '⚙️',
      bgColor: '#13c2c2',
    },
    {
      title: 'Docker更换镜像源',
      subtitle: '(阿里可用镜像源列迭址)',
      icon: '🐳',
      bgColor: '#1890ff',
    },
  ]

  return (
    <div className={styles['hot-module']}>
      <Row gutter={24}>
        {/* 左侧作者信息卡片 */}
        <Col span={8}>
          <Card className={styles['author-card']}>
            <div className={styles['author-content']}>
              <div className={styles['author-greeting']}>
                <h2 className={styles['greeting-title']}>你好，朋友！</h2>
                <p className={styles['greeting-subtitle']}>欢迎来到</p>
                <h3 className={styles['author-name']}>PΔ∨∠ERO</h3>
                <p className={styles['author-desc']}>的个人博客</p>
              </div>

              <div className={styles['author-actions']}>
                <Button type="primary" className={styles['action-button']} onClick={handlerLogout}>
                  退出
                </Button>
                <Button className={styles['action-button-secondary']} onClick={handlerCategory}>
                  分类
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* 右侧热门文章卡片 */}
        <Col span={16}>
          <div className={styles['hot-articles']}>
            <Row gutter={[16, 16]}>
              {hotArticles.map((article, index) => (
                <Col span={8} key={index}>
                  <Card
                    className={styles['hot-article-card']}
                    style={{ backgroundColor: article.bgColor }}
                    bodyStyle={{ padding: '20px' }}
                  >
                    <div className={styles['article-icon']}>{article.icon}</div>
                    <h4 className={styles['article-title']}>{article.title}</h4>
                    {article.subtitle && (
                      <p className={styles['article-subtitle']}>{article.subtitle}</p>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default memo(HotModule)
