//校区人数模块
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '@/pages/index.less';

export default ({total,list,campusId}) => {

  const options = {
    title:{
      show:true,
      text:'各校区人数统计',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
    },
    color:['rgb(58, 255, 148)','rgb(182, 161, 255)','rgb(0, 255, 255)','rgb(46, 144, 255)'],
    tooltip: {
      trigger: 'item',
      formatter: '{d}%',
      position: ['41%', '36.5%'],
      backgroundColor:'rbga(0,0,0,0)',
      show:true,
      textStyle:{
        fontSize:18,
        color:'#fefefe',
      }
    },
    legend: {
      bottom:'5%',
      itemWidth:10,
      itemHeight:10,
      textStyle:{
        color:'#fff',
        fontSize:12,
      }
    },
    series: [
      {
        name: '各校区人数',
        type: 'pie',
        radius: ['75%', '95%'],
        avoidLabelOverlap: false,
        width:'65%',
        height:'55%',
        left:'17.5%',
        top:'15%',
        label:{
          show:false,
        },
        labelLine: {
          show:false,
          length:20,
          length2:50,
        },
        emphasis: {
          labelLine: {
            show:true,
          },
          label:{
            show:true,
            formatter:'{c}',
            fontSize:18,
          }
        },
        data: list
      },
    ]
  };

  return (
      <div className={styles.peopleCount}>
        <div className={styles.title}>
          <div className={styles.titleLeft}>{campusId == null ? '学校' : '校区'}人数统计</div>
          <div className={styles.titleRight}>
            <span>单位：人</span>
          </div>
        </div>
        <div className={styles.description}>
          <div className={styles.totalPeople}>
            <div className={styles.text}>
              校区总人数
              <span className={styles.number}>{total || 0}</span>
              人
            </div>
          </div>
        </div>
        <div className={styles.graph}>
          <ECharts option={options}/>
        </div>
      </div>
  )
}
