/**
 * 2025/5/4 0:31
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 用户信息
 * @version 1.0
 * @since 1.0
 */
export interface UserInfo {
  /**
   * uid
   */
  id?: number

  /**
   * 用户名
   */
  username?: string

  /**
   * 密码
   */
  password?: string

  /**
   * 头像
   */
  avatar?: string

  /**
   * 邮箱
   */
  email?: string

  /**
   * 邮箱验证码
   */
  code?: string
}
