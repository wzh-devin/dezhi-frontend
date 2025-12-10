/**
 * 2025/12/8 17:58.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件工具类
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * 文件哈希计算（SHA-256）
 * @param file - 要计算哈希的文件
 * @returns Promise<string> - 返回十六进制格式的 SHA-256 哈希值
 */
export function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunkSize = 10 * 1024 * 1024 // 10MB chunks for hashing
    const chunks = Math.ceil(file.size / chunkSize)
    let currentChunk = 0

    // 分片哈希计算
    const reader = new FileReader()

    // 累积所有分片数据
    const buffers: ArrayBuffer[] = []

    reader.onload = async (e) => {
      if (e.target?.result) {
        buffers.push(e.target.result as ArrayBuffer)
        currentChunk++

        if (currentChunk < chunks) {
          loadNext()
        } else {
          try {
            // 合并所有分片
            const totalLength = buffers.reduce((acc, buf) => acc + buf.byteLength, 0)
            const combined = new Uint8Array(totalLength)
            let offset = 0

            for (const buffer of buffers) {
              combined.set(new Uint8Array(buffer), offset)
              offset += buffer.byteLength
            }

            // 使用 Web Crypto API 计算 SHA-256
            const hashBuffer = await crypto.subtle.digest('SHA-256', combined)

            // 转换为十六进制字符串
            const hashArray = Array.from(new Uint8Array(hashBuffer))
            const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

            resolve(hashHex)
          } catch (error) {
            reject(new Error('哈希计算失败'))
          }
        }
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}

/**
 * 文件哈希计算（增量式）
 * @param file - 要计算哈希的文件
 * @returns Promise<string> - 返回十六进制格式的 SHA-256 哈希值
 */
export async function calculateFileHashIncremental(file: File): Promise<string> {
  const chunkSize = 5 * 1024 * 1024
  const chunks = Math.ceil(file.size / chunkSize)

  const allChunks: Uint8Array[] = []

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const arrayBuffer = await chunk.arrayBuffer()
    allChunks.push(new Uint8Array(arrayBuffer))
  }

  // 合并所有分片
  const totalLength = allChunks.reduce((sum, chunk) => sum + chunk.length, 0)
  const combined = new Uint8Array(totalLength)
  let offset = 0

  for (const chunk of allChunks) {
    combined.set(chunk, offset)
    offset += chunk.length
  }

  // 计算 SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 文件哈希计算（带进度回调）
 * @param file - 要计算哈希的文件
 * @param onProgress - 进度回调函数，参数为 0-100 的进度值
 * @returns Promise<string> - 返回十六进制格式的 SHA-256 哈希值
 */
export async function calculateFileHashWithProgress(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const chunkSize = 10 * 1024 * 1024 // 10MB
  const chunks = Math.ceil(file.size / chunkSize)
  const allData: Uint8Array[] = []

  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    const arrayBuffer = await readChunk(chunk)
    allData.push(new Uint8Array(arrayBuffer))

    // 更新进度
    if (onProgress) {
      const progress = Math.round(((i + 1) / chunks) * 100)
      onProgress(progress)
    }
  }

  // 合并所有数据
  const totalLength = allData.reduce((sum, data) => sum + data.length, 0)
  const combined = new Uint8Array(totalLength)
  let offset = 0

  for (const data of allData) {
    combined.set(data, offset)
    offset += data.length
  }

  // 计算 SHA-256 哈希
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined)
  return bufferToHex(hashBuffer)
}

/**
 * 读取文件分片
 * @param chunk - Blob 分片
 * @returns Promise<ArrayBuffer> - 返回分片的 ArrayBuffer
 */
function readChunk(chunk: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer)
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsArrayBuffer(chunk)
  })
}

/**
 * 缓冲区转换为十六进制字符串
 * @param buffer - ArrayBuffer
 * @returns string - 十六进制字符串
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const hashArray = Array.from(new Uint8Array(buffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * 文件大小格式化
 * @param bytes - 字节数
 * @returns string - 格式化后的文件大小（如 "1.23 MB"）
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 文件类型校验
 * @param file - 要校验的文件
 * @param allowedTypes - 允许的类型数组（如 ['.png', '.jpg', 'image/']）
 * @returns boolean - 是否为允许的类型
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const fileType = file.type
  const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''

  return (
    allowedTypes.some((type) => fileType.includes(type)) ||
    allowedTypes.includes(`.${fileExtension}`)
  )
}

/**
 * 文件大小校验
 * @param file - 要校验的文件
 * @param maxSize - 最大允许大小（字节）
 * @returns boolean - 是否在允许的大小范围内
 */
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

/**
 * 根据文件大小设置分片大小
 * @param fileSize - 文件大小（字节）
 * @returns number - 推荐的分片大小（字节）
 */
export function getRecommendedChunkSize(fileSize: number): number {
  const MB = 1024 * 1024

  if (fileSize > 250 * MB) {
    return 10 * MB
  }

  return 5 * MB
}

/**
 * 计算分片数量
 * @param fileSize - 文件大小（字节）
 * @param chunkSize - 分片大小（字节）
 * @returns number - 分片数量
 */
export function calculateChunkCount(fileSize: number, chunkSize: number): number {
  return Math.ceil(fileSize / chunkSize)
}

/**
 * 验证分片配置是否符合
 * @param fileSize - 文件大小（字节）
 * @param chunkSize - 分片大小（字节）
 * @returns { valid: boolean; message?: string } - 验证结果
 */
export function validateChunkConfig(
  fileSize: number,
  chunkSize: number,
): {
  valid: boolean
  message?: string
} {
  const MIN_CHUNK_SIZE = 5 * 1024 * 1024
  const MAX_CHUNKS = 10000

  // 计算分片数量
  const chunkCount = Math.ceil(fileSize / chunkSize)

  // 验证分片大小（除最后一片外）
  if (chunkSize < MIN_CHUNK_SIZE && chunkCount > 1) {
    return {
      valid: false,
      message: `分片大小必须至少为 ${formatFileSize(MIN_CHUNK_SIZE)}（最后一片除外）`,
    }
  }

  // 验证分片数量
  if (chunkCount > MAX_CHUNKS) {
    return {
      valid: false,
      message: `分片数量超过 MinIO 限制（最多 ${MAX_CHUNKS} 片）`,
    }
  }

  return { valid: true }
}
