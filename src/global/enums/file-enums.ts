/**
 * 2025/12/21 01:24.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件相关枚举
 * @version 1.0.0
 * @since 1.0.0
 */

export enum FileStatusEnum {
    /**
     * 等待上传
     */
    PENDING = 'PENDING',
    /**
     * 计算文件哈希值
     */
    HASHING = 'HASHING',
    /**
     * 上传中
     */
    UPLOADING = 'UPLOADING',
    /**
     * 上传完成
     */
    COMPLETED = 'COMPLETED',
    /**
     * 取消上传
     */
    CANCELLED = 'CANCELLED',
    /**
     * 暂停上传
     */
    STOP = 'STOP',
    /**
     * 秒传
     */
    INSTANT = 'INSTANT',
    /**
     * 上传失败
     */
    FAILED = 'FAILED',
}

/**
 * 文本映射
 */
export const TEXT_MAP = {
    [FileStatusEnum.PENDING]: '等待上传',
    [FileStatusEnum.HASHING]: '计算文件哈希值',
    [FileStatusEnum.UPLOADING]: '上传中',
    [FileStatusEnum.COMPLETED]: '上传完成',
    [FileStatusEnum.CANCELLED]: '取消上传',
    [FileStatusEnum.STOP]: '暂停上传',
    [FileStatusEnum.INSTANT]: '秒传',
    [FileStatusEnum.FAILED]: '上传失败',
}

// 状态颜色映射
export const COLOR_MAP: Record<FileStatusEnum, string> = {
    PENDING: '#8c8c8c',
    HASHING: '#1890ff',
    UPLOADING: '#1890ff',
    STOP: '#faad14',
    COMPLETED: '#52c41a',
    FAILED: '#ff4d4f',
    CANCELLED: '#8c8c8c',
    [FileStatusEnum.INSTANT]: ""
}