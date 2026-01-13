/**
 * 2025/12/4 00:10.
 *
 * @author <a href="https://github.com/wzh-devin">devin</a>
 * @description 公告横幅组件
 * @version 1.0.0
 * @since 1.0.0
 */
import { memo, useState } from 'react'
import type { FC } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import styles from './index.less'

/**
 * 公告横幅组件
 * @description 显示网站公告信息，可关闭
 */
const NoticeBanner: FC = () => {
  const [visible, setVisible] = useState(true)
  const noticeText = '我正在参加 Gitee 2025 最受欢迎的开源软件投票活动，快来给我：'

  /**
   * 处理关闭公告
   */
  const handleClose = (): void => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles['notice-banner']}>
      <div className={styles['notice-content']}>
        <span className={styles['notice-text']}>{noticeText}</span>
        <CloseOutlined className={styles['close-icon']} onClick={handleClose} />
      </div>
    </div>
  )
}

export default memo(NoticeBanner)
