import React from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../history-query.less';

export default ({info:classInfo, census, haveRule}) => {

  //班级男女占比
  const classOptions = {
    series: [
      {
        name: '班级人数',
        type: 'pie',
        radius: ['45%', '54%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          {
            value: classInfo.girlCount || 0,
            name: '女生',
            itemStyle:{
              color:'rgb(131, 146, 255)',
            },
            label: {
              show:true,
              formatter:'女：{c}人\n占{d}%',
              fontSize: 14,
            }
          },
          {
            value: classInfo.boyCount || 0,
            name: '男生',
            label: {
              show: true,
              color: '#63f9fe',
              fontSize: 14,
              formatter:'男：{c}人\n占{d}%',
            },
            itemStyle:{
              color: 'rgb(0, 255, 255)'
            },
          },
        ],
      },
      {
        name: '内环',
        type: 'pie',
        radius: ['39%', '40%'],
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: '男女\n占比',
            itemStyle:{
              color:'rgb(30, 87, 119)',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 255, 255,1)',
            },
            label:{
              color: '#fff',
              fontSize: 14,
              position:'center'
            }
          },
        ],
      }
    ]
  };

  //出勤率
  const studentOptions = {
    series: [
      {
        name: '出勤率',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          //右半圆
          {
            value: 1,
            name: '',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(55, 218, 252,1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(45, 160, 190,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          //左半圆
          {
            label:{
              show:true,
              color:'rgba(55, 218, 252,1)',
              fontSize:20,
              position:'center',
            },
            value: 1,
            name: `${census.ratioAttendance * 100}%` || '0%',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(25, 52, 76,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(45, 160, 190,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }],
      }
    ]
  };

  //迟到率
  const teacherOptions = {
    series: [
      {
        name: '迟到率',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          //右半圆
          {
            value: 1,
            name: '',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(234, 169, 93,1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(46, 53, 64,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          //左半圆
          {
            label:{
              show:true,
              color:'rgba(234, 169, 93,1)',
              fontSize:20,
              position:'center',
            },
            value: 1,
            name: `${census.ratioLate * 100}%` || '0%',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(23, 39, 60,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(46, 53, 64,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }],
      }
    ]
  };

  //早退率
  const logisticsOptions = {
    series: [
      {
        name: '早退率',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        data: [
          //右半圆
          {
            value: 1,
            name: '',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(247, 35, 36,1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(80, 38, 53,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          },
          //左半圆
          {
            label:{
              show:true,
              color:'rgba(247, 35, 36,1)',
              fontSize:20,
              position:'center',
            },
            value: 1,
            name: `${census.ratioLeave * 100}%` || '0%',
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgb(23, 39, 60,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(80, 38, 53,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }],
      }
    ]
  };

  return (
    <div className={styles.classInfoTop}>
      <div className={styles.info}>
        <div className={styles.title}>班级信息</div>
        <div className={styles.content}>
          <div className={styles.classLeft}>
            <div className={styles.item}>
              班级名称：<span className={styles.BlueColor}>{classInfo.className || ''}</span>
            </div>
            <div className={styles.item}>
              班主任：<span className={styles.BlueColor}>{classInfo.teacherName || ''}</span>
              </div>
            <div className={styles.item}>
              联系电话：<span className={styles.BlueColor}>{classInfo.phone || ''}</span>
            </div>
            <div className={styles.item}>
              班级人数：<span className={styles.BlueColor}>{classInfo.boyCount + classInfo.girlCount || 0}人</span>
            </div>
          </div>
          <div className={styles.graph}>
            <ECharts option={classOptions} />
          </div>
        </div>
      </div>
      <div className={styles.statistics}>
        <div className={styles.title}>考勤统计</div>
        {
          haveRule == true
            ?
            <div className={styles.classInfoContent}>
              <div className={styles.left}>
                <div className={styles.item}>
                  <div className={styles.text}>总考勤天数：</div>
                  <span className={styles.blueColor}>{census.attendanceNum}</span>天
                </div>
                <div className={styles.item}>
                  <div className={styles.text}>迟到次数：</div>
                  <span style={{color:'rgb(255, 184, 101)'}}>{census.lateAttendanceNum}</span>天
                </div>
                <div className={styles.item}>
                  <div className={styles.text}>早退次数：</div>
                  <span style={{color:'rgb(255, 0, 0)'}}>{census.leaveAttendanceNum}</span>天
                </div>
              </div>
              <div className={styles.graphList}>
                <div className={styles.student}>
                  <div className={styles.graph}><ECharts option={studentOptions} /></div>
                  <div className={styles.graphDes}>出勤率</div>
                </div>
                <div className={styles.teacher}>
                  <div className={styles.graph}><ECharts option={teacherOptions} /></div>
                  <div className={styles.graphDes}>迟到率</div>
                </div>
                <div className={styles.logistics}>
                  <div className={styles.graph}><ECharts option={logisticsOptions} /></div>
                  <div className={styles.graphDes}>早退率</div>
                </div>
              </div>
            </div>
            :
            <div>无考勤记录</div>
        }
      </div>
    </div>
  )
};
