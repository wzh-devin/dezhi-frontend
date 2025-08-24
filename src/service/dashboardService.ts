import { get } from '@/utils/http/axios'
import type { ApiResultDashboardVO } from './typings'

/**
 * 获取仪表盘数据 GET /api/v1/dashboard
 */
export async function getDashboardInfo(options?: Record<string, unknown>): Promise<ApiResultDashboardVO> {
  return get({
    url: `/api/v1/dashboard`,
    ...(options || {}),
  })
}
