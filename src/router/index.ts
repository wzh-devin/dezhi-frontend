/**
 * 2025/5/1 17:59
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 路由器管理
 * @version 1.0
 * @since 1.0
 */

import { createRouter, createWebHashHistory, type Router, type RouterHistory } from 'vue-router'
import routes from '@/router/routes.ts'

const history: RouterHistory = createWebHashHistory()

const router: Router = createRouter({
  history,
  routes,
})

export default router
