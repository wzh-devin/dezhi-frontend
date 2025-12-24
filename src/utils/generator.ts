/**
 * 2025/12/25 01:02.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description id生成器
 * @version 1.0.0
 * @since 1.0.0
 */

/**
 * ID 生成策略枚举
 */
export enum IdStrategy {
    /** UUID v4 格式 */
    UUID = 'uuid',
    /** 纳秒时间戳 + 随机数 */
    TIMESTAMP = 'timestamp',
    /** 自定义长度的随机字符串 */
    RANDOM = 'random',
    /** Nano ID 风格（URL 友好） */
    NANO = 'nano',
    /** 雪花算法风格 */
    SNOWFLAKE = 'snowflake',
}

/**
 * ID 生成器配置接口
 */
export interface IdGeneratorConfig {
    /** 默认前缀 */
    defaultPrefix?: string;
    /** 前缀分隔符，默认为 '_' */
    separator?: string;
    /** 随机 ID 的默认长度 */
    defaultLength?: number;
    /** 是否启用大小写混合（针对随机字符串） */
    caseSensitive?: boolean;
    /** 自定义字符集（针对随机字符串） */
    customCharset?: string;
    /** 工作节点 ID（用于雪花算法，0-1023） */
    workerId?: number;
    /** 数据中心 ID（用于雪花算法，0-31） */
    datacenterId?: number;
}

/**
 * ID 生成器类
 */
export class IdGenerator {
    private readonly config: Required<IdGeneratorConfig>;
    private sequence: number = 0;
    private lastTimestamp: number = -1;

    // 默认字符集
    private static readonly DEFAULT_CHARSET =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    private static readonly URL_SAFE_CHARSET =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

    // 雪花算法常量
    private static readonly EPOCH = 1640995200000; // 2022-01-01 00:00:00 UTC
    private static readonly WORKER_ID_BITS = 10;
    private static readonly DATACENTER_ID_BITS = 5;
    private static readonly SEQUENCE_BITS = 12;

    constructor(config: IdGeneratorConfig = {}) {
        this.config = {
            defaultPrefix: config.defaultPrefix || '',
            separator: config.separator || '_',
            defaultLength: config.defaultLength || 16,
            caseSensitive: config.caseSensitive !== false,
            customCharset: config.customCharset || IdGenerator.DEFAULT_CHARSET,
            workerId: this.validateWorkerId(config.workerId || 0),
            datacenterId: this.validateDatacenterId(config.datacenterId || 0),
        };
    }

    /**
     * 生成 ID
     * @param strategy 生成策略
     * @param prefix 可选前缀（覆盖默认前缀）
     * @param options 额外选项
     */
    public generate(
        strategy: IdStrategy = IdStrategy.UUID,
        prefix?: string,
        options?: { length?: number; charset?: string }
    ): string {
        const actualPrefix = prefix !== undefined ? prefix : this.config.defaultPrefix;
        let id: string;

        try {
            switch (strategy) {
                case IdStrategy.UUID:
                    id = this.generateUUID();
                    break;
                case IdStrategy.TIMESTAMP:
                    id = this.generateTimestampId();
                    break;
                case IdStrategy.RANDOM:
                    id = this.generateRandomId(
                        options?.length || this.config.defaultLength,
                        options?.charset || this.config.customCharset
                    );
                    break;
                case IdStrategy.NANO:
                    id = this.generateNanoId(options?.length || 21);
                    break;
                case IdStrategy.SNOWFLAKE:
                    id = this.generateSnowflakeId();
                    break;
                default:
                    throw new Error(`Unknown strategy: ${strategy}`);
            }

            return this.addPrefix(id, actualPrefix);
        } catch (error) {
            throw new Error(
                `Failed to generate ID with strategy ${strategy}: ${
                    error instanceof Error ? error.message : String(error)
                }`
            );
        }
    }

