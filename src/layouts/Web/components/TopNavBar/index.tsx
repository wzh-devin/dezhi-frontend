/**
 * 2025/12/4 00:07.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 顶部导航栏
 * @version 1.0.0
 * @since 1.0.0
 */
import { memo, useState } from 'react'
import type { FC } from 'react'
import styles from './index.less'
import {
  HomeOutlined,
  FolderOutlined,
  ReadOutlined,
  MessageOutlined,
  FireOutlined,
  CloudOutlined,
  CommentOutlined,
  LinkOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { Layout, Avatar, Badge, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { history } from 'umi'

const { Header } = Layout

/** 路由映射配置 */
const routeMap: Record<string, string> = {
  home: '/',
  archive: '/archive',
  category: '/category',
  tag: '/tag',
  column: '/column',
  talk: '/talk',
  hot: '/hot',
  resource: '/resource',
  message: '/message',
  friend: '/friend',
  about: '/about',
}

/**
 * 顶部导航栏组件
 * @description 包含Logo、菜单、搜索框、通知和用户头像
 */
const TopNavBar: FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('home')

  /** 菜单项配置 */
  const menuItems: MenuProps['items'] = [
    { key: 'home', label: '首页', icon: <HomeOutlined /> },
    {
      key: 'archive-menu',
      label: '文章归档',
      icon: <FolderOutlined />,
      children: [
        { key: 'archive', label: '归档' },
        { key: 'category', label: '分类' },
        { key: 'tag', label: '标签' },
      ],
    },
    { key: 'column', label: '专栏', icon: <ReadOutlined /> },
    { key: 'talk', label: '说说', icon: <MessageOutlined /> },
    { key: 'hot', label: '热搜', icon: <FireOutlined /> },
    { key: 'resource', label: '资源', icon: <CloudOutlined /> },
    { key: 'message', label: '留言板', icon: <CommentOutlined /> },
    { key: 'friend', label: '友情链接', icon: <LinkOutlined /> },
    { key: 'about', label: '关于本站', icon: <InfoCircleOutlined /> },
  ]

  /**
   * 处理菜单点击跳转
   * @param info - 菜单点击信息
   */
  const handleMenuClick: MenuProps['onClick'] = (info) => {
    setActiveMenu(info.key)
    const route = routeMap[info.key]
    if (route) {
      history.push(route)
    }
  }

  /**
   * 处理Logo点击跳转首页
   */
  const handleLogoClick = (): void => {
    setActiveMenu('home')
    history.push('/')
  }

  return (
    <Header className={styles['top-nav-bar']}>
      <div className={styles['nav-container']}>
        {/* Logo */}
        <div className={styles['logo']} onClick={handleLogoClick}>
          <div className={styles['logo-icon']}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <circle cx="12" cy="12" r="10" fill="#667eea" />
              <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">
                N
              </text>
            </svg>
          </div>
          <span className={styles['logo-text']}>得智博客</span>
        </div>

        {/* 菜单栏 */}
        <Menu
          className={styles['nav-menu']}
          mode="horizontal"
          selectedKeys={[activeMenu]}
          items={menuItems}
          onClick={handleMenuClick}
        />

        {/* 右侧功能区 */}
        <div className={styles['nav-right']}>
          {/* 搜索按钮 */}
          <div className={styles['search-btn']}>
            <SearchOutlined />
            <span>搜索</span>
          </div>

          {/* 通知图标 */}
          <Badge count={0} size="small">
            <BellOutlined className={styles['nav-icon']} />
          </Badge>

          {/* 用户头像 */}
          <Avatar
            className={styles['user-avatar']}
            src="https://file.devin.wang/dezhi/image/e091869e-6add-407a-a62e-c368c006af17.jpg"
            onClick={() => history.push('/admin/login')}
          />
        </div>
      </div>
    </Header>
  )
}

export default memo(TopNavBar)
