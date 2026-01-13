import { request } from 'umi'; 
import {
} from './typings';

/**
 * 流式聊天 POST /api/v1/admin/ai/chat/stream
 */
export async function chatStream (
  data?: {
    /** 会话id */
    sessionId?: string;
    /** 消息 */
    message?: string;
    /** 搜索数量 */
    topK?: number;
    /** 流式返回 */
    stream?: boolean;
  },
  options?: Record<string, any>,
) {
  return request<ServerSentEventChatResponse[]>(`/api/v1/admin/ai/chat/stream`, {
    method: 'POST',
    data: {
      ...data,
    },
    ...(options || {}),
  });
}
