import { defineConfig } from 'umi'
import { routes } from './config/router'
import proxy from './config/proxy'

export default defineConfig({
  plugins: ['@umijs/plugins/dist/antd', '@umijs/plugins/dist/request'],
  antd: {},
  request: {},
  proxy,
  routes,
  npmClient: 'pnpm',
})
