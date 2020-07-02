//某校区实时在校人数统计
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '../index.less';

export default ({list, campusName}) => {
  //人数统计
  const option = {
    tooltip:{
      backgroundColor :'rgba(50, 110, 143,0.5)',
      textStyle:{
        color:'#fff'
      },
      formatter:'{c}',
      extraCssText:'width:70px;height:30px;text-align:center;font-size:18px'
    },
    xAxis: {
      axisLine:{
        lineStyle:{
          color:'#c7c7c7'
        }
      },
      axisTick:{
        alignWithLabel:true,
        inside:true
      },
      type: 'category',
      data: list.map((item) => {return item.time+':00'})
    },
    yAxis: {
      type: 'value',
      axisLine:{
        lineStyle:{
          color:'#c7c7c7'
        }
      },
      axisTick:{
        show:false
      },
      splitLine:{
        lineStyle:{
          color:'gray',
          type:'dotted'
        }
      }
    },
    dataZoom: {
      // startValue: '8:00',
      // endValue:'20:00',
      type: 'inside',
      show:false,
    },
    series: [{
      data: list.map((item) => {return item.count}),
      type: 'line',
      smooth: true,
      connectNulls:true,
      symbolSize:5,
      emphasis:{
        itemStyle:{
          color:'rgb(73, 199, 248)',
          borderColor:'white',
          borderWidth:1
        },
      },
      itemStyle:{
        color:{
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgb(55, 249, 250)' // 0% 处的颜色
          }, {
            offset: 0.33, color: 'rgb(55, 249, 250)' // 0% 处的颜色
          },{
            offset: 0.66, color: 'rgb(17, 105, 255)' // 100% 处的颜色
          },
            {
              offset: 1, color: 'rgb(73, 199, 248)' // 100% 处的颜色
            }],
          global: false // 缺省为 false
        }
      }
    }]
  };

  return(
    <div className={styles.topLeft}>
      <div className={styles.title}>
        <div className={styles.text}>{campusName}实时人数统计</div>
      </div>
      <ECharts option={option} />
      <div className={styles.total}>{campusName}实时人数总结：<span>{list.reduce((total, num) => total + num.count, 0)}</span>人</div>
    </div>
  )
};
