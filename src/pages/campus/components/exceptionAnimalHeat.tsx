//某校区实时异常体温统计
import React, { useState, useEffect } from 'react';
import echarts from 'echarts/lib/echarts';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';

export default ({list, campusName}) => {
  //异常体温
  const option = {
    dataZoom:{
      type:'inside',
      show:false,
      start:0,
      end:100,
      maxValueSpan:8,
    },
    color: ['#3398DB'],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: list.map((item) => {return item.name}),
        axisTick: {
          alignWithLabel: true,
          show:false
        },
        axisLabel:{
          color:'white'
        },
        axisLine:{
          lineStyle:{
            color:'white'
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        min:36.0,
        max:39.5,
        axisTick: {
          show:false
        },
        axisLabel:{
          color:'white'
        },
        axisLine:{
          show:false
        },
        splitLine: {
          lineStyle: {
            color: 'gray',
            type:'dotted'
          }
        },
      }
    ],
    series:
      {
        name: '直接访问',
        type: 'bar',
        barWidth: '30%',
        data: list.map((item) => {return item.temp}),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(
            0, 0, 0, 1,
            [
              {offset: 0, color: 'rgb(56, 217, 253)'},
              {offset: 1, color: 'rgba(56, 217, 253,0.3)'}
            ]
          )
        },
        emphasis:{
          label:{
            show:true,
            color:'rgb(56, 217, 253)',
            position:'top'
          }
        },
        markLine:{
          data:[
            {
              name:'1',
              yAxis:37.3,
              symbol:'none',
              lineStyle:{
                color:'rgb(255,0,0)'
              }
            }

          ]
        },
      },

  };

  return(
    <div className={styles.bottomRight}>
      <div className={styles.title}>
        <div className={styles.text}>{campusName}异常体温统计分析</div>
      </div>
      <ECharts option={option} />
    </div>
  )
};
