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
import { useRequest, history } from 'umi'

const Login: FC = () => {
  const [form] = Form.useForm()
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
      rememberMeChecked: false,
    },
    {
      type: 'local',
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    },
  )

  /**
   * 执行登录功能
   */
  const { run: handleLoginRun } = useRequest(login, {
    manual: true,
    onSuccess: (result) => {
      setToken(result as string)

      handleRememberMe()

      setLoading(false)
      message.success('登录成功').then()

      // 跳转页面
      history.push('/admin/dashboard')
    },
    onError: (error) => {
      setLoading(false)
    },
  })

  /**
   * 提交登录信息
   */
  const onSubmit = () => {
    setLoading(true)
    handleLoginRun({
      username: form.getFieldValue('username'),
      password: form.getFieldValue('password'),
    })
  }

  /**
   * 处理记住账号行为
   */
  const handleRememberMe = () => {
    const rememberMe = form.getFieldValue('rememberMe')
    const username = form.getFieldValue('username')
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
    const { username, rememberMeChecked } = userInfo
    if (username) {
      form.setFieldsValue({
        username,
        rememberMe: rememberMeChecked,
      })
    }
  }, [])

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
        <Form
          form={form}
          onFinish={onSubmit}
          className={style['admin-login__form']}
          initialValues={{ rememberMe: false }}
        >
          <div className={style['admin-login__inputs']}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
                { max: 100, message: '用户名最多100个字符' },
              ]}
            >
              <Input
                className={style['admin-login__input']}
                placeholder="用户名 / 邮箱"
                prefix={<UserOutlined className={style['admin-login__input-icon']} />}
                maxLength={100}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
                { max: 16, message: '密码最多16个字符' },
              ]}
            >
              <Input.Password
                className={style['admin-login__input']}
                placeholder="密码"
                prefix={<LockOutlined className={style['admin-login__input-icon']} />}
                maxLength={16}
              />
            </Form.Item>
          </div>

          <div className={style['admin-login__options']}>
            <Form.Item name="rememberMe" valuePropName="checked" noStyle>
              <Checkbox className={style['admin-login__remember']}>记住账号</Checkbox>
            </Form.Item>
            <a href="#" className={style['admin-login__forgot']}>
              忘记密码?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={style['admin-login__submit']}
              loading={loading}
              block
            >
              登 录
            </Button>
          </Form.Item>
        </Form>

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
          <span>Welcome Dezhi Login</span>
        </div>
      </div>
    </div>
  )
}

export default memo(Login)
