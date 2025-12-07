/**
 * 2025/12/7.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 文件素材管理页面
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import style from './index.less'

const File: FC = () => {
  return (
    <div className={style['file']}>
      <div className={style['file__placeholder']}>
        <h2>文件素材管理</h2>
        <p>内容区域待实现...</p>
      </div>
    </div>
  )
}

export default memo(File)

