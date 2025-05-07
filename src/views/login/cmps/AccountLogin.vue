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
import { loginFormRules, type LoginPage } from '@/interfaces/pages/login-page.js'
import useLoginStore from '@/store/login'

/**
 * 登录表单属性设置
 */
const loginPage = reactive<LoginPage>({
  loginForm: {
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
  loginStore.loginAccount(loginPage.loginForm).then(
    () => message.success('登录成功'),
    () => message.error('登录失败，请联系管理员！！！'),
  )
}
</script>

<template>
  <AForm class="login-form" :model="loginPage.loginForm" :rules="loginFormRules">
    <AFormItem name="username">
      <AInput placeholder="请输入账号" v-model:value="loginPage.loginForm.username">
        <template #prefix>
          <UserOutlined />
        </template>
      </AInput>
    </AFormItem>
    <AFormItem name="password">
      <AInputPassword placeholder="请输入密码" v-model:value="loginPage.loginForm.password">
        <template #prefix>
          <component :is="UnlockOutlined" />
        </template>
      </AInputPassword>
    </AFormItem>
    <div class="form-options">
      <ACheckbox v-model:checked="loginPage.rememberMe">记住密码</ACheckbox>
      <a href="#" class="forgot-link">忘记密码?</a>
    </div>
    <AFormItem>
      <a-button type="primary" block @click="submitHandler">登 录</a-button>
    </AFormItem>
  </AForm>
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
</style>
