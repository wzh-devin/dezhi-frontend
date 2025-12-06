/**
 * 2025/12/7 03:14.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 存储Hooks
 * @version 1.0.0
 * @since 1.0.0
 */
import { BrowserStorage } from '@/utils/storage-utils'
import { useCallback, useEffect, useState } from 'react'
import { StorageType } from '@/types/storage.types'

/**
 * 存储Hooks
 * @param key 键
 * @param defaultValue 默认值
 * @param options 配置项
 */
const useStorage = <T>(
  key: string,
  defaultValue: T,
  options?: {
    type?: StorageType
    namespace?: string
    encrypt?: boolean
    expiresIn?: number
  },
) => {
  const [storage] = useState(
    () =>
      new BrowserStorage({
        type: options?.type || 'local',
        namespace: options?.namespace || 'app',
        encrypt: options?.encrypt || false,
      }),
  )

  const [value, setValue] = useState<T>(() => {
    const storedValue = storage.get<T>(key, defaultValue)
    return storedValue ? storedValue : defaultValue
  })

  const [error, setError] = useState<Error | null>(null)

  // 保存
  const save = useCallback(
    (newValue: T | ((prevValue: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue
        setValue(valueToStore)
        storage.set(key, valueToStore, options?.expiresIn)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed To Save Storage'))
      }
    },
    [key, value, storage, options?.expiresIn],
  )

  // 删除
  const remove = useCallback(() => {
    try {
      setValue(defaultValue)
      storage.remove(key)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed To Remove Storage'))
    }
  }, [key, defaultValue, storage, options?.type])

  // 监听跨页变化
  useEffect(() => {
    if (options?.type !== 'local') return

    const handleStorageChange = (e: StorageEvent) => {
      // 获取命名空间
      const namespacePrefix = (storage as any).namespace as string
      const namespaceKey = `${namespacePrefix}:${key}`

      if (e.key === namespaceKey) {
        const newValue = storage.get<T>(key)
        setValue(newValue !== null ? newValue : defaultValue)
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, defaultValue, storage, options?.type])

  return {
    value,
    setValue: save,
    remove,
    error,
  }
}

/**
 * localStorage
 * @param key 键
 * @param defaultValue 默认值
 * @param options 配置项
 */
const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  options?: {
    namespace?: string
    encrypt?: boolean
    expiresIn?: number
  },
) => {
  return useStorage(key, defaultValue, {
    ...options,
    encrypt: false,
  })
}

/**
 * sessionStorage
 * @param key 键
 * @param defaultValue 默认值
 * @param options 配置项
 */
const useSessionStorage = <T>(
  key: string,
  defaultValue: T,
  options?: {
    namespace?: string
    encrypt?: boolean
    expiresIn?: number
  },
) => {
  return useStorage(key, defaultValue, {
    ...options,
    encrypt: false,
  })
}

/**
 * 加密存储
 * @param key 键
 * @param defaultValue 默认值
 * @param options 配置项
 */
const useSecureStorage = <T>(
  key: string,
  defaultValue: T,
  options?: {
    namespace?: string
    encryptKey?: string
    expiresIn?: number
  },
) => {
  return useStorage(key, defaultValue, {
    ...options,
    encrypt: true,
  })
}

export { useStorage, useLocalStorage, useSessionStorage, useSecureStorage }
