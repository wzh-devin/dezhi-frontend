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
    path: '/main',
    name: 'main',
    component: () => import('@/views/main/index.vue'),
  },
]

export default routes
