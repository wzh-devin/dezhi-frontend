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
    const menu = menuInfo.find((menu) => menu.key === item)
    const label = menu?.label as string

    // 构建路由路径
    let routePath = ''
    if (item === 'dashboard') {
      routePath = '/dashboard'
    } else if (item === 'material') {
      routePath = '/material'
    } else if (item === 'recycle') {
      routePath = '/material/recycle'
    } else if (item === 'comment') {
      routePath = '/comment'
    } else if (item === 'system') {
      routePath = '/system'
    } else if (item === 'ai') {
      routePath = '/ai'
    } else if (item === 'list') {
      routePath = '/article/list'
    } else if (item === 'tags') {
      routePath = '/article/tags'
    } else if (item === 'category') {
      routePath = '/article/category'
    } else {
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
  // 直接使用当前路由的完整路径，避免重复
  const pathSegments = route.path.split('/').filter((segment) => segment !== '')

  // 去重处理，确保不会出现重复的路径段
  return [...new Set(pathSegments)]
}
</script>

<template>
  <div class="header-breadcrumb">
    <a-breadcrumb separator="👉">
      <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <span v-if="item.isLast" class="breadcrumb-current">
          {{ item.label }}
        </span>
        <span v-else class="breadcrumb-link" @click="handleBreadcrumbClick(item)">
          {{ item.label }}
        </span>
      </a-breadcrumb-item>
    </a-breadcrumb>
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
