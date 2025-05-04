<script setup lang="ts">
/**
 * 2025/5/3 15:01
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录页面
 * @version 1.0
 * @since 1.0
 */
import AccountLogin from '@/views/login/cmps/AccountLogin.vue'
import EmailLogin from '@/views/login/cmps/EmailLogin.vue'
</script>

<template>
  <ARow class="login-row">
    <!-- 左侧看板 -->
    <ACol class="left-panel" :span="11">
      <div class="logo-container">
        <div class="brand-logo-text">
          <img src="/public/logo.png" alt="DeZhi Logo" class="brand-logo-img" />
          <span class="brand-text"><span class="brand-text-rest">eZhi</span></span>
        </div>
      </div>
    </ACol>

    <!-- 右侧登录看板 -->
    <ACol class="right-panel" :span="13">
      <div class="login-form-container">
        <ATabs default-active-key="account" class="login-tabs">
          <ATabPane key="account" tab="账号密码登录">
            <AccountLogin />
          </ATabPane>
          <ATabPane key="email" tab="验证码登录">
            <EmailLogin />
          </ATabPane>
        </ATabs>
      </div>
    </ACol>
  </ARow>
</template>

<style scoped lang="less">
.login-row {
  height: 100vh;
  width: 100vw;

  .left-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f8ff 0%, #eaf1ff 100%);
    height: 100vh;

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;

      .brand-logo-text {
        display: flex;
        align-items: center;
      }

      .brand-logo-img {
        width: 120px;
        height: 120px;
        margin-right: 8px;
        vertical-align: middle;
      }

      .brand-text {
        font-size: 120px;
        font-family: 'Montserrat', 'PingFang SC', 'Microsoft YaHei', sans-serif;
        font-weight: 700;
        background: linear-gradient(90deg, #5b2677 0%, #ff8c42 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        .brand-text-rest {
          letter-spacing: 2px;
        }
      }
    }
  }

  .right-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    height: 100vh;

    .login-form-container {
      width: 400px;
      background: #fff;
      box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      padding: 48px 40px 32px 40px;

      .login-tabs {
        margin-bottom: 24px;
      }
    }
  }
}
</style>
