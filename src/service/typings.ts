export type Addition = {
  /** 当前页码 */
  pageNum?: number;
  /** 当前页码的总条数 */
  pageSize?: number;
  /** 总记录数 */
  total?: number;
}

export type ApiResultObject = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: any;
  /**  */
  addition?: Addition;
}

export type ApiResultVoid = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: any;
  /**  */
  addition?: Addition;
}

export type LoginVO = {
  /** 用户名 */
  username?: string;
  /** 密码 */
  password?: string;
}

export type ApiResultString = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: string;
  /**  */
  addition?: Addition;
}

export type UserUpdateVO = {
  /** 主键id */
  id?: string;
  /** 用户名 */
  username?: string;
  /** 密码 */
  password?: string;
  /** 邮箱 */
  email?: string;
}

export type TagUpdateVO = {
  /** 主键id */
  id?: string;
  /** 标签名称 */
  name?: string;
  /** 标签颜色 */
  color?: string;
}

export type TagSaveVO = {
  /** 标签名称 */
  name?: string;
  /** 标签颜色 */
  color?: string;
}

export type CommonDeleteVO = {
  /** id列表 */
  idList?: string[];
}

export type ApiResultUploadSession = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /**  */
  data?: UploadSession;
  /**  */
  addition?: Addition;
}

export type UploadSession = {
  /**  */
  uploadId?: string;
  /**  */
  minioUploadId?: string;
  /**  */
  bucketName?: string;
  /**  */
  originalName?: string;
  /**  */
  finalName?: string;
  /**  */
  fileHash?: string;
  /**  */
  totalSize?: number;
  /**  */
  totalChunks?: number;
  /**  */
  competedChunks?: number[];
  /**  */
  status?: ('UPLOADING' | 'FINISHED' | 'FAILED');
  /**  */
  createTime?: number;
}

export type InitiateUploadRequest = {
  /** 原始文件名 */
  originalName?: string;
  /** 文件hash值 */
  fileHash?: string;
  /** 文件大小 */
  fileSize?: number;
  /** 分片总数 */
  totalChunks?: number;
}

export type ApiResultFileVO = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /**  */
  data?: FileVO;
  /**  */
  addition?: Addition;
}

export type FileVO = {
  /** 主键id */
  id?: string;
  /** 文件原始名称 */
  originalName?: string;
  /** 存储的文件名称 */
  finalName?: string;
  /** 存储桶名称 */
  bucketName?: string;
  /** 文件哈希值 */
  hash?: string;
  /** 文件大小 */
  size?: number;
  /** 文件MIME类型 */
  mimeType?: string;
  /** 文件类型 */
  type?: ('IMAGE' | 'PDF' | 'ZIP');
  /** 文件存储类型 */
  storageType?: ('MINIO');
  /** 文件url地址 */
  url?: string;
  /** 是否被删除（0: 正常; 1: 已删除） */
  isDeleted?: number;
  /** 文件状态（UPLOADING, FINISHED, FAILED） */
  status?: ('UPLOADING' | 'FINISHED' | 'FAILED');
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

export type FileQueryVO = {
  /** 当前页码 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 存储类型 */
  storageType?: ('MINIO');
  /** 文件类型 */
  type?: ('IMAGE' | 'PDF' | 'ZIP');
  /** 删除状态 */
  deleted?: ('NORMAL' | 'DELETED');
  /** 文件名关键词 */
  keyword?: string;
}

export type ApiResultListFileVO = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: FileVO[];
  /**  */
  addition?: Addition;
}

export type CategoryUpdateVO = {
  /** 主键id */
  id?: string;
  /** 分类名称 */
  name?: string;
}

export type CategorySaveVO = {
  /** 分类名称 */
  name?: string;
}

export type ApiResultUserVO = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /**  */
  data?: UserVO;
  /**  */
  addition?: Addition;
}

export type UserVO = {
  /** 用户名 */
  username?: string;
  /** 邮箱 */
  email?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

export type ApiResultListTagVO = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: TagVO[];
  /**  */
  addition?: Addition;
}

export type TagVO = {
  /** 主键id */
  id?: string;
  /** 标签名称 */
  name?: string;
  /** 标签颜色 */
  color?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

export type ApiResultListCategoryVO = {
  /** 响应是否成功 */
  success?: boolean;
  /** 失败码 */
  errCode?: number;
  /** 失败信息 */
  errMsg?: string;
  /** 响应数据 */
  data?: CategoryVO[];
  /**  */
  addition?: Addition;
}

export type CategoryVO = {
  /** 主键id */
  id?: string;
  /** 分类名称 */
  name?: string;
  /** 创建时间 */
  createTime?: string;
  /** 更新时间 */
  updateTime?: string;
}

