import { defineConfig } from 'umi'
import { routes } from './config/router'

export default defineConfig({
  plugins: ['@umijs/plugins/dist/antd'],
  antd: {},
  routes,
  npmClient: 'pnpm',
})
