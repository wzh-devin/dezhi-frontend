/**
 * 2025/12/7 03:07.
 *
 * <p>
 *     支持 localStorage 和 sessionStorage
 *     类型安全、加密、过期时间、命名空间、错误处理
 * </p>
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 浏览器存储工具类
 * @version 1.0.0
 * @since 1.0.0
 */
import { StorageItem, StorageOptions, StorageType } from '@/types/storage'

export class BrowserStorage {
  private storage: Storage

  private readonly namespace: string

  private readonly encrypt: boolean

  private encryptKey: string

  constructor(options: StorageOptions = {}) {
    const {
      type = 'local',
      namespace = 'dezhi',
      encrypt = false,
      encryptKey = 'default-key',
    } = options

    // 检查浏览器是否支持存储
    this.storage = this.getStorage(type)
    this.namespace = namespace
    this.encrypt = encrypt
    this.encryptKey = encryptKey

    // 验证存储可用性
    this.validateStorage()
  }

  /**
   * 获取存储对象
   */
  private getStorage(type: StorageType): Storage {
    try {
      const storage = type === 'local' ? window.localStorage : window.sessionStorage
      if (!storage) {
        throw new Error(`${type}Storage is not available`)
      }
      return storage
    } catch (error) {
      throw new Error(`Failed to access ${type}Storage: ${error}`)
    }
  }

  /**
   * 验证存储是否可用
   */
  private validateStorage(): void {
    try {
      const testKey = '__storage_test__'
      this.storage.setItem(testKey, 'test')
      this.storage.removeItem(testKey)
    } catch (error) {
      throw new Error('Storage is not available or quota exceeded')
    }
  }

  /**
   * 生成带命名空间的键
   */
  private getNamespacedKey(key: string): string {
    return `${this.namespace}:${key}`
  }

  /**
   * 简单加密（Base64 + XOR）
   */
  private encryptData(data: string): string {
    if (!this.encrypt) return data

    try {
      const encrypted = data
        .split('')
        .map((char, i) => {
          const keyChar = this.encryptKey.charCodeAt(i % this.encryptKey.length)
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar)
        })
        .join('')

      return btoa(encrypted)
    } catch (error) {
      console.error('Encryption failed:', error)
      return data
    }
  }

  /**
   * 简单解密
   */
  private decryptData(data: string): string {
    if (!this.encrypt) return data

    try {
      const decrypted = atob(data)
      return decrypted
        .split('')
        .map((char, i) => {
          const keyChar = this.encryptKey.charCodeAt(i % this.encryptKey.length)
          return String.fromCharCode(char.charCodeAt(0) ^ keyChar)
        })
        .join('')
    } catch (error) {
      console.error('Decryption failed:', error)
      return data
    }
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值（支持任意类型）
   * @param expiresIn 过期时间（毫秒），可选
   */
  set<T>(key: string, value: T, expiresIn?: number): boolean {
    try {
      const item: StorageItem<T> = {
        value,
        createdAt: Date.now(),
        expires: expiresIn ? Date.now() + expiresIn : undefined,
      }

      const serialized = JSON.stringify(item)
      const data = this.encryptData(serialized)
      const namespacedKey = this.getNamespacedKey(key)

      this.storage.setItem(namespacedKey, data)
      return true
    } catch (error) {
      console.error(`Failed to set storage item "${key}":`, error)
      return false
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      const data = this.storage.getItem(namespacedKey)

      if (!data) {
        return defaultValue ?? null
      }

      const decrypted = this.decryptData(data)
      const item: StorageItem<T> = JSON.parse(decrypted)

      // 检查是否过期
      if (item.expires && Date.now() > item.expires) {
        this.remove(key)
        return defaultValue ?? null
      }

      return item.value
    } catch (error) {
      console.error(`Failed to get storage item "${key}":`, error)
      return defaultValue ?? null
    }
  }

  /**
   * 删除存储项
   */
  remove(key: string): boolean {
    try {
      const namespacedKey = this.getNamespacedKey(key)
      this.storage.removeItem(namespacedKey)
      return true
    } catch (error) {
      console.error(`Failed to remove storage item "${key}":`, error)
      return false
    }
  }

  /**
   * 清空当前命名空间下的所有存储
   */
  clear(): boolean {
    try {
      const keys = this.keys()
      keys.forEach((key) => this.remove(key))
      return true
    } catch (error) {
      console.error('Failed to clear storage:', error)
      return false
    }
  }

  /**
   * 清空所有存储（包括其他命名空间）
   */
  clearAll(): boolean {
    try {
      this.storage.clear()
      return true
    } catch (error) {
      console.error('Failed to clear all storage:', error)
      return false
    }
  }

  /**
   * 检查键是否存在且未过期
   */
  has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * 获取当前命名空间下的所有键
   */
  keys(): string[] {
    try {
      const prefix = `${this.namespace}:`
      const keys: string[] = []

      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i)
        if (key && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length))
        }
      }

      return keys
    } catch (error) {
      console.error('Failed to get storage keys:', error)
      return []
    }
  }

  /**
   * 获取存储项数量
   */
  size(): number {
    return this.keys().length
  }

  /**
   * 获取所有存储项
   */
  getAll<T>(): Record<string, T> {
    const result: Record<string, T> = {}
    const keys = this.keys()

    keys.forEach((key) => {
      const value = this.get<T>(key)
      if (value !== null) {
        result[key] = value
      }
    })

    return result
  }

  /**
   * 批量设置
   */
  setMultiple(items: Record<string, any>, expiresIn?: number): boolean {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.set(key, value, expiresIn)
      })
      return true
    } catch (error) {
      console.error('Failed to set multiple items:', error)
      return false
    }
  }

  /**
   * 批量删除
   */
  removeMultiple(keys: string[]): boolean {
    try {
      keys.forEach((key) => this.remove(key))
      return true
    } catch (error) {
      console.error('Failed to remove multiple items:', error)
      return false
    }
  }

  /**
   * 获取存储使用情况（估算，KB）
   */
  getStorageSize(): number {
    try {
      let totalSize = 0
      const keys = this.keys()

      keys.forEach((key) => {
        const namespacedKey = this.getNamespacedKey(key)
        const item = this.storage.getItem(namespacedKey)
        if (item) {
          totalSize += item.length + namespacedKey.length
        }
      })

      return Math.round((totalSize / 1024) * 100) / 100 // KB
    } catch (error) {
      console.error('Failed to calculate storage size:', error)
      return 0
    }
  }

  /**
   * 清理所有过期项
   */
  clearExpired(): number {
    let count = 0
    const keys = this.keys()

    keys.forEach((key) => {
      const value = this.get(key)
      if (value === null) {
        count++
      }
    })

    return count
  }
}

// 创建单例实例
export const localStorage = new BrowserStorage({ type: 'local' })
export const sessionStorage = new BrowserStorage({ type: 'session' })

// 创建加密存储实例
export const secureLocalStorage = new BrowserStorage({
  type: 'local',
  encrypt: false,
})

export default BrowserStorage
