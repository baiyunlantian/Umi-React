//体温统计模块
import React, { useState, useEffect } from 'react';
import ECharts from '@/pages/components/echart';
import styles from '@/pages/index.less';

export default ({total, normal, exception, roleList,campusId}) => {

  const handleData = () => {
    let data = [];

    (roleList || []).map((item, index) => {
      if (item.bodyState === 1) {
        data.push({value:item.total, name:item.roleName});
      }
    });
    return data;
  };

  //体温统计
  const option = {
    title:{
      show:true,
      text:'异常体温角色分析',
      textStyle:{
        color:'#fefefe',
        fontSize: 16,
      },
      top: 10,
      left: 10,
    },
    color:['rgb(58, 255, 148)','rgb(182, 161, 255)','rgb(38, 171, 255)','rgb(46, 144, 255)'],
    legend: [
      {
        orient: 'horizontal',
        bottom:'3%',
        itemHeight:10,
        itemWidth:10,
        textStyle:{
          color:'#fff',
          fontSize:12,
        }
      }
    ],
    series: [
      {
        name: '访问来源',
        type: 'pie',
        width: '50%',
        left:'25%',
        bottom:'2%',
        zlevel:1,
        data: [
          {value: 0, name: ''},
        ],
        label:{show:false},
        itemStyle:{
          color:'rgba(46, 144, 255, 0.2)'
        },
      },
      {
        zlevel:2,
        name: '异常体温角色分析',
        type: 'pie',
        radius: ['0%', '95%'],
        avoidLabelOverlap: false,
        width:'65%',
        height:'55%',
        left:'17.5%',
        top:'21%',
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
        data: handleData()
      }]
  };

  return (
    <div className={styles.animalHeat}>
      <div className={styles.title}>
        <div className={styles.titleLeft}>{campusId == null ? '学校' : '校区'}体温统计</div>
        <div className={styles.titleRight}>
          <span>单位：人</span>
        </div>
      </div>
      <div className={styles.description}>
        <div className={styles.totalPeople}>
          <div className={styles.text}>体温统计</div>
          <div className={styles.number}>
            {
              total && total.toString().padStart(5, '0').split("").map((item)=>{
                return(
                  <span>{item}</span>
                )
              })
            }
          </div>
        </div>
      </div>
      <div className={styles.graph}>
        <ECharts option={option}/>
      </div>
      <div className={styles.heatBottom}>
        <div className={styles.normalHeat}>
          <div className={styles.heatType}>
            正常体温统计:
          </div>
          <div className={styles.heatCount}>
            <span>{normal}</span>人
          </div>
        </div>
        <div className={styles.exceptionHeat}>
          <div className={styles.heatType}>
            异常体温统计:
          </div>
          <div className={styles.heatCount}>
            <span>{exception}</span>人
          </div>
        </div>
      </div>
    </div>
  )
}
