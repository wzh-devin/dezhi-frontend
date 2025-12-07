/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 标签管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const Tags: FC = () => {
  return (
    <div className={style['tags']}>
      <div className={style['tags__placeholder']}>
        <h2>标签管理</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(Tags)

