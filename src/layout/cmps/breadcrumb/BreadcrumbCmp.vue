<script setup lang="ts">
/**
 * 2025/5/31 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 面包屑组件
 * @version 1.0
 * @since 1.0
 */
import { useRoute, useRouter } from 'vue-router'
import { getMenuInfo } from '@/global/menu-data.ts'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

/**
 * 生成面包屑项数据（包含路径和名称）
 */
const breadcrumbItems = computed(() => {
  const pathSegments = pathConvert()
  const menuInfo = getMenuInfo()

  return pathSegments.map((item, index) => {
    // 处理文章编辑页面的特殊情况
    if (item.startsWith('write')) {
      return {
        label: route.params.articleId ? '编辑文章' : '写文章',
        path: '/article/list/write' + (route.params.articleId ? `/${route.params.articleId}` : ''),
        key: item,
        isLast: index === pathSegments.length - 1,
      }
    }

    const menu = menuInfo.find((menu) => menu.key === item)
    const label = menu?.label as string

    // 构建路由路径
    let routePath = ''
    switch (item) {
      case 'dashboard':
        routePath = '/dashboard'
        break
      case 'material':
        routePath = '/material'
        break
      case 'recycle':
        routePath = '/material/recycle'
        break
      case 'comment':
        routePath = '/comment'
        break
      case 'system':
        routePath = '/system'
        break
      case 'ai':
        routePath = '/ai'
        break
      case 'list':
        routePath = '/article/list'
        break
      case 'tags':
        routePath = '/article/tags'
        break
      case 'category':
        routePath = '/article/category'
        break
      default:
        routePath = `/${item}`
    }

    return {
      label,
      path: routePath,
      key: item,
      isLast: index === pathSegments.length - 1,
    }
  })
})

/**
 * 处理面包屑项点击
 */
const handleBreadcrumbClick = (item: { path: string; isLast: boolean }) => {
  if (!item.isLast) {
    router.push(item.path)
  }
}

/**
 * 路径转换
 */
const pathConvert = (): string[] => {
  // 获取当前路由的路径段
  const pathSegments = route.path.split('/').filter((segment) => segment !== '')

  // 如果是文章编辑页面，特殊处理路径段
  if (route.name === 'article-write') {
    // 移除文章ID
    return pathSegments.filter((segment) => !segment.match(/^\d+$/))
  }

  // 去重处理，确保不会出现重复的路径段
  return [...new Set(pathSegments)]
}
</script>

<template>
  <div class="header-breadcrumb">
    <ABreadcrumb separator="👉">
      <ABreadcrumbItem v-for="(item, index) in breadcrumbItems" :key="index">
        <span v-if="item.isLast" class="breadcrumb-current">
          {{ item.label }}
        </span>
        <span v-else class="breadcrumb-link" @click="handleBreadcrumbClick(item)">
          {{ item.label }}
        </span>
      </ABreadcrumbItem>
    </ABreadcrumb>
  </div>
</template>

<style scoped lang="less">
.header-breadcrumb {
  .breadcrumb-link {
    color: #1677ff;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #4096ff;
      text-decoration: underline;
    }
  }

  .breadcrumb-current {
    color: #666;
    cursor: default;
  }
}
</style>
