/**
 * 2025/12/7 01:48.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 后台登录页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo, useEffect, useState } from 'react'
import type { FC } from 'react'
import { Input, Checkbox, Button, message, Form } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import style from './index.less'
import { login } from '@/service/userService'
import { useStorage } from '@/hooks/useStorage'
import { useRequest } from '@@/plugin-request'
import { errorHandler } from '@/utils/msg-expansion'

const Login: FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)

  const { setValue: setToken } = useStorage<string>('token', '')
  // 存储用户信息，如果勾选记住账号，则保存为7天持久存储
  const {
    value: userInfo,
    setValue: setUserInfo,
    remove: removeUserInfo,
  } = useStorage<{
    username: string
    rememberMeChecked: boolean
  }>(
    'userInfo',
    {
      username: '',
      rememberMeChecked: rememberMe,
    },
    {
      type: 'local',
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    },
  )

  /**
   * 执行登录功能
   * @param e
   */
  const { run: handleLoginRun } = useRequest(
    () => {
      return login({
        username,
        password,
      })
    },
    {
      manual: true,
      onSuccess: (result) => {
        setToken(result as string)

        handleRememberMe()

        setLoading(false)
        message.success('登录成功').then()
      },
      onError: (error) => {
        setLoading(false)
        message.error(errorHandler(error)).then()
      },
    },
  )

  /**
   * 提交登录信息
   * @param e
   */
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleLoginRun()
  }

  /**
   * 处理记住账号行为
   */
  const handleRememberMe = () => {
    if (rememberMe) {
      // 记住账号
      setUserInfo({
        username,
        rememberMeChecked: rememberMe,
      })
    } else {
      // 删除信息
      removeUserInfo()
    }
  }

  // 监听是否记住账号行为
  useEffect(() => {
    console.log('userInfo')
    const { username, rememberMeChecked } = userInfo
    if (username) {
      setUsername(username)
      setRememberMe(rememberMeChecked)
    }
  }, [])

  /**
   * 处理用户名输入
   * @param e
   */
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  /**
   * 处理密码输入
   * @param e
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  /**
   * 处理记住账号行为
   * @param e
   */
  const handleRememberChange = (e: any) => {
    setRememberMe(e.target.checked)
  }

  return (
    <div className={style['admin-login']}>
      {/* Spring Theme Background */}
      <div className={style['admin-login__bg']}></div>

      {/* Decorative Spring Elements */}
      <div className={style['admin-login__decorations']}>
        <div
          className={`${style['admin-login__decoration']} ${style['admin-login__decoration--blue']}`}
        ></div>
        <div
          className={`${style['admin-login__decoration']} ${style['admin-login__decoration--green']}`}
        ></div>
        <div
          className={`${style['admin-login__decoration']} ${style['admin-login__decoration--yellow']}`}
        ></div>
      </div>

      {/* Main Login Card */}
      <div className={style['admin-login__card']}>
        {/* Header Section */}
        <div className={style['admin-login__header']}>
          <div className={style['admin-login__logo']}>
            <div className={style['admin-login__logo-icon']}>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={style['admin-login__leaf-icon']}
              >
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z" />
              </svg>
            </div>
          </div>
          <h1 className={style['admin-login__title']}>Dezhi</h1>
          <p className={style['admin-login__subtitle']}>欢迎回来，开启今天的创作之旅</p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className={style['admin-login__form']}>
          <div className={style['admin-login__inputs']}>
            <Input
              className={style['admin-login__input']}
              placeholder="用户名 / 邮箱"
              prefix={<UserOutlined className={style['admin-login__input-icon']} />}
              value={username}
              onChange={handleUsernameChange}
              maxLength={100}
            />

            <Input.Password
              className={style['admin-login__input']}
              placeholder="密码"
              prefix={<LockOutlined className={style['admin-login__input-icon']} />}
              value={password}
              onChange={handlePasswordChange}
              minLength={6}
              maxLength={16}
            />
          </div>

          <div className={style['admin-login__options']}>
            <Checkbox
              checked={rememberMe}
              onChange={handleRememberChange}
              className={style['admin-login__remember']}
            >
              记住账号
            </Checkbox>
            <a href="#" className={style['admin-login__forgot']}>
              忘记密码?
            </a>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            className={style['admin-login__submit']}
            loading={loading}
            block
          >
            登 录
          </Button>
        </form>

        {/* Footer */}
        <div className={style['admin-login__footer']}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={style['admin-login__footer-icon']}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
            <path d="M17.5 7.5A5 5 0 0 0 12 4a5 5 0 0 0-5 5c0 1.5.5 2.5 2 4l3 3 3-3c1.5-1.5 2-2.5 2-4Z" />
          </svg>
          <span>Designed for Spring, Built for Dezhi</span>
        </div>
      </div>
    </div>
  )
}

export default memo(Login)
