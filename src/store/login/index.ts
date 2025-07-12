/**
 * 2025/5/4 15:14
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录状态管理器
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import { TOKEN_KEY } from '@/constant/global-key.ts'
import { forgetPassword, loginAccount, loginEmail, signup } from '@/service/userService.ts'
import type { UserInfoQueryVO } from '@/service/typings.ts'

interface LoginState {
  token: string
}

const useLoginStore = defineStore('login', {
  state: (): LoginState => ({
    token: localStorage.getItem(TOKEN_KEY) ?? '',
  }),
  actions: {
    /**
     * 账号登录行为
     * @param userInfo 用户信息
     */
    async loginAccountAction(userInfo: UserInfoQueryVO): Promise<void> {
      // 获取token & 将token保存到本地
      const token = await loginAccount(userInfo).then((res) => res.data?.token ?? '')
      localStorage.setItem(TOKEN_KEY, token)
    },
    /**
     * 邮箱登录行为
     * @param userInfo 用户信息
     */
    async loginEmailAction(userInfo: UserInfoQueryVO): Promise<void> {
      // 获取token & 将token保存到本地
      const token = await loginEmail(userInfo).then((res) => res.data?.token ?? '')
      localStorage.setItem(TOKEN_KEY, token)
    },
    /**
     * 注册行为
     * @param userInfo 用户信息
     */
    async signupAction(userInfo: UserInfoQueryVO): Promise<void> {
      await signup(userInfo)
    },
    /**
     * 忘记密码行为
     * @param userInfo 用户信息
     */
    async forgetPasswordAction(userInfo: UserInfoQueryVO): Promise<void> {
      await forgetPassword(userInfo)
    },
  },
})

export default useLoginStore
