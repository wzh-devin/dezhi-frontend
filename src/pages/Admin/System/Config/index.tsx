/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 系统配置页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const Config: FC = () => {
  return (
    <div className={style['config']}>
      <div className={style['config__placeholder']}>
        <h2>系统配置</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(Config)

