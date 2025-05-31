/**
 * 2025/5/4 15:18
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 登录接口
 * @version 1.0
 * @since 1.0
 */
import type { UserInfo } from '@/interfaces/entity/user/user-info.ts'
import { get, post, put } from '@/utils/http/axios'

/**
 * 登录请求
 * @param userInfo 账号信息
 * @return token
 */
const loginAccount = async (userInfo: UserInfo): Promise<{ token: string }> => {
  return await post<{ token: string }>({
    url: '/user/loginAccount',
    data: userInfo,
  })
}

/**
 * 获取邮箱验证码
 * @param email 邮箱
 */
const getEmailCode = async (email: string): Promise<void> => {
  return await get({
    url: `/user/getEmailCode?email=${email}`,
  })
}

/**
 * 邮箱登录
 * @param userInfo
 */
const loginEmail = async (userInfo: UserInfo): Promise<{ token: string }> => {
  return await post<{ token: string }>({
    url: '/user/loginEmail',
    data: userInfo,
  })
}

/**
 * 用户注册
 * @param userInfo 用户信息
 */
const signup = async (userInfo: UserInfo): Promise<void> => {
  await put({
    url: '/user/signup',
    data: userInfo,
  })
}

/**
 * 忘记密码
 * @param userInfo 用户信息
 */
const forgetPassword = async (userInfo: UserInfo): Promise<void> => {
  await post({
    url: '/user/forgetPassword',
    data: userInfo,
  })
}

export { loginAccount, getEmailCode, loginEmail, signup, forgetPassword }
