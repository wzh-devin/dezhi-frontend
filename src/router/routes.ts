/**
 * 2025/5/31 23:20
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
import type { RouteRecordRaw } from 'vue-router'

const menuRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '/',
    redirect: '/dashboard',
    component: () => import('@/layout/index.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'article',
        name: 'article',
        redirect: '/article/list',
        children: [
          {
            path: 'list',
            name: 'article-list',
            component: () => import('@/views/article/list/index.vue'),
          },
          {
            path: 'tags',
            name: 'article-tags',
            component: () => import('@/views/article/tags/index.vue'),
          },
          {
            path: 'category',
            name: 'article-category',
            component: () => import('@/views/article/category/index.vue'),
          },
        ],
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment/index.vue'),
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: '/material',
        name: 'material',
        component: () => import('@/views/material/index.vue'),
      },
      {
        path: '/material/recycle',
        name: 'material-recycle',
        component: () => import('@/views/material/Recycle.vue'),
      },
      {
        path: '/system',
        name: 'system',
        component: () => import('@/views/system/index.vue'),
      },
      {
        path: '/ai',
        name: 'ai',
        component: () => import('@/views/ai/index.vue'),
      },
    ],
  },
]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  ...menuRoutes,
]

export default routes
