/**
 * 2025/12/7 21:55.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 后台顶部操作栏
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useMemo } from 'react'
import type { FC } from 'react'
import { useLocation } from 'umi'
import { Layout, Input, Avatar, Breadcrumb, Dropdown, Tooltip } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  SearchOutlined,
  ExpandOutlined,
  GlobalOutlined,
  SunOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import style from './index.less'

const { Header } = Layout

// 路由路径到名称的映射
const routeNameMap: Record<string, string> = {
  '/admin': '首页',
  '/admin/dashboard': '仪表盘',
  '/admin/content': '内容管理',
  '/admin/content/article': '文章管理',
  '/admin/content/category': '分类管理',
  '/admin/content/tags': '标签管理',
  '/admin/file': '文件素材管理',
  '/admin/system': '系统管理',
  '/admin/system/config': '系统配置',
  '/admin/system/ai-config': 'AI智能体配置',
}

interface AdminHeaderProps {
  collapsed: boolean
  onToggleCollapsed: () => void
}

const AdminHeader: FC<AdminHeaderProps> = ({ collapsed, onToggleCollapsed }) => {
  const location = useLocation()

  // 根据当前路径生成面包屑数据
  const breadcrumbItems = useMemo(() => {
    const pathSnippets = location.pathname.split('/').filter((i) => i)
    const items = [{ title: '首页' }]

    let currentPath = ''
    pathSnippets.forEach((snippet, index) => {
      currentPath += `/${snippet}`

      // 跳过 'admin' 本身，因为已经有首页了
      if (index === 0 && snippet === 'admin') {
        return
      }

      const name = routeNameMap[currentPath]
      if (name) {
        items.push({ title: name })
      }
    })

    return items
  }, [location.pathname])

  const userDropdownItems: MenuProps['items'] = [
    { key: 'profile', label: '个人中心' },
    { key: 'settings', label: '账号设置' },
    { type: 'divider' },
    { key: 'logout', label: '退出登录' },
  ]

  return (
    <Header
      className={`${style['admin-header']} ${collapsed ? style['admin-header--collapsed'] : ''}`}
    >
      {/* 左侧：折叠按钮 + 面包屑 */}
      <div className={style['admin-header__left']}>
        <div className={style['admin-header__collapse-btn']} onClick={onToggleCollapsed}>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <Breadcrumb className={style['admin-header__breadcrumb']} items={breadcrumbItems} />
      </div>

      {/* 右侧：搜索框 + 工具栏 + 用户信息 */}
      <div className={style['admin-header__right']}>
        <Input
          className={style['admin-header__search']}
          placeholder="搜索"
          prefix={<SearchOutlined />}
          suffix={<span className={style['admin-header__search-shortcut']}>⌘K</span>}
        />

        <div className={style['admin-header__toolbar']}>
          <Tooltip title="全屏">
            <div className={style['admin-header__toolbar-item']}>
              <ExpandOutlined />
            </div>
          </Tooltip>
          <Tooltip title="通知">
            <div className={style['admin-header__toolbar-item']}>
              <BellOutlined />
            </div>
          </Tooltip>
          <Tooltip title="语言">
            <div className={style['admin-header__toolbar-item']}>
              <GlobalOutlined />
            </div>
          </Tooltip>
          <Tooltip title="设置">
            <div className={style['admin-header__toolbar-item']}>
              <SettingOutlined />
            </div>
          </Tooltip>
          <Tooltip title="主题">
            <div className={style['admin-header__toolbar-item']}>
              <SunOutlined />
            </div>
          </Tooltip>

          <Dropdown menu={{ items: userDropdownItems }} placement="bottomRight">
            <div className={style['admin-header__user']}>
              <Avatar className={style['admin-header__avatar']} size={32} icon={<UserOutlined />} />
              <span className={style['admin-header__username']}>Admin</span>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  )
}

export default memo(AdminHeader)
