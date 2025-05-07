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
import { reactive, ref } from 'vue'
import { type CommonModalConfig, FieldType, ModalType } from '@components/modal-cmp/common-modal.d.ts'
import { MailOutlined, PhoneOutlined, UnlockOutlined, UserOutlined } from '@ant-design/icons-vue'
import CommonModal from '@components/modal-cmp/CommonModal.vue'
import { message } from 'ant-design-vue'
import { errMsgExtract } from '@/global/string-format.ts'
import useLoginStore from '@/store/login'

const registerModalRef = ref()

const loginStore = useLoginStore()

// 注册弹窗类型配置
const registerModalProps = reactive<CommonModalConfig>({
  title: '用户注册',
  loading: false,
  type: ModalType.FORM,
  formConfig: [
    {
      name: 'username',
      type: FieldType.NORMAL_INPUT,
      placeholder: '请输入用户名',
      rules: [
        { required: true, type: 'string', message: '请输入用户名', trigger: 'blur' },
        { max: 16, type: 'string', message: '用户名最大长度为16位', trigger: 'blur' },
      ],
      icon: UserOutlined,
    },
    {
      name: 'password',
      type: FieldType.INPUT_PASSWORD,
      placeholder: '请输入密码',
      rules: [
        { required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
        { min: 6, type: 'string', message: '密码最少为6位', trigger: 'blur' },
      ],
      icon: UnlockOutlined,
    },
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
  ],
  cancelText: '取消',
  confirmText: '立即注册',
  formData: {
    username: '',
    password: '',
    email: '',
    code: '',
  },
})

/**
 * 用户注册
 * @param formData 表单数据
 */
const registerHandler = async (formData) => {
  loginStore.signupAction(formData).then(
    () => {
      registerModalRef?.value.hiddenModal()
      registerModalRef?.value.clearFormData()
      message.success('信息注册成功, 请进行登录')
    },
    (error) => {
      errMsgExtract(error)
    },
  )
}
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
        <div class="divider">或</div>
        <div class="register-link">
          还没有账号？
          <a @click="registerModalRef.showModal()">立即注册</a>
        </div>
      </div>
    </ACol>
  </ARow>

  <!-- 账号注册弹窗 -->
  <CommonModal
    ref="registerModalRef"
    :form-data="registerModalProps.formData"
    :type="ModalType.FORM"
    :loading="registerModalProps.loading"
    title="用户注册"
    :form-items-config="registerModalProps.formConfig"
    @confirm="registerHandler"
    :confirm-text="registerModalProps.confirmText"
    :cancel-text="registerModalProps.cancelText"
  />
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
        margin-bottom: 16px;
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
    }
  }
}
</style>
