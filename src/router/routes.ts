/**
 * 2025/5/1 18:02
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 路由管理
 * @version 1.0
 * @since 1.0
 */
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw = [
  {
    path: '/',
    name: 'root',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment/index.vue'),
      },
      {
        path: '/material',
        name: 'material',
        component: () => import('@/views/material/index.vue'),
      },
      {
        path: '/system',
        name: 'system',
        component: () => import('@/views/system/index.vue'),
      },
    ],
  },
]

export default routes
