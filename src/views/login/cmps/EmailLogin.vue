<script setup lang="ts">
/**
 * 2025/5/4 0:03
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 邮箱验证码登录
 * @version 1.0
 * @since 1.0
 */
import { MailOutlined, PhoneOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <a-form class="login-form">
    <a-form-item>
      <a-input type="email" placeholder="请输入邮箱">
        <template #prefix>
          <MailOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <div class="code-row">
        <a-input placeholder="请输入验证码">
          <template #prefix>
            <PhoneOutlined />
          </template>
        </a-input>
        <a-button type="primary" class="code-btn">获取验证码</a-button>
      </div>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" block>登 录</a-button>
    </a-form-item>
    <div class="divider">或</div>
    <div class="register-link">还没有账号？<a href="#">立即注册</a></div>
  </a-form>
</template>

<style scoped lang="less">
.login-form {
  margin-top: 16px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.forgot-link {
  font-size: 14px;
}

.divider {
  text-align: center;
  color: #bfbfbf;
  margin: 16px 0 8px 0;
}

.register-link {
  text-align: center;
  font-size: 14px;
}

.code-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .ant-input {
    flex: 1;
  }

  .code-btn {
    padding: 0 16px;
    margin-left: 8px;
  }
}
</style>
