import type { Rule } from 'ant-design-vue/es/form'
import type { Component } from 'vue'

/**
 * 2025/5/7 11:21
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 弹窗组件配置
 * @version 1.0
 * @since 1.0
 */
export enum ModalType {
  /**
   * 普通文本弹窗
   */
  NORMAL_TEXT = 'normal-text',

  /**
   * 表单类型弹窗
   */
  FORM = 'form',

  /**
   * 页面类型弹窗
   */
  PAGE = 'page',
}

export enum FieldType {
  /**
   * 普通输入框
   */
  NORMAL_INPUT = 'input',

  /**
   * 密码输入框
   */
  INPUT_PASSWORD = 'input-password',

  /**
   * 邮箱输入框
   */
  INPUT_EMAIL = 'input-email',

  /**
   * 多行文本输入框
   */
  TEXTAREA = 'textarea',

  /**
   * 邮箱验证码属性
   */
  EMAIL_CODE = 'email-code',

  /**
   * 日期时间选择器
   */
  DATE_TIME = 'date-time',
}

export interface FormFieldConfig {
  /**
   * 字段名称
   */
  name: string

  /**
   * 字段类型
   */
  type: 'input' | 'input-password' | 'input-email' | 'textarea' | 'email-code' | 'date-time'

  /**
   * 字段提示信息
   */
  placeholder?: string

  /**
   * 字段验证规则
   */
  rules?: Rule[]

  /**
   * 图标组件
   */
  icon?: Component
}

export interface ModalPageConfig {
  [key: string]: object
}

export interface CommonModalConfig {
  /**
   * 弹窗标题
   */
  title: string

  /**
   * 弹窗加载
   */
  loading?: boolean

  /**
   * 弹窗类型
   */
  type: 'normal-text' | 'form' | 'page'

  /**
   * 文本弹窗展示的内容
   */
  content?: string

  /**
   * 表单弹窗配置
   */
  formConfig?: FormFieldConfig[]

  /**
   * 表单数据
   */
  formData?: object

  /**
   * TODO 页面弹窗配置
   */
  pageConfig?: ModalPageConfig

  /**
   * 弹窗确认按钮文本
   */
  cancelText: string

  /**
   * 弹窗取消按钮文本
   */
  confirmText: string
}
