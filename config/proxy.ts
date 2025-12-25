/**
 * 2025/12/7 03:48.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 代理配置
 * @version 1.0.0
 * @since 1.0.0
 */

const proxyHost: Record<string, string> = {
  dev: 'http://localhost:12010',
  prod: 'https://localhost:12010',
}

export default {
  '/api/v1': {
    target: proxyHost[process.env.APP_ENV || 'dev'],
    changeOrigin: true,
    pathRewrite: {
      '^': '',
    },
  },
}
