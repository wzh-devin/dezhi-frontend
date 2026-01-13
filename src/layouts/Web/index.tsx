/**
 * 2025/11/13 18:44
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 博客网站布局
 * @version 1.0.0
 * @since 1.0.0
 */
import type { FC } from 'react'
import { memo } from 'react'
import { Layout } from 'antd'
import { Outlet } from 'umi'
import styles from './index.less'
import TopNavBar from '@/layouts/Web/components/TopNavBar'
import NoticeBanner from '@/layouts/Web/components/NoticeBanner'

const { Content } = Layout

/**
 * 主布局组件
 * @description 博客网站主布局，包含导航栏、公告和内容区
 */
const WebLayout: FC = () => {
  return (
    <Layout className={styles['web-layout']}>
      {/* 顶部导航栏 */}
      <TopNavBar />

      {/* 公告横幅 */}
      <NoticeBanner />

      {/* 主内容区域 */}
      <Content className={styles['main-content']}>
        <div className={styles['page-content']}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

export default memo(WebLayout)
