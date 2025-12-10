/**
 * 2025/12/7 03:40.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 存储类型定义
 * @version 1.0.0
 * @since 1.0.0
 */
export type StorageType = 'local' | 'session'

export interface StorageOptions {
  /** 存储类型，默认 localStorage */
  type?: StorageType
  /** 命名空间前缀，避免键冲突 */
  namespace?: string
  /** 是否加密存储，默认 false */
  encrypt?: boolean
  /** 加密密钥 */
  encryptKey?: string
}

export interface StorageItem<T> {
  /** 实际存储的值 */
  value: T
  /** 过期时间戳（毫秒） */
  expires?: number
  /** 创建时间戳 */
  createdAt: number
}

export interface UseStorageReturn<T> {
  /** 当前值 */
  value: T
  /** 更新值 */
  setValue: (value: T | ((prev: T) => T)) => void
  /** 删除值 */
  remove: () => void
  /** 错误信息 */
  error: Error | null
  /** 是否正在加载 */
  loading: boolean
}

export interface StorageEventDetail<T> {
  key: string
  oldValue: T | null
  newValue: T | null
  namespace: string
}
