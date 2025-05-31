<script setup lang="ts">
/**
 * 2025/5/10 18:58
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 菜单组件
 * @version 1.0
 * @since 1.0
 */
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuData } from '@/global/menu-data.ts'

const router = useRouter()
const route = useRoute()

const state = reactive<{
  rootSubmenuKeys: string[]
  openKeys: string[]
  selectedKeys: string[]
}>({
  // 添加根菜单keys
  rootSubmenuKeys: ['article'],
  // 展开的菜单Key
  openKeys: [],
  // 选中的菜单Key
  selectedKeys: [],
})

/**
 * 根据当前路由设置菜单状态
 */
const setMenuStateByRoute = () => {
  const path = route.path
  const pathSegments = path.split('/').filter(Boolean)

  if (pathSegments.length === 0) {
    state.selectedKeys = ['dashboard']
    return
  }

  // 特殊处理 /article 路径
  if (path === '/article') {
    state.selectedKeys = ['list']
    state.openKeys = ['article']
    return
  }

  // 设置选中的菜单项
  const selectedKey = pathSegments[pathSegments.length - 1]
  state.selectedKeys = [selectedKey]

  // 如果是子菜单项，需要展开父菜单
  if (pathSegments.length > 1) {
    state.openKeys = [pathSegments[0]]
  }
}

// 组件挂载时初始化菜单状态
onMounted(() => {
  setMenuStateByRoute()
})

// 监听路由变化，同步更新菜单状态
watch(
  () => route.path,
  () => {
    setMenuStateByRoute()
  },
)

/**
 * 菜单展开事件
 * @param openKeys
 */
const onOpenChange = (openKeys: string[]) => {
  console.log(openKeys)
  const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1) as string
  if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    state.openKeys = openKeys
  } else {
    state.openKeys = latestOpenKey ? [latestOpenKey] : []
  }
}

/**
 * 菜单点击事件
 * @param item
 * @param keyPath
 */
const itemClickHandler = ({ keyPath }: { keyPath: string[] }) => {
  const rePath = rewritePath(keyPath)
  router.push(rePath)
}

/**
 * 路径重写
 * @param keyPath
 */
const rewritePath = (keyPath: string[]): string => {
  // 特殊处理文章列表
  if (keyPath.length === 2 && keyPath[0] === 'list' && keyPath[1] === 'article') {
    return '/article'
  }
  // keyPath是从子到父的顺序，需要反转
  return '/' + keyPath.join('/')
}
</script>

<template>
  <a-menu
    v-model:selectedKeys="state.selectedKeys"
    mode="inline"
    :open-keys="state.openKeys"
    :items="menuData"
    @openChange="onOpenChange"
    @click="itemClickHandler"
  />
</template>

<style scoped lang="less"></style>
