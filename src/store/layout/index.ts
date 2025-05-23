import { defineStore } from 'pinia'
import type { ItemType } from 'ant-design-vue'
import { getMenuData } from '../../api/menu'
import type { MenuData } from '../../interfaces/entity/menu-data.ts'
/**
 * 2025/5/21 18:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 布局页面
 * @version 1.0
 * @since 1.0
 */
interface LayoutState {
  activeItem: ItemType
  menuData: MenuData[]
}

const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    activeItem: null,
    menuData: [],
  }),
  actions: {
    /**
     * 设置激活的菜单项
     * @param item
     */
    setActiveItemAction(item: ItemType) {
      this.activeItem = item
    },
    /**
     * 获取菜单数据
     */
    async getMenuData(): Promise<MenuData[]> {
      this.menuData = await getMenuData()
    },
  },
})

export default useLayoutStore
