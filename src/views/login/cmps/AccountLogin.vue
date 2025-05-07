<script setup lang="ts">
/**
 * 2025/5/4 0:02
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 账号登录
 * @version 1.0
 * @since 1.0
 */
import { MailOutlined, PhoneOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import { loginFormRules, type LoginPage } from '@/interfaces/pages/login-page.js'
import useLoginStore from '@/store/login'
import { errMsgExtract } from '@/global/string-format.ts'
import CommonModal from '@components/modal-cmp/CommonModal.vue'
import { type CommonModalConfig, FieldType, ModalType } from '@components/modal-cmp/common-modal.d.ts'

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

const resetPwdModalRef = ref()

const loginStore = useLoginStore()

/**
 * 登录提交执行
 */
const submitHandler = async () => {
  loginStore.loginAccountAction(loginPage.loginForm).then(
    () => message.success('登录成功'),
    (error) => errMsgExtract(error),
  )
}

const resetPwdModalProps = reactive<CommonModalConfig>({
  title: '重置密码',
  type: ModalType.FORM,
  formConfig: [
    {
      name: 'email',
      type: FieldType.NORMAL_INPUT,
      placeholder: '请输入邮箱',
      rules: [{ required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }],
      icon: MailOutlined,
    },
    {
      name: 'code',
      type: FieldType.EMAIL_CODE,
      placeholder: '请输入验证码',
      rules: [
        { required: true, type: 'string', message: '请输入验证码', trigger: 'blur' },
        { min: 6, max: 6, type: 'string', message: '验证码为6位，请重新输入', trigger: 'blur' },
      ],
      icon: PhoneOutlined,
    },
    {
      name: 'password',
      type: FieldType.INPUT_PASSWORD,
      placeholder: '请输入新密码',
      rules: [
        { required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
        { min: 6, type: 'string', message: '密码最少为6位', trigger: 'blur' },
      ],
      icon: UnlockOutlined,
    },
  ],
  formData: {
    email: '',
    code: '',
    password: '',
  },
  cancelText: '取消',
  confirmText: '确定修改',
})

/**
 * 重置密码执行
 * @param formData 表单数据
 */
const resetPwdHandler = async (formData) => {
  loginStore.forgetPasswordAction(formData).then(
    () => {
      resetPwdModalRef?.value.hiddenModal()
      resetPwdModalRef?.value.clearFormData()
      message.success('请重新进行登录')
    },
    (error) => errMsgExtract(error),
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
      <a href="#" class="forgot-link" @click="resetPwdModalRef.showModal()">忘记密码?</a>
    </div>
    <AFormItem>
      <a-button type="primary" block @click="submitHandler">登 录</a-button>
    </AFormItem>
  </AForm>

  <CommonModal
    ref="resetPwdModalRef"
    :title="resetPwdModalProps.title"
    :type="resetPwdModalProps.type"
    :form-items-config="resetPwdModalProps.formConfig"
    :form-data="resetPwdModalProps.formData"
    :confirm-text="resetPwdModalProps.confirmText"
    :cancel-text="resetPwdModalProps.cancelText"
    :loading="resetPwdModalProps.loading"
    @confirm="resetPwdHandler"
  />
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
