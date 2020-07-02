import React from 'react';
import styles from '../history-query.less';

export default ({info:classInfo, census:classCensus, haveRule}) => {
  return (
    <div className={styles.buildingTop}>
      <div className={styles.info}>
        <div className={styles.title}>寝室信息</div>
        <div className={styles.content}>
          <div className={styles.buildingLeft}>
            <div className={styles.item}>
              楼栋名称：<span className={styles.BlueColor}>{classInfo.dormitoryName || ''}</span>
            </div>
            <div className={styles.item}>
              入住人数：<span className={styles.BlueColor}>{classInfo.studentCount || 0}人</span>
            </div>
            <div className={styles.item}>
              入住班级：<span className={styles.BlueColor}>{classInfo.classCount || 0}个</span>
            </div>
            <div className={styles.item}>
              宿管员：<span className={styles.BlueColor}>{classInfo.workerName || ''}</span>
            </div>
            <div className={styles.item}>
              联系电话：<span className={styles.BlueColor}>{classInfo.phone || ''}</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.statistics}>
        <div className={styles.title}>进出寝室考勤统计</div>
        {
          haveRule == true
            ?
            <div className={styles.buildingContent}>
              <div className={styles.item}>
                <div className={styles.text}>总考勤天数：<span style={{color:'rgb(56, 220, 255)'}}>{classCensus.allDayNum || 0}</span>天</div>
                <div className={styles.text}>总考勤次数：<span style={{color:'rgb(56, 220, 255)'}}>{classCensus.allAttendNum || 0}</span>次</div>
              </div>
              <div className={styles.item}>
                <div className={styles.text}>正常考勤次数：<span style={{color:'rgb(30, 251, 124)'}}>{classCensus.normalAttendNum || 0}</span>次</div>
                <div className={styles.text}>
                  <div style={{display:'inline-block',visibility:'hidden'}}>占格</div>
                  漏勤次数：<span style={{color:'rgb(255, 0, 0)'}}>{classCensus.errorCount || 0}</span>次</div>
              </div>
              <div className={styles.item}>
                <div className={styles.text}>超时未离寝：<span style={{color:'rgb(255, 0, 0)'}}>{classCensus.passTimeNotLeave || 0}</span>次</div>
                <div className={styles.text}>超时未归寝：<span style={{color:'rgb(255, 0, 0)'}}>{classCensus.passTimeNotBack || 0}</span>次</div>
              </div>
              <div className={styles.item}>
                <div className={styles.text}>超时已离寝：<span style={{color:'rgb(255, 0, 0)'}}>{classCensus.passTimeLeave || 0}</span>次</div>
                <div className={styles.text}>超时已归寝：<span style={{color:'rgb(255, 0, 0)'}}>{classCensus.passTimeBack || 0}</span>次</div>
              </div>
            </div>
            :
            <div>无考勤记录</div>
        }
      </div>
    </div>
  )
};
