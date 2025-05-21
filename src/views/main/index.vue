<script lang="ts" setup>
import { ref } from 'vue'
import { MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined } from '@ant-design/icons-vue'
import Menu from '@/views/main/cmps/Menu.vue'

const collapsed = ref(false)
</script>

<template>
  <a-layout class="main-layout">
    <a-layout-sider class="main-sider" width="220" :collapsed="collapsed" collapsible :trigger="null">
      <!-- 标题 -->
      <div class="main-sider__logo">
        <img src="/logo.png" alt="logo" />
        <span :class="['main-sider__title', { collapsed }]">DeZhi后台</span>
      </div>
      <!-- 菜单 -->
      <Menu />
    </a-layout-sider>
    <a-layout>
      <!-- 头部导航区域 -->
      <a-layout-header class="main-header">
        <!-- 头部导航栏左侧 -->
        <div class="main-header__left">
          <span class="main-header__trigger" @click="collapsed = !collapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </span>
          <div class="main-header__title">管理控制台</div>
        </div>
        <!-- 头部导航栏右侧 -->
        <div class="main-header__right">
          <!-- 用户信息提醒 -->
          <a-button type="text" shape="circle" class="main-header__bell-btn">
            <template #icon>
              <BellOutlined />
            </template>
          </a-button>
          <!-- 用户头像 -->
          <a-avatar class="main-header__avatar" src="/logo.png"></a-avatar>
          <!-- 用户操作 -->
          <a-dropdown class="main-header__user" :arrow="{ pointAtCenter: true }">
            <a class="ant-dropdown-link" @click.prevent> 管理员 </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>退出登录</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- 内容区域 -->
      <a-layout-content class="main-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.main-layout {
  min-height: 100vh;
  background: #f5f6fa;

  .main-sider {
    background: #fff;
    box-shadow: 2px 0 8px #f0f1f2;
    position: relative;

    &__logo {
      height: 64px;
      display: flex;
      align-items: center;
      padding-left: 24px;
      font-size: 20px;
      font-weight: bold;

      img {
        height: 32px;
        margin-right: 8px;
      }
    }

    .ant-menu {
      border: none;
    }

    &__trigger {
      position: absolute;
      bottom: 16px;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: center;

      &-btn {
        font-size: 18px;
      }
    }
  }

  .main-header {
    background: #fff;
    padding: 0 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    &__left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__trigger {
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      margin-right: 6px;
      height: 64px;
    }

    &__title {
      font-size: 18px;
      font-weight: 500;
    }

    &__right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__avatar {
      background: #e6f7ff;
      color: #1890ff;
    }

    &__user {
      font-size: 14px;
      color: #333;
    }

    &__bell-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 22px;
      background: #f5f5f5;
      padding: 0;
    }
  }

  .main-sider__title {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    transition:
      clip-path 0.12s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.12s;
    clip-path: inset(0 0 0 0);
    opacity: 1;
  }

  .main-sider__title.collapsed {
    clip-path: inset(0 100% 0 0);
    opacity: 0;
    transition:
      clip-path 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.1s 0.2s;
  }
}
</style>
