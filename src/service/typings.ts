export type Addition = {
  /** 当前页码 */
  pageNum?: number | string
  /** 当前页码的总条数 */
  pageSize?: number | string
  /** 总记录数 */
  total?: number | string
}

export type ApiResultObject = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: unknown
  /**  */
  addition?: Addition
}

export type UserInfoQueryVO = {
  /** 用户名 */
  username?: string
  /** 邮箱 */
  email?: string
  /** 验证码 */
  code?: number | string
  /** 密码 */
  password?: string
}

export type ApiResultVoid = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: unknown
  /**  */
  addition?: Addition
}

export type TagVO = {
  /** 标签id */
  id?: string
  /** 标签名称 */
  name?: string
  /** 标签颜色 */
  color?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

export type CategoryVO = {
  /** 类别id */
  id?: string
  /** 类别名称 */
  name?: string
  /** 类别颜色 */
  color?: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

export type ApiResultLoginVO = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /**  */
  data?: LoginVO
  /**  */
  addition?: Addition
}

export type LoginVO = {
  /** token信息 */
  token?: string
}

export type ApiResultString = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: string
  /**  */
  addition?: Addition
}

export type ApiResultUserInfoVO = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /**  */
  data?: UserInfoVO
  /**  */
  addition?: Addition
}

export type PermissionVO = {
  /** 权限名称 */
  name?: string
  /** 权限描述 */
  remark?: string
}

export type RoleVO = {
  /** 角色名称 */
  name?: string
  /** 角色描述 */
  remark?: string
}

export type UserInfoVO = {
  /** 用户id */
  uid?: string
  /** 用户名 */
  username?: string
  /** 用户邮箱 */
  email?: string
  /** 用户角色信息 */
  roles?: RoleVO[]
  /** 用户权限信息 */
  permissions?: PermissionVO[]
  /** 创建用户 */
  createUser?: string
  /** 创建时间 */
  createTime?: string
  /** 更新用户 */
  updateUser?: string
  /** 更新时间 */
  updateTime?: string
  /** 删除标志 */
  delFlag?: number | string
}

export type ApiResultListTagVO = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: TagVO[]
  /**  */
  addition?: Addition
}

export type ApiResultListFileInfoVO = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: FileInfoVO[]
  /**  */
  addition?: Addition
}

export type FileInfoVO = {
  /** 文件id */
  id?: string
  /** 文件名称 */
  name?: string
  /** 文件地址 */
  url?: string
  /** 文件大小 */
  size?: number | string
  /** 文件类型 */
  fileType?: string
  /** 存储类型 */
  storageType?: string
  /** 创建时间 */
  createTime?: string
}

export type ApiResultListCategoryVO = {
  /** 响应是否成功 */
  success?: boolean
  /** 失败码 */
  errCode?: number | string
  /** 失败信息 */
  errMsg?: string
  /** 响应数据 */
  data?: CategoryVO[]
  /**  */
  addition?: Addition
}
