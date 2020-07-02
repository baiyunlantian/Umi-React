import React, { useEffect, useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd'
import styles from './index.less';

export default ({ visible,footer = 1, width, height, title, children, onClose, visibleType = 0 }) => {

  const style = visibleType ?
    { visibility: visible ? 'visible' : 'hidden' }
    :
    { display: visible ? 'block' : 'none' };
  return (
    <div
      style={style}
      onClick={onClose}
      className={styles.customModalMask}
    >
      <div
        onClick={e => {
          e.stopPropagation();
        }}
        style={{
          position:'relative',
          width: `${width}%`,
          left: `${(100 - width) / 2}%`,
          height: `${height}%`,
          top: `${(100 - height) / 2}%`,
        }}
        className={styles.customModal}
      >
        <div className={styles.modalHeader}>
          <span>{title}</span>
          <CloseOutlined onClick={onClose} className={styles.closeIcon} />
        </div>
        <div className={styles.modalContent}>{children}</div>
        {
          footer &&
            <div className={styles.footer}>
              <Button>保存</Button>
            </div>
        }

      </div>
    </div>
  );
};
