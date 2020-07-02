//异常信息统计
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';

export default (
  {
    messageTotal,
    ratioMessageTotal,
    realTimeExceptionCount,
    ratioPersonTotal,
  }) => {

  //今日异常统计
  const option = {
    series: [
      {
        silent:true,
        name: '今日异常统计',
        type: 'pie',
        radius: ['85%', '95%'],
        left:'center',
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
                    color: 'rgba(223, 6, 8,1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(95, 35, 49,0.5)' // 100% 处的颜色
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
              color:'rgb(255, 255, 255)',
              fontSize:14,
              position:'center',
            },
            value: 1,
            name: ratioPersonTotal != null ? (ratioPersonTotal * 100).toFixed(2) +'%' : '0%', //显示的总人数占比
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
                    color: 'rgb(95, 35, 49,0.1)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(95, 35, 49,0.5)' // 100% 处的颜色
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
        radius: ['0%', '75%'],
        avoidLabelOverlap: false,
        label: {show: true,position:'center'},
        labelLine: { show: false },
        data: [
          {
            value: ratioMessageTotal || 0,
            name: '',
            itemStyle:{
              color: 'rgba(255,0,0,0.3)'
            },
            label:{
              show:true,
              position:'center',
              padding:[30,0,0,0],
              color:'rgb(255, 255, 255)',
              fontSize: 12,
            },
          },
        ],
      }]
  };

  return(
    <div className={styles.statistics}>
      <div className={styles.title}>
        <div className={styles.text}>异常信息统计</div>
      </div>
      <div className={styles.content}>
        <div className={styles.today}>
          <div className={styles.left}>
            <div className={styles.info}>
              <div className={styles.colOne}>
                <div className={styles.text}>今日异常信息统计</div>
                <div className={styles.number}><span>{messageTotal || 0}</span>条</div>
              </div>
            </div>
          </div>
          <div className={styles.graph}>
            <ECharts option={option}/>
          </div>
        </div>
        <div className={styles.realTime}>
          <div className={styles.info}>
            <div className={styles.colOne}>
              <div className={styles.text}>实时异常信息统计</div>
              <div className={styles.number}><span>{realTimeExceptionCount}</span>条</div>
            </div>
            <div className={styles.colTwo}>
              <div className={styles.text}>环比增长：</div>
              <div className={styles.number}><span>{ratioMessageTotal != null ? ratioMessageTotal.toFixed(2)  : 0}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
