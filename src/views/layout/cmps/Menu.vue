<script setup lang="ts">
/**
 * 2025/5/10 18:58
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 菜单组件
 * @version 1.0
 * @since 1.0
 */
import { h, reactive, type VNode } from 'vue'
import type { ItemType } from 'ant-design-vue'
import {
  AppstoreOutlined,
  DashboardOutlined,
  EditOutlined,
  FileTextOutlined,
  FolderOpenOutlined,
  MessageOutlined,
  RobotOutlined,
  SettingOutlined,
  TagsOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import useLayoutStore from '@/store/layout'

function getItem(
  label: string,
  key: string,
  icon?: VNode | (() => VNode),
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType
}

const router = useRouter()
const layoutStore = useLayoutStore()

/**
 * 菜单数据 ==> TODO 后续以后端动态配置
 */
const items: ItemType[] = [
  getItem('管理控制台', 'dashboard', () => h(DashboardOutlined)),
  getItem('文章管理', 'article', () => h(FileTextOutlined), [
    getItem('文章撰写', 'article-write', () => h(EditOutlined)),
    getItem('标签配置', 'article-tag', () => h(TagsOutlined)),
    getItem('分类配置', 'article-category', () => h(AppstoreOutlined)),
  ]),
  getItem('评论管理', 'comment', () => h(MessageOutlined)),
  getItem('文件素材管理', 'material', () => h(FolderOpenOutlined)),
  getItem('系统管理', 'system', () => h(SettingOutlined)),
  getItem('AI智能体配置', 'ai', () => h(RobotOutlined)),
]

const state = reactive<{
  rootSubmenuKeys: string[]
  openKeys: string[]
  selectedKeys: string[]
}>({
  rootSubmenuKeys: [],
  // 展开的菜单Key
  openKeys: [],
  // 选中的菜单Key
  selectedKeys: ['dashboard'],
})

/**
 * 菜单展开事件
 * @param openKeys
 */
const onOpenChange = (openKeys: string[]) => {
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1)
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}

/**
 * 菜单点击事件
 * @param item
 * @param key
 * @param keyPath
 */
const itemClickHandler = ({ item, keyPath }) => {
  layoutStore.setActiveItemAction(item.originItemValue)
  router.push(rewritePath(keyPath))
}

/**
 * 路径重写
 * @param keyPath
 */
const rewritePath = (keyPath: string[]): string => {
  return keyPath.join('/')
}
</script>

<template>
  <a-menu
    v-model:selectedKeys="state.selectedKeys"
    mode="inline"
    :open-keys="state.openKeys"
    :items="items"
    @openChange="onOpenChange"
    @click="itemClickHandler"
  />
</template>

<style scoped lang="less"></style>