    /**
     * 生成 UUID v4
     */
    private generateUUID(): string {
        // 使用加密安全的随机数生成器
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }

        // 回退方案：手动生成 UUID v4
        const bytes = this.getRandomBytes(16);
        bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
        bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

        const hex = Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');

        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(
            16,
            20
        )}-${hex.slice(20, 32)}`;
    }

    /**
     * 生成基于时间戳的 ID
     */
    private generateTimestampId(): string {
        const timestamp = Date.now();
        const nanoRandom = this.getRandomInt(0, 999999);
        const randomSuffix = this.generateRandomId(8);
        return `${timestamp}${nanoRandom.toString().padStart(6, '0')}${randomSuffix}`;
    }

    /**
     * 生成指定长度的随机字符串
     */
    private generateRandomId(length: number, charset: string = this.config.customCharset): string {
        if (length <= 0) {
            throw new Error('Length must be greater than 0');
        }

        if (!charset || charset.length === 0) {
            throw new Error('Charset cannot be empty');
        }

        const result: string[] = [];
        const randomValues = this.getRandomBytes(length);

        for (let i = 0; i < length; i++) {
            result.push(charset[randomValues[i] % charset.length]);
        }

        return result.join('');
    }

    /**
     * 生成 Nano ID 风格的 ID（URL 安全）
     */
    private generateNanoId(length: number = 21): string {
        return this.generateRandomId(length, IdGenerator.URL_SAFE_CHARSET);
    }

    /**
     * 生成雪花算法 ID
     */
    private generateSnowflakeId(): string {
        let timestamp = Date.now();

        if (timestamp < this.lastTimestamp) {
            throw new Error('Clock moved backwards. Refusing to generate id');
        }

        if (timestamp === this.lastTimestamp) {
            this.sequence = (this.sequence + 1) & ((1 << IdGenerator.SEQUENCE_BITS) - 1);
            if (this.sequence === 0) {
                // 序列号溢出，等待下一毫秒
                timestamp = this.waitNextMillis(this.lastTimestamp);
            }
        } else {
            this.sequence = 0;
        }

        this.lastTimestamp = timestamp;

        const id =
            ((timestamp - IdGenerator.EPOCH) << (IdGenerator.WORKER_ID_BITS + IdGenerator.SEQUENCE_BITS)) |
            (this.config.datacenterId << (IdGenerator.WORKER_ID_BITS + IdGenerator.SEQUENCE_BITS - IdGenerator.DATACENTER_ID_BITS)) |
            (this.config.workerId << IdGenerator.SEQUENCE_BITS) |
            this.sequence;

        return id.toString();
    }

    /**
     * 等待下一毫秒
     */
    private waitNextMillis(lastTimestamp: number): number {
        let timestamp = Date.now();
        while (timestamp <= lastTimestamp) {
            timestamp = Date.now();
        }
        return timestamp;
    }

    /**
     * 添加前缀
     */
    private addPrefix(id: string, prefix: string): string {
        if (!prefix) {
            return id;
        }

        // 验证前缀格式
        this.validatePrefix(prefix);
        return `${prefix}${this.config.separator}${id}`;
    }

    /**
     * 验证前缀格式
     */
    private validatePrefix(prefix: string): void {
        if (prefix.includes(this.config.separator)) {
            throw new Error(
                `Prefix cannot contain separator character: ${this.config.separator}`
            );
        }
    }

    /**
     * 验证工作节点 ID
     */
    private validateWorkerId(workerId: number): number {
        const maxWorkerId = (1 << IdGenerator.WORKER_ID_BITS) - 1;
        if (workerId < 0 || workerId > maxWorkerId) {
            throw new Error(`Worker ID must be between 0 and ${maxWorkerId}`);
        }
        return workerId;
    }

    /**
     * 验证数据中心 ID
     */
    private validateDatacenterId(datacenterId: number): number {
        const maxDatacenterId = (1 << IdGenerator.DATACENTER_ID_BITS) - 1;
        if (datacenterId < 0 || datacenterId > maxDatacenterId) {
            throw new Error(`Datacenter ID must be between 0 and ${maxDatacenterId}`);
        }
        return datacenterId;
    }

    /**
     * 获取加密安全的随机字节
     */
    private getRandomBytes(length: number): Uint8Array {
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            return crypto.getRandomValues(new Uint8Array(length));
        }

        // Node.js 环境回退方案
        try {
            const nodeCrypto = require('crypto');
            return new Uint8Array(nodeCrypto.randomBytes(length));
        } catch {
            throw new Error('No secure random number generator available');
        }
    }

    /**
     * 获取指定范围内的随机整数
     */
    private getRandomInt(min: number, max: number): number {
        const range = max - min;
        const bytes = Math.ceil(Math.log2(range) / 8);
        const randomBytes = this.getRandomBytes(bytes);
        let randomValue = 0;
        for (let i = 0; i < bytes; i++) {
            randomValue = (randomValue << 8) | randomBytes[i];
        }
        return min + (randomValue % (range + 1));
    }

    /**
     * 批量生成 ID
     */
    public generateBatch(
        count: number,
        strategy: IdStrategy = IdStrategy.UUID,
        prefix?: string
    ): string[] {
        if (count <= 0) {
            throw new Error('Count must be greater than 0');
        }

        const ids: string[] = [];
        for (let i = 0; i < count; i++) {
            ids.push(this.generate(strategy, prefix));
        }

        // 检查唯一性
        const uniqueIds = new Set(ids);
        if (uniqueIds.size !== ids.length) {
            throw new Error('Generated IDs are not unique');
        }

        return ids;
    }

    /**
     * 解析带前缀的 ID
     */
    public parse(id: string): { prefix: string | null; id: string } {
        const separatorIndex = id.indexOf(this.config.separator);
        if (separatorIndex === -1) {
            return { prefix: null, id };
        }

        return {
            prefix: id.slice(0, separatorIndex),
            id: id.slice(separatorIndex + this.config.separator.length),
        };
    }

    /**
     * 验证 ID 格式
     */
    public validate(id: string, strategy: IdStrategy, expectedPrefix?: string): boolean {
        try {
            const parsed = this.parse(id);

            // 验证前缀
            if (expectedPrefix !== undefined && parsed.prefix !== expectedPrefix) {
                return false;
            }

            // 验证 ID 格式
            switch (strategy) {
                case IdStrategy.UUID:
                    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                        parsed.id
                    );
                case IdStrategy.TIMESTAMP:
                    return /^\d{13}\d{6}[A-Za-z0-9]{8}$/.test(parsed.id);
                case IdStrategy.RANDOM:
                    return parsed.id.length === this.config.defaultLength;
                case IdStrategy.NANO:
                    return /^[A-Za-z0-9_-]+$/.test(parsed.id);
                case IdStrategy.SNOWFLAKE:
                    return /^\d+$/.test(parsed.id);
                default:
                    return false;
            }
        } catch {
            return false;
        }
    }
}

/**
 * 导出单例实例
 */
export const idGenerator = new IdGenerator();

/**
 * 快捷方法：生成 UUID
 */
export function generateUUID(prefix?: string): string {
    return idGenerator.generate(IdStrategy.UUID, prefix);
}

/**
 * 快捷方法：生成时间戳 ID
 */
export function generateTimestampId(prefix?: string): string {
    return idGenerator.generate(IdStrategy.TIMESTAMP, prefix);
}

/**
 * 快捷方法：生成随机 ID
 */
export function generateRandomId(length: number = 16, prefix?: string): string {
    return idGenerator.generate(IdStrategy.RANDOM, prefix, { length });
}

/**
 * 快捷方法：生成 Nano ID
 */
export function generateNanoId(length: number = 21, prefix?: string): string {
    return idGenerator.generate(IdStrategy.NANO, prefix, { length });
}