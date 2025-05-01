/**
 * 2025/5/1 18:33
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description
 * @version 1.0
 * @since 1.0
 */
enum CacheType {
  LOCAL,
  SESSION,
}

class Cache {
  private storage: Storage

  constructor(cacheType: CacheType) {
    this.storage = cacheType === CacheType.LOCAL ? localStorage : sessionStorage
  }

  setCache(key: string, value: object) {
    if (value) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  getCache(key: string) {
    const value = this.storage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
    return ''
  }

  removeCache(key: string) {
    this.storage.removeItem(key)
  }

  clearCache() {
    this.storage.clear()
  }
}

const localCache = new Cache(CacheType.LOCAL)
const sessionCache = new Cache(CacheType.SESSION)

export { localCache, sessionCache }
