/**
 * 2025/5/4 14:55
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录表单
 * @version 1.0
 * @since 1.0
 */
import type { UserInfo } from '../entity/user/user-info.ts'

export interface LoginForm {
  userInfo: UserInfo
  rememberMe: boolean
}
