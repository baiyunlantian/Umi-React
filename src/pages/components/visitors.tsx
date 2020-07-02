//访客统计模块
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '@/pages/index.less';

export default ({isArrive, isVerify, ratioArrive, ratioVerify,campusId}) => {

  //来访统计
  const visitorOptions = {
    title:{
      show:true,
      text:'今日来访人数',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
      subtext:'环比增长:',
      subtextStyle:{
        color:'#fefefe',
        fontSize: 14,
        height:'30px',
        lineHeight:'30',
      }
    },
    series: [
      {
        silent:true,
        name: '今日来访人数',
        type: 'pie',
        radius: ['55%', '65%'],
        left:'40%',
        avoidLabelOverlap: false,
        label:{show:false},
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
                    color: 'rgba(29, 47, 65,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(64, 147, 137,0.5)' // 100% 处的颜色
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
              color:'rgb(111, 238, 174)',
              fontSize:24,
              padding:[0,15,0,0],
            },
            value: 1,
            name: ratioArrive || 0,
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
                    color: 'rgb(111, 238, 174)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(64, 147, 137,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }],
      },
      {
        silent:true,
        name: '内环',
        type: 'pie',
        radius: ['47%', '48%'],
        left:'40%',
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: 0,
            name: isArrive || 0 + '人',
            itemStyle:{
              borderColor:'rgb(111, 238, 174)',
              borderWidth: 2,
              borderType:'dotted',
            },
            label:{
              show:true,
              position:'center',
              color:'rgb(111, 238, 174)',
              fontSize: 18,
            },
          },
        ],
      }]
  };

  //预约统计
  const appointmentOptions = {
    title:{
      show:true,
      text:'今日预约人数',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
      subtext:'环比增长:',
      subtextStyle:{
        color:'#fefefe',
        fontSize: 14,
        height:'30px',
        lineHeight:'30',
      }
    },
    series: [
      {
        silent:true,
        name: '今日预约人数',
        type: 'pie',
        radius: ['55%', '65%'],
        left:'40%',
        avoidLabelOverlap: false,
        label:{show:false},
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
                    color: 'rgba(29, 47, 65,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(101, 84, 149,0.5)' // 100% 处的颜色
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
              color:'rgb(191, 112, 247)',
              fontSize:24,
              padding:[0,15,0,0],
            },
            value: 1,
            name: ratioVerify || 0,
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
                    color: 'rgb(191, 112, 247)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(101, 84, 149,0.5)' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }],
      },
      {
        silent:true,
        name: '内环',
        type: 'pie',
        radius: ['47%', '48%'],
        left:'40%',
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        emphasis:{
          itemStyle:{
            opacity:0
          }
        },
        data: [
          {
            value: 0,
            name: isVerify || 0 + '人',
            itemStyle:{
              borderColor:'rgb(191, 112, 247)',
              borderWidth: 2,
              borderType:'dotted',
            },
            label:{
              show:true,
              position:'center',
              color:'rgb(191, 112, 247)',
              fontSize: 18,
            },
          },
        ],
      }]
  };

  return (
    <div className={styles.visitor}>
      <div className={styles.title}>
        <div className={styles.titleLeft}>{campusId == null ? '学校' : '校区'}访客统计</div>
        <div className={styles.titleRight}>
          <span>单位：人</span>
        </div>
      </div>
      <div className={styles.graph}>
        <div className={styles.whitePoint}></div>
        <ECharts option={visitorOptions}/>
      </div>
      <div className={styles.graph}>
        <div className={styles.whitePoint}></div>
        <ECharts option={appointmentOptions}/>
      </div>
    </div>
  )
}
