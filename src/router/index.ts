/**
 * 2025/5/1 17:59
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 路由器管理
 * @version 1.0
 * @since 1.0
 */

import { createRouter, createWebHashHistory, type Router, type RouterHistory } from 'vue-router'
import routes from '@/router/routes.ts'
import { TOKEN_KEY } from '@/constant/global-key.ts'
import { message } from 'ant-design-vue'

const history: RouterHistory = createWebHashHistory()

const router: Router = createRouter({
  history,
  routes,
})

// 白名单路由
const whiteList = ['/login']

/**
 * 全局前置守卫
 */
router.beforeEach(async (to, from, next) => {
  console.log('from :::', from)
  // 获取token
  const token = localStorage.getItem(TOKEN_KEY)
  const isLoginPage = to.path === '/login'

  // 已登录状态
  if (token) {
    if (isLoginPage) {
      // 已登录时访问登录页，可以直接重定向到首页
      next({ path: '/' })
      message.success('您已登录，无需重复登录')
      return
    }

    next()
    return
  }

  // 未登录状态
  if (whiteList.includes(to.path)) {
    // 白名单页面允许访问
    next()
    return
  }

  // 非白名单页面重定向到登录页
  next({
    path: '/login',
    query: {
      redirect: to.fullPath,
      message: isLoginPage ? undefined : '请先登录',
    },
  })
})

export default router
