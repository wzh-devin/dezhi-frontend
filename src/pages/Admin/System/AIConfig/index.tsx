/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description AI智能体配置页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const AIConfig: FC = () => {
  return (
    <div className={style['ai-config']}>
      <div className={style['ai-config__placeholder']}>
        <h2>AI智能体配置</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(AIConfig)

