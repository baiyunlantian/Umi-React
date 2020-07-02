//某校区实时访客人数统计
import React, { useState, useEffect } from 'react';
import { getCampusVisitor} from '@/services/campus';
import styles from '../index.less';

export default ({campusName}) => {

  const [visitorProps, setVisitorProps] = useState({
    isArrive:0,
    ratioArrive:0,
    isVerify:0,
    ratioVerify:0
  });
  const [ymd, setYmd] = useState(0);

  useEffect(()=>{
    getCampusVisitor({ymd}).then(res=>{
      if (res.data) setVisitorProps(res.data);
    });
  },[]);

  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getCampusVisitor({ymd}).then(res=>{
      if (res.data) setVisitorProps(res.data);
    });
  };



  return(
    <div className={styles.visitor}>
      <div className={styles.title}>
  <div className={styles.text}>{campusName}实时访客统计</div>
        <div className={styles.time}>
          <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
          <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
        </div>
      </div>
      <div className={styles.visitorType}>
        <div>
          <div className={styles.visitorTypeTitle}>今日来访人数</div>
          <div className={styles.visitorTypeContent}>
            <div><span>{visitorProps.isArrive}</span>人</div>
            <div>环比<span>{visitorProps.ratioArrive || 0}</span>%</div>
          </div>
        </div>
        <div>
          <div className={styles.visitorTypeTitle}>今日预约人数</div>
          <div className={styles.visitorTypeContent}>
            <div><span>{visitorProps.isVerify}</span>人</div>
            <div>环比<span>{visitorProps.ratioVerify || 0}</span>%</div>
          </div>
        </div>
      </div>
    </div>
  )
};
