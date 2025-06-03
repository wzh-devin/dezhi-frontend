import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import eslintPluginImport from 'eslint-plugin-import'
import eslintConfigPrettier from 'eslint-config-prettier'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default defineConfig([
  // 基本 JS/TS/Vue 推荐规则
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  // 全局变量（浏览器 + Node）
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // TypeScript 推荐
  tseslint.configs.recommended,

  // 关闭与 Prettier 冲突的 ESLint 规则 （仍未「运行」Prettier）
  eslintConfigPrettier,
  {
    rules: {
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
    },
  },

  // Vue essential 规范
  pluginVue.configs['flat/essential'],

  // *.vue 文件用 TS 解析器
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 配置路径别名解析
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    plugins: {
      eslintPluginImport,
    },
    settings: {
      'eslintPluginImport/resolver': {
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
        },
      },
    },
  },

  // 关闭 multi-word 组件名校验
  {
    files: ['**/*.{vue,js,ts}'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  // **新增**：Prettier 检查
  pluginPrettierRecommended,
])
