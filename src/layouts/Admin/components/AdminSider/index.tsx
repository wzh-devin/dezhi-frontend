/**
 * 2025/12/7 21:55.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 后台左侧菜单栏
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
  TagsOutlined,
  FolderOutlined,
  SettingOutlined,
  HistoryOutlined,
  RobotOutlined,
  FileOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import style from './index.less'

const { Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

const getMenuItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem => {
  return { key, icon, children, label } as MenuItem
}

// 菜单项配置，key 对应路由路径
const menuItems: MenuItem[] = [
  getMenuItem('仪表盘', '/admin/dashboard', <DashboardOutlined />),
  getMenuItem('内容管理', 'content', <FileTextOutlined />, [
    getMenuItem('文章管理', '/admin/content/article', <FileTextOutlined />),
    getMenuItem('标签管理', '/admin/content/tags', <TagsOutlined />),
    getMenuItem('分类管理', '/admin/content/category', <FolderOutlined />),
  ]),
  getMenuItem('文件素材管理', '/admin/file', <FileOutlined />),
  getMenuItem('系统管理', 'system', <SettingOutlined />, [
    getMenuItem('系统配置', '/admin/system/config', <SettingOutlined />),
    getMenuItem('AI智能体配置', '/admin/system/ai-config', <RobotOutlined />),
  ]),
]

interface AdminSiderProps {
  collapsed: boolean
  selectedKeys: string[]
  openKeys: string[]
  onMenuClick: MenuProps['onClick']
  onOpenChange: MenuProps['onOpenChange']
}

const AdminSider: FC<AdminSiderProps> = ({
  collapsed,
  selectedKeys,
  openKeys,
  onMenuClick,
  onOpenChange,
}) => {
  return (
    <Sider
      className={style['admin-sider']}
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={220}
      collapsedWidth={64}
    >
      {/* Logo */}
      <div className={style['admin-sider__logo']}>
        <div className={style['admin-sider__logo-icon']}>D</div>
        {!collapsed && <span className={style['admin-sider__logo-text']}>Dezhi Admin</span>}
      </div>

      {/* 菜单 */}
      <Menu
        className={style['admin-sider__menu']}
        mode="inline"
        selectedKeys={selectedKeys}
        openKeys={collapsed ? [] : openKeys}
        items={menuItems}
        onClick={onMenuClick}
        onOpenChange={onOpenChange}
      />

      {/* 版本号 */}
      <div className={style['admin-sider__version']}>{!collapsed && <span>v1.0.0</span>}</div>
    </Sider>
  )
}

export default memo(AdminSider)
