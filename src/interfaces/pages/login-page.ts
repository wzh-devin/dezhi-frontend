/**
 * 2025/5/4 14:55
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录表单
 * @version 1.0
 * @since 1.0
 */
import type { UserInfo } from '../entity/user/user-info.ts'
import type { Rule } from 'ant-design-vue/es/form'

export interface LoginPage {
  loginForm: UserInfo
  rememberMe: boolean
}

export const loginFormRules: Record<string, Rule[]> = {
  username: [
    { required: true, type: 'string', message: '请输入用户名', trigger: 'blur' },
    { max: 16, type: 'string', message: '用户名最大长度为16位', trigger: 'blur' },
  ],
  password: [
    { required: true, type: 'string', message: '请输入密码', trigger: 'blur' },
    { min: 6, type: 'string', message: '密码最少为6位', trigger: 'blur' },
  ],
  email: [{ required: true, type: 'email', message: '请输入邮箱', trigger: 'blur' }],
  code: [
    { required: true, type: 'string', message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, type: 'string', message: '验证码为6位，请重新输入', trigger: 'blur' },
  ],
}
