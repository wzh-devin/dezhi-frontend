<script setup lang="ts">
/**
 * 2025/5/31 18:12
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 面包屑组件
 * @version 1.0
 * @since 1.0
 */
import { useRoute } from 'vue-router'
import { getMenuInfo } from '@/global/menu-data.ts'
import { computed } from 'vue'

const route = useRoute()

/**
 * 返回菜单映射
 * key ==> label
 */
const breadcrumbNames = computed(() => {
  return pathConvert().map((item) => {
    return getMenuInfo().find((menu) => menu.key === item)?.label as string
  })
})

/**
 * 路径转换
 */
const pathConvert = (): string[] => {
  return route.matched
    .map((item) => {
      return item.path.split('/')
    })
    .reduce((a: string[], b: string[]) => a.concat(b))
    .filter((key) => key !== '')
}
</script>

<template>
  <div class="header-breadcrumb">
    <a-breadcrumb separator="👉">
      <a-breadcrumb-item v-for="(name, index) in breadcrumbNames" :key="index">
        {{ name }}
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<style scoped lang="less"></style>
