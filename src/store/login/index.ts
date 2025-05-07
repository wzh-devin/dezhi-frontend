/**
 * 2025/5/4 15:14
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录状态管理器
 * @version 1.0
 * @since 1.0
 */
import { defineStore } from 'pinia'
import type { UserInfo } from '../../interfaces/entity/user/user-info.ts'
import { loginAccount, loginEmail } from '../../api/login'
import { TOKEN_KEY } from '../../constant/global-key.ts'

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
    async loginAccount(userInfo: UserInfo): Promise<void> {
      // 获取token & 将token保存到本地
      const { token } = await loginAccount(userInfo)
      localStorage.setItem(TOKEN_KEY, token)
    },
    /**
     * 邮箱登录行为
     * @param userInfo 用户信息
     */
    async loginEmail(userInfo: UserInfo): Promise<void> {
      // 获取token & 将token保存到本地
      const { token } = await loginEmail(userInfo)
      localStorage.setItem(TOKEN_KEY, token)
    },
  },
})

export default useLoginStore
