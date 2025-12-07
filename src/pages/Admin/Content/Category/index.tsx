/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 分类管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const Category: FC = () => {
  return (
    <div className={style['category']}>
      <div className={style['category__placeholder']}>
        <h2>分类管理</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(Category)

