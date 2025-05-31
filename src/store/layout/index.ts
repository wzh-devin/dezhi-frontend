import { defineStore } from 'pinia'
import type { ItemType } from 'ant-design-vue'

/**
 * 2025/5/21 18:43
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 布局页面
 * @version 1.0
 * @since 1.0
 */
interface LayoutState {
  activeItem: ItemType
}

const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    activeItem: null,
  }),
  actions: {
    /**
     * 设置激活的菜单项
     * @param item
     */
    setActiveItemAction(item: ItemType) {
      this.activeItem = item
    },
  },
})

export default useLayoutStore
