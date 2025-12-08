/**
 * 2025/12/4 00:07.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 顶部导航栏
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useState } from 'react'
import type { FC } from 'react'
import styles from './index.less'
import { SearchOutlined, SettingOutlined } from '@ant-design/icons'
import { Layout } from 'antd'
import { history } from 'umi'

const { Header } = Layout

const TopNavBar: FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>('home')

  const menuItems = [
    { key: 'home', label: '首页' },
    { key: 'ai', label: 'A I' },
    { key: 'develop', label: '开发' },
    { key: 'software', label: '软件' },
    { key: 'hardware', label: '硬件' },
    { key: 'network', label: '网络' },
    { key: 'about', label: '关于' },
  ]

  const handlerMenuClick = (key: string) => {
    setActiveMenu(key)
  }

  return (
    <Header className={styles['top-nav-bar']}>
      <div className={styles['nav-container']}>
        {/* Logo */}
        <div className={styles['logo']}>
          <div className={styles['logo-icon']}>
            <svg viewBox="0 0 100 50" className={styles['logo-svg']}>
              <text x="5" y="35" className={styles['logo-text']}>
                PΔ∨∠ERO
              </text>
            </svg>
          </div>
        </div>

        {/* 菜单栏 */}
        <div className={styles['nav-menu']}>
          {menuItems.map((item) => (
            <div
              key={item.key}
              className={`${styles['menu-item']} ${
                activeMenu === item.key ? styles['menu-item-active'] : ''
              }`}
              onClick={() => handlerMenuClick(item.key)}
            >
              {item.label}
            </div>
          ))}
        </div>

        {/* 右侧搜索和设置 */}
        <div className={styles['nav-right']}>
          <SearchOutlined className={styles['nav-icon']} />
          <SettingOutlined
            className={styles['nav-icon']}
            onClick={() => {
              history.push('/admin/login')
            }}
          />
        </div>
      </div>
    </Header>
  )
}

export default memo(TopNavBar)
