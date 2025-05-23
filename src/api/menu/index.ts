import { get } from '../../utils/http/axios'
import type { MenuData } from '../../interfaces/entity/menu-data.ts'

/**
 * 2025/5/23 23:54
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 菜单请求
 * @version 1.0
 * @since 1.0
 */

/**
 * 获取菜单数据
 * @return void
 */
const getMenuData = async (): Promise<MenuData[]> => {
  return await get({
    url: '/menu',
  })
}

export { getMenuData }
