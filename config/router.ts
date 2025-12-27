/**
 * 2025/11/2 22:49.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 路由设置
 * @version 1.0.0
 * @since 1.0.0
 */

export const routes = [
  // 前台路由
  {
    path: '/',
    component: '@/layouts/Web',
    routes: [
      {
        path: '/',
        component: '@/pages/Web/Home',
      },
    ],
  },
  // 后台登录页（独立页面，不使用后台布局）
  {
    path: '/admin/login',
    component: '@/pages/Admin/Login',
  },
  // 后台管理路由
  {
    path: '/admin',
    component: '@/layouts/Admin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/dashboard',
      },
      // 仪表盘
      {
        path: '/admin/dashboard',
        component: '@/pages/Admin/Dashboard',
      },
      // 内容管理
      {
        path: '/admin/content/article',
        component: '@/pages/Admin/Content/Article',
      },
      {
        path: '/admin/content/article/write/:id',
        component: '@/pages/Admin/Content/Article/Write',
      },
      {
        path: '/admin/content/article/recycle',
        component: '@/pages/Admin/Content/Article/Recycle',
      },
      {
        path: '/admin/content/category',
        component: '@/pages/Admin/Content/Category',
      },
      {
        path: '/admin/content/tags',
        component: '@/pages/Admin/Content/Tags',
      },
      // 文件素材管理
      {
        path: '/admin/file',
        component: '@/pages/Admin/File',
      },
      // 系统管理
      {
        path: '/admin/system/config',
        component: '@/pages/Admin/System/Config',
      },
      {
        path: '/admin/system/ai-config',
        component: '@/pages/Admin/System/AIConfig',
      },
    ],
  },
]
