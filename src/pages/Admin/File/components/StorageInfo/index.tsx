/**
 * 2025/12/8.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 存储空间信息组件
 * @version 1.0.0
 * @since 1.0.0
 */
import React, { memo } from 'react'
import type { FC } from 'react'
import { Progress } from 'antd'
import { FolderOutlined } from '@ant-design/icons'
import style from './index.less'

interface StorageInfoProps {
  used: number
  total: number
  images: number
  docs: number
}

const StorageInfo: FC<StorageInfoProps> = ({ used, total, images, docs }) => {
  const usagePercent = (used / total) * 100

  return (
    <div className={style['storage-info']}>
      <div className={style['storage-header']}>
        <span className={style['storage-header__title']}>存储空间</span>
        <FolderOutlined className={style['storage-header__icon']} />
      </div>
      <div className={style['storage-usage']}>
        <span className={style['storage-usage__used']}>{used}</span>
        <span className={style['storage-usage__total']}> GB / {total} GB</span>
      </div>
      <Progress
        percent={usagePercent}
        showInfo={false}
        strokeColor="linear-gradient(90deg, #1890ff 0%, #36cfc9 100%)"
        trailColor="#f0f0f0"
        className={style['storage-progress']}
      />
      <div className={style['storage-hint']}>
        已使用 {usagePercent.toFixed(1)}% 的存储空间
      </div>
      <div className={style['storage-detail']}>
        <div className={style['storage-detail__item']}>
          <span className={style['storage-detail__label']}>图片</span>
          <span className={style['storage-detail__value']}>{images} GB</span>
        </div>
        <div className={style['storage-detail__item']}>
          <span className={style['storage-detail__label']}>文档</span>
          <span className={style['storage-detail__value']}>{docs} GB</span>
        </div>
      </div>
    </div>
  )
}

export default memo(StorageInfo)

