<script setup lang="ts">
/**
 * 2025/5/4 0:03
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 邮箱验证码登录
 * @version 1.0
 * @since 1.0
 */
import { MailOutlined, PhoneOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'
import { loginFormRules, type LoginPage } from '@/interfaces/pages/login-page.js'
import EmailCodeButton from '@components/btn-cmp/EmailCodeButton.vue'
import { message } from 'ant-design-vue'
import useLoginStore from '@/store/login'
import { errMsgExtract } from '@/global/string-format.ts'

/**
 * 登录表单
 */
const loginPage = reactive<LoginPage>({
  loginForm: {
    email: '',
    code: '',
  },
})

const loginStore = useLoginStore()

/**
 * 登录提交执行
 */
const submitHandler = async () => {
  loginStore.loginEmailAction(loginPage.loginForm).then(
    () => message.success('登录成功'),
    (error) => errMsgExtract(error),
  )
}
</script>

<template>
  <AForm class="login-form" :model="loginPage.loginForm" :rules="loginFormRules">
    <AFormItem name="email">
      <AInput type="email" placeholder="请输入邮箱" v-model:value="loginPage.loginForm.email">
        <template #prefix>
          <MailOutlined />
        </template>
      </AInput>
    </AFormItem>
    <AFormItem name="code">
      <div class="code-row">
        <AInput placeholder="请输入验证码" v-model:value="loginPage.loginForm.code">
          <template #prefix>
            <PhoneOutlined />
          </template>
        </AInput>
        <EmailCodeButton :email="loginPage.loginForm.email" />
      </div>
    </AFormItem>
    <AFormItem>
      <AButton type="primary" block @click="submitHandler">登 录</AButton>
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

.code-row {
  display: flex;
  align-items: center;
  gap: 12px;

  .ant-input {
    flex: 1;
  }
}
</style>
