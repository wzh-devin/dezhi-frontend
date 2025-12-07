/**
 * 2025/12/7 21:55.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 后台布局
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState, useEffect } from 'react'
import type { FC } from 'react'
import { Outlet, useNavigate, useLocation } from 'umi'
import { Layout } from 'antd'
import type { MenuProps } from 'antd'
import AdminSider from './components/AdminSider'
import AdminHeader from './components/AdminHeader'
import style from './index.less'

const { Content } = Layout

const AdminLayout: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<string[]>(['/admin/dashboard'])
  const [openKeys, setOpenKeys] = useState<string[]>(['content', 'system'])

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    setSelectedKeys([location.pathname])
  }, [location.pathname])

  const handleToggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    // 如果是父级菜单（没有路由），不进行跳转
    if (e.key === 'content' || e.key === 'system') {
      return
    }
    setSelectedKeys([e.key])
    navigate(e.key)
  }

  const handleOpenChange: MenuProps['onOpenChange'] = (keys) => {
    setOpenKeys(keys)
  }

  return (
    <Layout className={style['admin-layout']}>
      {/* 左侧菜单栏 */}
      <AdminSider
        collapsed={collapsed}
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onMenuClick={handleMenuClick}
        onOpenChange={handleOpenChange}
      />

      <Layout>
        {/* 顶部操作栏 */}
        <AdminHeader collapsed={collapsed} onToggleCollapsed={handleToggleCollapsed} />

        {/* 内容区域 */}
        <Content
          className={`${style['admin-layout__content']} ${collapsed ? style['admin-layout__content--collapsed'] : ''}`}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default memo(AdminLayout)
