/**
 * 2025/6/1 0:32
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import { h, type VNode } from 'vue'
import {
  AppstoreOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  RobotOutlined,
  SettingOutlined,
  TagsOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'

interface IMenuData {
  label: string
  key: string
  parentKey?: string
  icon?: VNode | (() => VNode)
  children?: IMenuData[]
  type?: 'group'
}

export const menuData: Array<IMenuData> = [
  {
    key: 'dashboard',
    label: '管理控制台',
    icon: () => h(DashboardOutlined),
  },
  {
    key: 'article',
    label: '文章管理',
    icon: () => h(FileTextOutlined),
    children: [
      {
        key: 'list',
        label: '文章列表',
        icon: () => h(UnorderedListOutlined),
      },
      {
        key: 'tags',
        label: '标签配置',
        icon: () => h(TagsOutlined),
      },
      {
        key: 'category',
        label: '分类配置',
        icon: () => h(AppstoreOutlined),
      },
    ],
  },
  {
    key: 'comment',
    label: '评论管理',
    icon: () => h(MessageOutlined),
  },
  {
    key: 'material',
    label: '文件素材管理',
    icon: () => h(FolderOpenOutlined),
  },
  {
    key: 'system',
    label: '系统管理',
    icon: () => h(SettingOutlined),
  },
  {
    key: 'ai',
    label: 'AI智能体配置',
    icon: () => h(RobotOutlined),
  },
]

/**
 * 需要隐藏的菜单
 */
const visibleMenuData: Array<IMenuData> = [
  {
    key: 'recycle',
    parentKey: 'material',
    label: '回收站',
  },
]

/**
 * 获取菜单信息
 * @returns menuInfo
 */
export const getMenuInfo = (): Array<{ key: string; label: string }> => {
  const menuInfo: Array<{ key: string; label: string }> = []
  const addedKeys = new Set<string>()

  menuData.forEach((menu: IMenuData) => {
    // 处理子菜单数据
    menu?.children?.forEach((child: IMenuData) => {
      if (!addedKeys.has(child?.key)) {
        menuInfo.push({
          key: child?.key as string,
          label: child?.label as string,
        })
        addedKeys.add(child?.key)
      }
    })

    // 处理父菜单数据
    if (!addedKeys.has(menu?.key)) {
      menuInfo.push({
        key: menu?.key as string,
        label: menu?.label as string,
      })
      addedKeys.add(menu?.key)
    }
  })

  // 处理额外的可见菜单项
  visibleMenuData.forEach((menu: IMenuData) => {
    const index = menuInfo.findIndex((item: { key: string }) => item.key === menu.parentKey)
    if (index !== -1 && !addedKeys.has(menu.key)) {
      menuInfo.push({ key: menu.key, label: menu.label })
      addedKeys.add(menu.key)
    }
  })

  console.log(menuInfo)
  return menuInfo
}
