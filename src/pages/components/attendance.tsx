//校区考勤统计模块
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '@/pages/index.less';

// 总考勤 未考勤, 正常考勤
export default ({allTotal, notAttendanceTotal, alreadyAttendanceTotal,campusId}) => {
  const rationotattendance = notAttendanceTotal/allTotal;
  //考勤分析
  const option = {
    title:{
      show:true,
      text:'考勤分析',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
    },
    series: [
      {
        silent:true,
        name: '已考勤',
        type: 'pie',
        radius: ['53%', '62%'],
        avoidLabelOverlap: false,
        labelLine: {
          show: false
        },
        zlevel:2,
        data: [
          {
            value: notAttendanceTotal,
            name: '未考勤',
            itemStyle:{
              color:'red',
              opacity:0
            },
            label: {
              show:false,
            }
          },
          {
            value: alreadyAttendanceTotal,
            name: '已考勤',
            label: {
              show: true,
              position: 'center',
              color: '#63f9fe',
              fontSize: 20,
              formatter:'{d}%'
            },
            itemStyle:{
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgb(62, 178, 245)' // 0% 处的颜色
                }, {
                  offset: 0.32, color: 'rgb(6, 66, 215)' // 32% 处的颜色
                },{
                  offset: 1, color: 'rgb(99, 249, 254)' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            },
          },
        ],
        startAngle:90,
      },
      {
        silent:true,
        name: '黑环',
        type: 'pie',
        radius: ['55%', '60%'],
        avoidLabelOverlap: false,
        labelLine: { show: false },
        zlevel:1,
        label:{show:false},
        data: [
          { value: 1, name: '黑环', itemStyle:{color:'rgb(22, 37, 52)'}},
        ],
        startAngle:3.6,
        selectedOffset:20,
      },
      {
        silent:true,
        name: '内环',
        type: 'pie',
        radius: ['47%', '48%'],
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: rationotattendance,
            name: '已考勤',
            itemStyle:{
              color:'rgb(30, 87, 119)',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 255, 255,1)',
            },
            label:{
              color: '#63f9fe',
              fontSize: 12,
              padding:[42,0,0,0],
            }
          },
        ],
      }
    ]
  };

  return (
    <div className={styles.attendance}>
      <div className={styles.title}>
        <div className={styles.titleLeft}>{campusId == null ? '学校' : '校区'}考勤统计</div>
        <div className={styles.titleRight}>
          <span>单位：人</span>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.totalPeople}>
          <div className={styles.number}>考勤总人数<span>{allTotal || 0}</span>人</div>
        </div>
        <div>
          <div className={styles.hadAttendance}>
            <div className={styles.text}>已考勤人数</div>
            <div className={styles.number}><span>{alreadyAttendanceTotal || 0}</span>人</div>
          </div>
          <div className={styles.notAttendance}>
            <div className={styles.text}>未考勤人数</div>
            <div className={styles.number}><span>{notAttendanceTotal || 0}</span>人</div>
          </div>
        </div>
      </div>
      <div className={styles.graph}>
        <ECharts option={option}/>
      </div>
    </div>
  )
}
