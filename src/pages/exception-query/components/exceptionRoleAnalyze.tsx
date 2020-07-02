//异常信息角色分析
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';
import { getExceptionRoleAnalyze } from '@/services/exception';
import { Switch } from 'umi';

export default () => {

  const [ymd, setYmd] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [studentNum, setStudentNum] = useState(0);
  const [teacherNum, setTeacherNum] = useState(0);
  const [workerNum, setWorkerNum] = useState(0);
  const [guestNum, setGuestNum] = useState(0);

  useEffect(()=>{
    getExceptionRoleAnalyzeFn(ymd);
  },[]);


  const selectTime = (ymd:number) => {
    setYmd(ymd);
    getExceptionRoleAnalyzeFn(ymd);
  };

  const getExceptionRoleAnalyzeFn = (ymd:number) => {
    getExceptionRoleAnalyze({ymd}).then(res=>{
      let total =  0;
      if (!res.data) return;
      res.data.list.map((item) => {
        switch (item.roleId) {
          case 1:// 学生
            setStudentNum(item.total);
            break;
          case 2:// 教师
            setTeacherNum(item.total);
            break;
          case 3:// 后勤
            setWorkerNum(item.total);
            break;
          case 4:// 访客
            setGuestNum(item.total);
            break;
          default:
            break;
        }
        total = total + item.total;
      })
      setTotalCount(total);
    });
  };

  //学生
  const studentOptions = {
    series: [
      {
        silent:true,
        name: '学生',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: totalCount - studentNum,
            name: '总异常人数',
            itemStyle:{
              color:'rgba(56, 220, 255,0.2)',
            },
            label: {
              show:false,
            }
          },
          {
            value: studentNum,
            name: '学生异常人数',
            label: {
              formatter: '{d}%',
              show: true,
              position: 'center',
              color: 'rgb(56, 220, 255)',
              fontSize: 18
            },
            itemStyle:{
              color: studentNum == 0 ? 'rgba(56, 220, 255,0.2)' : 'rgb(56, 220, 255)'
            },
          },
        ],
      }
    ]
  };

  //老师
  const teacherOptions = {
    series: [
      {
        silent:true,
        name: '教师',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: totalCount - teacherNum,
            name: '总异常人数',
            itemStyle:{
              color:'rgba(131, 146, 255,0.2)',
            },
            label: {
              show:false,
            }
          },
          {
            value: teacherNum,
            name: '教师异常人数',
            label: {
              formatter: '{d}%',
              show: true,
              position: 'center',
              color: 'rgb(131, 146, 255)',
              fontSize: 18
            },
            itemStyle:{
              color: teacherNum == 0 ? 'rgba(131, 146, 255,0.2)' : 'rgb(131, 146, 255)'
            },
          },
        ],
      }
    ]
  };

  //后勤
  const logisticsOptions = {
    series: [
      {
        silent:true,
        name: '后勤',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: totalCount - workerNum,
            name: '总异常人数',
            itemStyle:{
              color:'rgba(87, 237, 126,0.2)',
            },
            label: {
              show:false,
            }
          },
          {
            value: workerNum,
            name: '后勤异常人数',
            label: {
              formatter: '{d}%',
              show: true,
              position: 'center',
              color: 'rgb(87, 237, 126)',
              fontSize: 18
            },
            itemStyle:{
              color: workerNum == 0 ? 'rgba(87, 237, 126,0.2)' :'rgb(87, 237, 126)'
            },
          },
        ],
      }
    ]
  };

  //访客
  const visitorsOptions = {
    series: [
      {
        silent:true,
        name: '访客',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: totalCount - guestNum,
            name: '总异常人数',
            itemStyle:{
              color:'rgba(36, 160, 255,0.2)',
            },
            label: {
              show:false,
            }
          },
          {
            value: guestNum,
            name: '访客异常人数',
            label: {
              formatter: '{d}%',
              show: true,
              position: 'center',
              color: 'rgb(36, 160, 255)',
              fontSize: 18
            },
            itemStyle:{
              color: guestNum == 0 ? 'rgba(36, 160, 255,0.2)' :'rgb(36, 160, 255)'
            },
          },
        ],
      }
    ]
  };

  return(
    <div className={styles.analyze}>
      <div className={styles.title}>
        <div className={styles.text}>异常信息角色分析</div>
        <div className={styles.time}>
          <span className={ymd == 1 ? styles.active : ''} onClick={()=>selectTime(1)}>月|</span>
          <span className={ymd == 0 ? styles.active : ''} onClick={()=>selectTime(0)}>日</span>
        </div>
      </div>
      <div className={styles.graph}>
        <div className={styles.student}>
          <ECharts option={studentOptions} />
          <div className={styles.graphDes}>学生：<span>{studentNum}</span>人</div>
        </div>
        <div className={styles.teacher}>
          <ECharts option={teacherOptions} />
          <div className={styles.graphDes}>教师：<span>{teacherNum}</span>人</div>
        </div>
        <div className={styles.logistics}>
          <ECharts option={logisticsOptions} />
          <div className={styles.graphDes}>后勤：<span>{workerNum}</span>人</div>
        </div>
        <div className={styles.visitors}>
          <ECharts option={visitorsOptions} />
          <div className={styles.graphDes}>访客：<span>{guestNum}</span>人</div>
        </div>
      </div>
    </div>
  )
};
