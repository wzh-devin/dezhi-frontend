/**
 * 2025/12/7 21:55.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 后台仪表盘页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const Dashboard: FC = () => {
  return (
    <div className={style['dashboard']}>
      <div className={style['dashboard__placeholder']}>
        <h2>仪表盘</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(Dashboard)
