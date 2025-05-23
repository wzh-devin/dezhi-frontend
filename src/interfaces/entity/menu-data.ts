/**
 * 2025/5/23 23:59
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 菜单数据接口
 * @version 1.0
 * @since 1.0
 */

export interface MenuData {
  /**
   * 菜单id
   */
  id: number
  /**
   * 菜单key
   */
  key: string
  /**
   * 菜单名称
   */
  name: string
  /**
   * 二级菜单
   */
  children: MenuData[] | null
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 更新时间
   */
  updateTime: string
}
