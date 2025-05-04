<script setup lang="ts">
/**
 * 2025/5/4 0:02
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 账号登录
 * @version 1.0
 * @since 1.0
 */
import { UnlockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { LoginForm } from '@/interfaces/form/login-form.ts'
import useLoginStore from '@/store/login'

/**
 * 登录表单属性设置
 */
const loginForm = reactive<LoginForm>({
  userInfo: {
    username: '',
    password: '',
  },
  rememberMe: false,
})

const loginStore = useLoginStore()

/**
 * 登录提交执行
 */
const submitHandler = async () => {
  console.log(loginForm.userInfo)
  await loginStore.loginAccount(loginForm.userInfo)
  message.success('登录成功')
}
</script>

<template>
  <a-form class="login-form" :model="loginForm">
    <a-form-item>
      <a-input placeholder="请输入账号" v-model:value="loginForm.userInfo.username">
        <template #prefix>
          <UserOutlined />
        </template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input-password placeholder="请输入密码" v-model:value="loginForm.userInfo.password">
        <template #prefix>
          <UnlockOutlined />
        </template>
      </a-input-password>
    </a-form-item>
    <div class="form-options">
      <a-checkbox>记住密码</a-checkbox>
      <a href="#" class="forgot-link">忘记密码?</a>
    </div>
    <a-form-item>
      <a-button type="primary" block @click="submitHandler">登 录</a-button>
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
</style>
